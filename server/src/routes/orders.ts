import express from 'express';
import { z } from 'zod';
import auth, { checkRole } from '../middleware/auth.js';
import { sendEmail } from '../services/email.js';
import {
    countNewOrders,
    createOrderTransactional,
    listOrders,
    updateOrderStatus,
    type OrderStatus,
} from '../repositories/orderRepo.js';

const router = express.Router();

const createOrderSchema = z.object({
    items: z
        .array(
            z.object({
                // Accept numeric IDs as strings and convert to number
                productId: z.preprocess((v) => Number(v), z.number().int().positive()),
                quantity: z.number().int().min(1),
            })
        )
        .min(1),
    shipping: z.object({
        fullName: z.string().min(2),
        phone: z.string().min(6),
        email: z.string().email(),
        address: z.string().min(5),
        city: z.string().min(2),
    }),
    invoice: z.object({
        needInvoice: z.boolean(),
        companyName: z.string().optional(),
        cui: z.string().optional(),
        companyAddress: z.string().optional(),
    }),
    paymentMethod: z.enum(['cash', 'bank', 'card']),
});

const escapeHtml = (s: string) =>
    s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

router.post('/', async (req, res) => {
    try {
        const parsed = createOrderSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                msg: 'Validation failed',
                errors: parsed.error.issues.map((i) => ({
                    path: i.path.join('.'),
                    message: i.message,
                })),
            });
        }

        const { items, shipping, invoice, paymentMethod } = parsed.data;

        if (invoice.needInvoice) {
            if (
                !invoice.companyName?.trim() ||
                !invoice.cui?.trim() ||
                !invoice.companyAddress?.trim()
            ) {
                return res.status(400).json({
                    msg: 'Validation failed',
                    errors: [
                        { path: 'invoice.companyName', message: 'Company name is required' },
                        { path: 'invoice.cui', message: 'CUI is required' },
                        { path: 'invoice.companyAddress', message: 'Company address is required' },
                    ],
                });
            }
        }

        // Create order in DB + stock decrement (transaction)
        const created = await createOrderTransactional({
            items,
            shipping,
            invoice: {
                needInvoice: invoice.needInvoice,
                companyName: invoice.companyName || '',
                cui: invoice.cui || '',
                companyAddress: invoice.companyAddress || '',
            },
            paymentMethod,
        });

        // Admin email (best-effort)
        const adminTo = process.env.CONTACT_EMAIL;
        if (adminTo) {
            const htmlItems = created.items
                .map((it) => `<li><b>${escapeHtml(it.title)}</b> — ${it.quantity} × ${it.price} RON</li>`)
                .join('');

            const html = `
        <h2>Comandă nouă: ${escapeHtml(created.orderNumber)}</h2>
        <p><b>Total:</b> ${created.total} RON</p>
        <h3>Livrare</h3>
        <ul>
          <li><b>Nume:</b> ${escapeHtml(shipping.fullName)}</li>
          <li><b>Telefon:</b> ${escapeHtml(shipping.phone)}</li>
          <li><b>Email:</b> ${escapeHtml(shipping.email)}</li>
          <li><b>Adresă:</b> ${escapeHtml(shipping.address)}, ${escapeHtml(shipping.city)}</li>
        </ul>
        <h3>Produse</h3>
        <ul>${htmlItems}</ul>
        <p><b>Plată:</b> ${escapeHtml(paymentMethod)}</p>
      `;

            sendEmail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@corsican.ro',
                to: adminTo,
                subject: `Comandă nouă ${created.orderNumber} (${created.total} RON)`,
                text: `Comandă nouă ${created.orderNumber}. Total: ${created.total} RON. Client: ${shipping.fullName} (${shipping.phone}).`,
                html,
            }).catch((e) => console.error('Order admin email error:', e));
        }

        // Customer email (best-effort)
        if (shipping.email) {
            const customerHtmlItems = created.items
                .map((it) => `<li><b>${escapeHtml(it.title)}</b> — ${it.quantity} × ${it.price} RON</li>`)
                .join('');

            const customerHtml = `
        <h2>Confirmare comandă: ${escapeHtml(created.orderNumber)}</h2>
        <p>Îți mulțumim! Comanda ta a fost înregistrată.</p>
        <p><b>Total:</b> ${created.total} RON</p>
        <h3>Produse</h3>
        <ul>${customerHtmlItems}</ul>
        <h3>Livrare</h3>
        <ul>
          <li><b>Nume:</b> ${escapeHtml(shipping.fullName)}</li>
          <li><b>Telefon:</b> ${escapeHtml(shipping.phone)}</li>
          <li><b>Adresă:</b> ${escapeHtml(shipping.address)}, ${escapeHtml(shipping.city)}</li>
        </ul>
        <p><b>Metodă plată:</b> ${escapeHtml(paymentMethod)}</p>
        <p>Dacă ai întrebări, răspunde la acest email.</p>
      `;

            sendEmail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@corsican.ro',
                to: shipping.email,
                subject: `Confirmare comandă ${created.orderNumber}`,
                text: `Comanda ta ${created.orderNumber} a fost înregistrată. Total: ${created.total} RON.`,
                html: customerHtml,
            }).catch((e) => console.error('Order customer email error:', e));
        }

        res.json({ orderId: created.orderId, orderNumber: created.orderNumber });
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// List orders (admin)
router.get('/', auth, checkRole(['admin']), async (_req, res) => {
    try {
        const orders = await listOrders(200);
        res.json(orders);
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/new-count', auth, checkRole(['admin']), async (_req, res) => {
    try {
        const count = await countNewOrders();
        res.json({ count });
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update status (admin)
router.put('/:id/status', auth, checkRole(['admin']), async (req, res) => {
    try {
        const schema = z.object({
            status: z.enum(['new', 'processing', 'shipped', 'completed', 'cancelled']),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ msg: 'Invalid status' });

        const orderId = Number(req.params.id);
        if (!orderId || Number.isNaN(orderId)) return res.status(400).json({ msg: 'Invalid id' });

        const updated = await updateOrderStatus(orderId, parsed.data.status as OrderStatus);
        if (!updated) return res.status(404).json({ msg: 'Order not found' });

        res.json(updated);
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;