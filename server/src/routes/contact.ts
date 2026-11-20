import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { sendEmail } from '../services/email.js';
import { findActiveProductByTitle } from '../repositories/productRepo.js';

const router = express.Router();

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    // Only count requests that went through: a visitor fixing validation errors isn't blocked,
    // and rejected requests send nothing
    skipFailedRequests: true,
    message: { msg: 'Ați trimis prea multe mesaje. Vă rugăm să ne sunați sau să reîncercați mai târziu.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const contactSchema = z
    .object({
        name: z.string().trim().min(2, 'Introduceți numele').max(100),
        phone: z.string().trim().max(30).optional().default(''),
        email: z.union([z.string().trim().email('Adresa de e-mail nu este validă').max(150), z.literal('')]).optional().default(''),
        service: z.string().trim().max(100).optional().default(''),
        // Store product the visitor asked about ("Cere ofertă" on /magazin)
        product: z.string().trim().max(200).optional().default(''),
        message: z.string().trim().min(10, 'Descrieți pe scurt proiectul (minim 10 caractere)').max(5000),
        // Honeypot: hidden in the form, only bots fill it in
        website: z.string().max(0).optional(),
    })
    .refine((d) => d.phone.replace(/\D/g, '').length >= 9 || d.email !== '', {
        message: 'Lăsați un număr de telefon sau o adresă de e-mail ca să vă putem răspunde',
        path: ['phone'],
    });

const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// @route   POST api/contact
// @desc    Quote / contact request from the website, emailed to the office
router.post('/', contactLimiter, async (req, res) => {
    // Bots that fill the honeypot get a fake success and nothing is sent
    if (typeof req.body?.website === 'string' && req.body.website !== '') {
        return res.json({ ok: true });
    }

    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
        const issue = parsed.error.issues[0];
        return res.status(400).json({ msg: issue?.message ?? 'Date invalide', field: issue?.path.join('.') });
    }

    const { name, phone, email, service, message } = parsed.data;
    const siteUrl = process.env.CLIENT_URL || 'https://www.corsican.ro';

    // Only a product that exists in the store is trusted (it goes into the customer's
    // confirmation e-mail); anything else is kept as plain text for the office
    let product = null;
    if (parsed.data.product) {
        try {
            product = await findActiveProductByTitle(parsed.data.product);
        } catch (err) {
            console.error('[contact] Product lookup failed:', err);
        }
    }
    const productName = product?.title || parsed.data.product;
    const productImage = product?.imageUrl ? `${siteUrl}${product.imageUrl}` : '';

    const to = process.env.CONTACT_EMAIL || 'office@corsican.ro';
    const topic = productName ? `produs: ${productName}` : service;
    const subject = `Cerere ofertă${topic ? ` – ${topic}` : ''}: ${name}`;
    const lines = [
        `Nume: ${name}`,
        `Telefon: ${phone || '-'}`,
        `E-mail: ${email || '-'}`,
        productName ? `Produs: ${productName} (${siteUrl}/magazin)` : `Serviciu: ${service || '-'}`,
        '',
        message,
    ];
    const productHtml = productName
        ? `<b>Produs:</b> <a href="${siteUrl}/magazin">${escapeHtml(productName)}</a>`
        : `<b>Serviciu:</b> ${escapeHtml(service || '-')}`;

    try {
        await sendEmail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@corsican.ro',
            to,
            replyTo: email || undefined,
            subject,
            text: lines.join('\n'),
            html: `
        <h2>Cerere de ofertă de pe site</h2>
        <p><b>Nume:</b> ${escapeHtml(name)}<br/>
        <b>Telefon:</b> ${escapeHtml(phone || '-')}<br/>
        <b>E-mail:</b> ${escapeHtml(email || '-')}<br/>
        ${productHtml}</p>
        ${productImage ? `<p><img src="${escapeHtml(productImage)}" alt="${escapeHtml(productName)}" width="240" style="max-width:240px;border-radius:6px"/></p>` : ''}
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
        });
        res.json({ ok: true });

        // Confirmation to the visitor (best-effort). It never repeats what they typed, so the
        // form can't be used to send arbitrary text to someone else's address
        if (email) {
            const about = product ? ` pentru produsul „${product.title}”` : '';
            sendEmail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@corsican.ro',
                to: email,
                replyTo: to,
                subject: 'Am primit cererea dumneavoastră de ofertă – Corsican Engineering',
                text: [
                    'Bună ziua,',
                    '',
                    `Vă mulțumim! Am primit cererea dumneavoastră de ofertă${about}.`,
                    'Vă răspundem în maximum 24 de ore, în zilele lucrătoare (luni–vineri, 08:00–17:00).',
                    '',
                    'Pentru urgențe ne puteți suna la +40 768 515 774. Dacă doriți să adăugați detalii (dimensiuni, cantitate, fotografii), răspundeți la acest e-mail.',
                    '',
                    'Echipa Corsican Engineering',
                    siteUrl,
                ].join('\n'),
                html: `
        <p>Bună ziua,</p>
        <p>Vă mulțumim! Am primit cererea dumneavoastră de ofertă${escapeHtml(about)}.</p>
        <p>Vă răspundem în maximum <b>24 de ore</b>, în zilele lucrătoare (luni–vineri, 08:00–17:00).</p>
        <p>Pentru urgențe ne puteți suna la <a href="tel:+40768515774">+40 768 515 774</a>. Dacă doriți să adăugați detalii (dimensiuni, cantitate, fotografii), răspundeți la acest e-mail.</p>
        <p>Echipa Corsican Engineering<br/><a href="${siteUrl}">${siteUrl.replace(/^https?:\/\//, '')}</a></p>
      `,
            }).catch((e) => console.error(`[email] Quote confirmation failed for ${email}:`, e));
        }
    } catch (err) {
        console.error('[contact] Failed to send quote request email:', err);
        res.status(502).json({ msg: 'Mesajul nu a putut fi trimis. Vă rugăm să ne sunați la +40 768 515 774.' });
    }
});

export default router;
