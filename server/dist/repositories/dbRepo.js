import { pool } from '../db/mysql.js';
export async function dbPing() {
    const [rows] = await pool.query('SELECT 1 as ok');
    return Array.isArray(rows);
}
