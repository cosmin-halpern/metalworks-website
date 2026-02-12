import { pool } from '../db/mysql.js';
function toDTO(row) {
    return {
        id: row.id,
        name: row.name,
        src: row.src,
        createdAt: row.created_at,
    };
}
export async function listClientLogos() {
    const [rows] = await pool.query(`
    SELECT id, name, src, created_at
    FROM client_logos
    ORDER BY created_at DESC
    `);
    return rows.map(toDTO);
}
export async function createClientLogo(input) {
    const [result] = await pool.query('INSERT INTO client_logos (name, src) VALUES (?, ?)', [input.name, input.src]);
    const id = result.insertId;
    const [rows] = await pool.query('SELECT id, name, src, created_at FROM client_logos WHERE id = ? LIMIT 1', [id]);
    const row = rows[0];
    if (!row)
        throw new Error('Failed to load created logo');
    return toDTO(row);
}
export async function deleteClientLogoById(id) {
    const [rows] = await pool.query('SELECT id, name, src, created_at FROM client_logos WHERE id = ? LIMIT 1', [id]);
    const row = rows[0];
    if (!row)
        return null;
    await pool.query('DELETE FROM client_logos WHERE id = ?', [id]);
    return toDTO(row);
}
