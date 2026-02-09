import express from 'express';
import { z } from 'zod';
import Order from '../models/order.js';
import Product from '../models/product.js';
import auth, { checkRole } from '../middleware/auth.js';
import { sendEmail } from '../services/email.js';

const router = express.Router();

const createOrderSchema = z.object({
    items: z.array(
        z.object({
            productId: z.string().min(1),
            quantity: z.number().int().min(1),
        })
    ).min(1),
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

const generateOrderNumber = () => {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const rnd = Math.floor(100000 + Math.random() * 900000);
    return `CE-${y}${m}${d}-${rnd}`;
};

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
            if (!invoice.companyName?.trim() || !invoice.cui?.trim() || !invoice.companyAddress?.trim()) {
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

        // 1) Re-fetch products from DB and build a safe snapshot
        const productIds = items.map((i) => i.productId);
        const products = await Product.find({ _id: { $in: productIds }, active: true });

        const byId = new Map(products.map((p: any) => [String(p._id), p]));

        const missing = items.find((i) => !byId.has(i.productId));
        if (missing) {
            return res.status(400).json({ msg: 'Un produs din coș nu mai este disponibil.' });
        }

        // STOCK CHECK + DECREMENT (atomic per product)
        for (const i of items) {
            const p: any = byId.get(i.productId);
            if (p.trackStock) {
                const updated = await Product.findOneAndUpdate(
                    { _id: p._id, stock: { $gte: i.quantity } },
                    { $inc: { stock: -i.quantity } },
                    { new: true }
                );

                if (!updated) {
                    return res.status(400).json({ msg: `Stoc insuficient pentru produs: ${p.title}` });
                }

                byId.set(String(updated._id), updated);
            }
        }

        const orderItems = items.map((i) => {
            const p: any = byId.get(i.productId);
            return {
                productId: String(p._id),
                title: String(p.title),
                price: Number(p.price),
                quantity: i.quantity,
                imageUrl: String(p.imageUrl || ''),
            };
        });

        const total = orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

        // 2) Create order number
        let orderNumber = generateOrderNumber();
        for (let i = 0; i < 3; i++) {
            // eslint-disable-next-line no-await-in-loop
            const exists = await Order.exists({ orderNumber });
            if (!exists) break;
            orderNumber = generateOrderNumber();
        }

        // 3) Save to DB (snapshot is inside orderItems)
        const created = await Order.create({
            orderNumber,
            items: orderItems,
            shipping,
            invoice: {
                needInvoice: invoice.needInvoice,
                companyName: invoice.companyName || '',
                cui: invoice.cui || '',
                companyAddress: invoice.companyAddress || '',
            },
            paymentMethod,
            total,
            status: 'new',
        });

        // 4) Email to admin (best-effort)
        const adminTo = process.env.CONTACT_EMAIL;
        if (adminTo) {
            const htmlItems = orderItems
                .map((it) => `<li><b>${escapeHtml(it.title)}</b> — ${it.quantity} × ${it.price} RON</li>`)
                .join('');

            const html = `
              <h2>Comandă nouă: ${escapeHtml(orderNumber)}</h2>
              <p><b>Total:</b> ${total} RON</p>
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
                subject: `Comandă nouă ${orderNumber} (${total} RON)`,
                text: `Comandă nouă ${orderNumber}. Total: ${total} RON. Client: ${shipping.fullName} (${shipping.phone}).`,
                html,
            }).catch((e) => console.error('Order admin email error:', e));
        }

        // 5) Email to customer (best-effort)
        if (shipping.email) {
            const customerHtmlItems = orderItems
                .map((it) => `<li><b>${escapeHtml(it.title)}</b> — ${it.quantity} × ${it.price} RON</li>`)
                .join('');

            const customerHtml = `
              <h2>Confirmare comandă: ${escapeHtml(orderNumber)}</h2>
              <p>Îți mulțumim! Comanda ta a fost înregistrată.</p>
              <p><b>Total:</b> ${total} RON</p>
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
                subject: `Confirmare comandă ${orderNumber}`,
                text: `Comanda ta ${orderNumber} a fost înregistrată. Total: ${total} RON.`,
                html: customerHtml,
            }).catch((e) => console.error('Order customer email error:', e));
        }

        res.json({ orderId: created._id, orderNumber: created.orderNumber });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// List orders (admin)
router.get('/', auth, checkRole(['admin']), async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
        res.json(orders);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/new-count', auth, checkRole(['admin']), async (req, res) => {
    try {
        const count = await Order.countDocuments({ status: 'new' });
        res.json({ count });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update status (admin)
router.put('/:id/status', auth, checkRole(['admin']), async (req, res) => {
    try {
        const schema = z.object({ status: z.enum(['new', 'processing', 'shipped', 'completed', 'cancelled']) });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ msg: 'Invalid status' });

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        order.status = parsed.data.status;
        await order.save();

        res.json(order);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;