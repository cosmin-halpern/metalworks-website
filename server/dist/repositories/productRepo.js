import { pool } from '../db/mysql.js';
function toDTO(row) {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        price: Number(row.price),
        imageUrl: row.image_url,
        active: Boolean(row.active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
export async function listActiveProducts() {
    const [rows] = await pool.query(`
    SELECT id, title, description, price, image_url, active, created_at, updated_at
    FROM products
    WHERE active = 1
    ORDER BY created_at DESC
    `);
    return rows.map(toDTO);
}
export async function getProductById(id) {
    const [rows] = await pool.query(`
    SELECT id, title, description, price, image_url, active, created_at, updated_at
    FROM products
    WHERE id = ?
    LIMIT 1
    `, [id]);
    const row = rows[0];
    return row ? toDTO(row) : null;
}
export async function createProduct(input) {
    const [result] = await pool.query(`
    INSERT INTO products (title, description, price, image_url, active)
    VALUES (?, ?, ?, ?, ?)
    `, [input.title, input.description, input.price, input.imageUrl, input.active ? 1 : 0]);
    const id = result.insertId;
    const created = await getProductById(id);
    if (!created)
        throw new Error('Failed to load created product');
    return created;
}
export async function updateProduct(id, input) {
    const existing = await getProductById(id);
    if (!existing)
        return null;
    const next = {
        title: input.title ?? existing.title,
        description: input.description ?? existing.description,
        price: typeof input.price === 'number' ? input.price : existing.price,
        imageUrl: input.imageUrl ?? existing.imageUrl,
        active: typeof input.active === 'boolean' ? input.active : existing.active,
    };
    await pool.query(`
    UPDATE products
    SET title = ?, description = ?, price = ?, image_url = ?, active = ?
    WHERE id = ?
    `, [next.title, next.description, next.price, next.imageUrl, next.active ? 1 : 0, id]);
    return await getProductById(id);
}
export async function deleteProductById(id) {
    const existing = await getProductById(id);
    if (!existing)
        return null;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return existing;
}
