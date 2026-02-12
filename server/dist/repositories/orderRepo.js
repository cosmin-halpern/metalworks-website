import { pool } from '../db/mysql.js';
export function generateOrderNumber() {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const rnd = Math.floor(100000 + Math.random() * 900000);
    return `CE-${y}${m}${d}-${rnd}`;
}
export async function orderNumberExists(orderNumber) {
    const [rows] = await pool.query('SELECT id FROM orders WHERE order_number = ? LIMIT 1', [orderNumber]);
    return Boolean(rows[0]);
}
async function getOrderItems(orderId) {
    const [rows] = await pool.query(`
            SELECT product_id, title, price, quantity, image_url
            FROM order_items
            WHERE order_id = ?
            ORDER BY id ASC
        `, [orderId]);
    return rows.map((r) => ({
        productId: Number(r.product_id),
        title: String(r.title),
        price: Number(r.price),
        quantity: Number(r.quantity),
        imageUrl: String(r.image_url || ''),
    }));
}
export async function getOrderById(orderId) {
    const [rows] = await pool.query(`
            SELECT
                id,
                order_number,
                status,
                payment_method,
                total,
                shipping_full_name,
                shipping_phone,
                shipping_email,
                shipping_address,
                shipping_city,
                invoice_need_invoice,
                invoice_company_name,
                invoice_cui,
                invoice_company_address,
                created_at,
                updated_at
            FROM orders
            WHERE id = ?
                LIMIT 1
        `, [orderId]);
    const o = rows[0];
    if (!o)
        return null;
    const items = await getOrderItems(orderId);
    return {
        id: Number(o.id),
        orderNumber: String(o.order_number),
        status: String(o.status),
        paymentMethod: String(o.payment_method),
        total: Number(o.total),
        items,
        shipping: {
            fullName: String(o.shipping_full_name),
            phone: String(o.shipping_phone),
            email: String(o.shipping_email),
            address: String(o.shipping_address),
            city: String(o.shipping_city),
        },
        invoice: {
            needInvoice: Boolean(o.invoice_need_invoice),
            companyName: String(o.invoice_company_name || ''),
            cui: String(o.invoice_cui || ''),
            companyAddress: String(o.invoice_company_address || ''),
        },
        createdAt: String(o.created_at),
        updatedAt: o.updated_at ? String(o.updated_at) : null,
    };
}
/**
 * Creates order + order_items in a single transaction.
 * Also performs stock check + decrement for products with track_stock=1.
 */
export async function createOrderTransactional(input) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        // 1) Load products (FOR UPDATE so stock updates are safe)
        const ids = input.items.map((i) => i.productId);
        if (!ids.length)
            throw new Error('No items');
        const placeholders = ids.map(() => '?').join(',');
        const [productRows] = await conn.query(`
                SELECT id, title, price, image_url, active, track_stock, stock
                FROM products
                WHERE id IN (${placeholders}) AND active = 1
                    FOR UPDATE
            `, ids);
        const products = productRows;
        const byId = new Map(products.map((p) => [p.id, p]));
        // Missing product?
        const missing = input.items.find((i) => !byId.has(i.productId));
        if (missing) {
            throw new Error('Un produs din coș nu mai este disponibil.');
        }
        // 2) Stock check + decrement
        for (const i of input.items) {
            const p = byId.get(i.productId);
            if (p.track_stock) {
                if (p.stock < i.quantity) {
                    throw new Error(`Stoc insuficient pentru produs: ${p.title}`);
                }
                // decrement in DB
                await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [
                    i.quantity,
                    p.id,
                ]);
                // keep local snapshot updated
                p.stock = p.stock - i.quantity;
            }
        }
        // 3) Snapshot items
        const itemsSnapshot = input.items.map((i) => {
            const p = byId.get(i.productId);
            return {
                productId: p.id,
                title: String(p.title),
                price: Number(p.price),
                quantity: i.quantity,
                imageUrl: String(p.image_url || ''),
            };
        });
        const total = itemsSnapshot.reduce((sum, it) => sum + it.price * it.quantity, 0);
        // 4) Generate unique order number (retry a few times)
        let orderNumber = generateOrderNumber();
        for (let t = 0; t < 3; t++) {
            const [existsRows] = await conn.query('SELECT id FROM orders WHERE order_number = ? LIMIT 1', [orderNumber]);
            if (!existsRows[0])
                break;
            orderNumber = generateOrderNumber();
        }
        // 5) Insert order
        const [orderResult] = await conn.query(`
                INSERT INTO orders (
                    order_number,
                    status,
                    payment_method,
                    total,
                    shipping_full_name,
                    shipping_phone,
                    shipping_email,
                    shipping_address,
                    shipping_city,
                    invoice_need_invoice,
                    invoice_company_name,
                    invoice_cui,
                    invoice_company_address
                )
                VALUES (?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
            orderNumber,
            input.paymentMethod,
            total,
            input.shipping.fullName,
            input.shipping.phone,
            input.shipping.email,
            input.shipping.address,
            input.shipping.city,
            input.invoice.needInvoice ? 1 : 0,
            input.invoice.companyName || '',
            input.invoice.cui || '',
            input.invoice.companyAddress || '',
        ]);
        const orderId = orderResult.insertId;
        // 6) Insert order_items
        const values = itemsSnapshot.map((it) => [
            orderId,
            it.productId,
            it.title,
            it.price,
            it.quantity,
            it.imageUrl || '',
        ]);
        await conn.query(`
                INSERT INTO order_items (order_id, product_id, title, price, quantity, image_url)
                VALUES ?
            `, [values]);
        await conn.commit();
        return { orderId, orderNumber, items: itemsSnapshot, total };
    }
    catch (e) {
        await conn.rollback();
        throw e;
    }
    finally {
        conn.release();
    }
}
export async function listOrders(limit = 200) {
    const [rows] = await pool.query(`
            SELECT id
            FROM orders
            ORDER BY created_at DESC
                LIMIT ?
        `, [limit]);
    const ids = rows.map((r) => r.id);
    const result = [];
    for (const id of ids) {
        const o = await getOrderById(id);
        if (o)
            result.push(o);
    }
    return result;
}
export async function countNewOrders() {
    const [rows] = await pool.query(`SELECT COUNT(*) as c FROM orders WHERE status = 'new'`);
    return Number(rows[0]?.c ?? 0);
}
export async function updateOrderStatus(orderId, status) {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    return await getOrderById(orderId);
}
