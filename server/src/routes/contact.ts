import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { sendEmail } from '../services/email.js';

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
    const to = process.env.CONTACT_EMAIL || 'office@corsican.ro';
    const subject = `Cerere ofertă${service ? ` – ${service}` : ''}: ${name}`;
    const lines = [
        `Nume: ${name}`,
        `Telefon: ${phone || '-'}`,
        `E-mail: ${email || '-'}`,
        `Serviciu: ${service || '-'}`,
        '',
        message,
    ];

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
        <b>Serviciu:</b> ${escapeHtml(service || '-')}</p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
        });
        res.json({ ok: true });
    } catch (err) {
        console.error('[contact] Failed to send quote request email:', err);
        res.status(502).json({ msg: 'Mesajul nu a putut fi trimis. Vă rugăm să ne sunați la +40 768 515 774.' });
    }
});

export default router;
