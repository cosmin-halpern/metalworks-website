import express from 'express';
import { z } from 'zod';
import auth, { checkRole } from '../middleware/auth.js';
import { sendEmail } from '../services/email.js';
import {
    countNewOrders,
    createOrderTransactional,
    listOrders,
    updateOrderStatus,
    updatePaymentStatus,
    type OrderStatus,
    type PaymentStatus,
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
            }).catch((e) => console.error(`[email] Admin notification failed for order ${created.orderNumber}:`, e));
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
            }).catch((e) => console.error(`[email] Customer confirmation failed for order ${created.orderNumber} to ${shipping.email}:`, e));
        }

        // Netopia card payment: initiate hosted payment and return redirect URL
        if (paymentMethod === 'card') {
            try {
                const { Netopia } = await import('netopia-card');

                const netopia = new Netopia({
                    apiKey: process.env.NETOPIA_API_KEY,
                    sandbox: process.env.NETOPIA_LIVE !== 'true',
                    posSignature: process.env.NETOPIA_SIGNATURE,
                    notifyUrl: process.env.NETOPIA_CONFIRM_URL,
                    redirectUrl: `${process.env.NETOPIA_RETURN_URL}?order=${created.orderNumber}`,
                    apiBaseUrl: process.env.NETOPIA_API_BASE_URL,
                });

                const nameParts = shipping.fullName.trim().split(/\s+/);
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName;

                netopia.setOrderData({
                    orderID: created.orderNumber,
                    amount: created.total,
                    currency: 'RON',
                    description: `Comanda ${created.orderNumber}`,
                    billing: {
                        email: shipping.email,
                        firstName,
                        lastName,
                        phone: shipping.phone,
                        city: shipping.city,
                        country: 642, // Romania
                        countryName: 'Romania',
                        state: '',
                        postalCode: '',
                        details: shipping.address,
                    },
                });

                netopia.setProductsData(
                    created.items.map((item) => ({
                        name: item.title,
                        code: String(item.productId),
                        category: 'general',
                        price: item.price,
                        vat: 19,
                    }))
                );

                const netopiaResponse = await netopia.startPayment();

                if (netopiaResponse?.paymentURL) {
                    return res.json({
                        orderId: created.orderId,
                        orderNumber: created.orderNumber,
                        paymentURL: netopiaResponse.paymentURL,
                    });
                }
            } catch (netopiaErr) {
                console.error(`[netopia] Failed to initiate payment for order ${created.orderNumber}:`, netopiaErr);
                // Fall through — order is saved; customer will be shown order number
            }
        }

        res.json({ orderId: created.orderId, orderNumber: created.orderNumber });
    } catch (err: any) {
        console.error(err);
        if (err?.code === 'INSUFFICIENT_STOCK') {
            return res.status(409).json({ msg: 'Unul sau mai multe produse nu mai sunt disponibile în cantitatea solicitată.' });
        }
        res.status(500).send('Server Error');
    }
});

const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
});

// List orders (admin)
router.get('/', auth, checkRole(['admin']), async (req, res) => {
    try {
        const parsed = paginationSchema.safeParse(req.query);
        if (!parsed.success) return res.status(400).json({ msg: 'Invalid pagination params' });

        const result = await listOrders(parsed.data.page, parsed.data.limit);
        res.json(result);
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

// Netopia IPN (Instant Payment Notification) — no auth, called by Netopia servers
router.post('/ipn', express.text({ type: '*/*' }), async (req, res) => {
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { order, payment } = body ?? {};

        const orderNumber = String(order?.orderID ?? '');
        const statusCode = Number(payment?.status ?? -1);
        const ntfUrl = String(order?.ntfURL ?? '');

        let paymentStatus: PaymentStatus = 'pending';
        if (statusCode === 5) {
            paymentStatus = 'paid';
        } else if (statusCode === 3 || statusCode === 7 || statusCode === 8) {
            paymentStatus = 'failed';
        }

        if (orderNumber) {
            await updatePaymentStatus(orderNumber, paymentStatus, ntfUrl);
        }

        res.status(200).json({ errorCode: 0 });
    } catch (err) {
        console.error('[ipn] Error processing notification:', err);
        // Always return 200 to prevent Netopia retry loops
        res.status(200).json({ errorCode: 0 });
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