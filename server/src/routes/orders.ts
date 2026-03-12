import express, { type RequestHandler } from 'express';
import { z } from 'zod';
import Stripe from 'stripe';
import auth, { checkRole } from '../middleware/auth.js';
import { sendEmail } from '../services/email.js';
import {
    countNewOrders,
    createOrderTransactional,
    getOrderById,
    listOrders,
    updateOrderStatus,
    updatePaymentStatus,
    type OrderStatus,
    type PaymentStatus,
} from '../repositories/orderRepo.js';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
        <h2>Îți mulțumim pentru comandă!</h2>
        <p>Comanda ta <b>${escapeHtml(created.orderNumber)}</b> a fost înregistrată cu succes.</p>
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

        // Stripe card payment: create hosted Checkout Session and return redirect URL
        if (paymentMethod === 'card') {
            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'payment',
                    customer_email: shipping.email,
                    line_items: created.items.map((item) => ({
                        price_data: {
                            currency: 'ron',
                            product_data: { name: item.title },
                            unit_amount: Math.round(item.price * 100), // RON -> bani
                        },
                        quantity: item.quantity,
                    })),
                    metadata: {
                        orderNumber: created.orderNumber,
                        orderId: String(created.orderId),
                    },
                    success_url: `${process.env.CLIENT_URL}/plata-finalizata?order=${created.orderNumber}`,
                    cancel_url: `${process.env.CLIENT_URL}/cos`,
                });

                // Store session ID so the webhook can match it to the order
                await updatePaymentStatus(created.orderNumber, 'pending', session.id);

                if (session.url) {
                    return res.json({
                        orderId: created.orderId,
                        orderNumber: created.orderNumber,
                        paymentURL: session.url,
                    });
                }
            } catch (stripeErr) {
                console.error(`[stripe] Failed to create session for order ${created.orderNumber}:`, stripeErr);
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

// Update payment status (admin)
router.put('/:id/payment-status', auth, checkRole(['admin']), async (req, res) => {
    try {
        const schema = z.object({
            paymentStatus: z.enum(['pending', 'paid', 'failed']),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ msg: 'Invalid payment status' });

        const orderId = Number(req.params.id);
        if (!orderId || Number.isNaN(orderId)) return res.status(400).json({ msg: 'Invalid id' });

        const order = await getOrderById(orderId);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        await updatePaymentStatus(order.orderNumber, parsed.data.paymentStatus as PaymentStatus);
        const updated = await getOrderById(orderId);
        res.json(updated);
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Stripe webhook — registered BEFORE express.json() in index.ts so raw body is available
export const stripeWebhookHandler: RequestHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body as Buffer,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error('[stripe] Webhook signature verification failed:', err);
        return res.status(400).send('Webhook Error');
    }

    try {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderNumber = session.metadata?.orderNumber;

        if (orderNumber) {
            if (event.type === 'checkout.session.completed') {
                await updatePaymentStatus(orderNumber, 'paid', session.id);
            } else if (event.type === 'checkout.session.expired') {
                await updatePaymentStatus(orderNumber, 'failed', session.id);
            }
        }
    } catch (err) {
        console.error('[stripe] Error processing webhook event:', err);
    }

    res.json({ received: true });
};

export default router;