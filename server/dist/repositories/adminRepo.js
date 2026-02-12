import { pool } from '../db/mysql.js';
export async function findAdminByEmail(emailLower) {
    const [rows] = await pool.query('SELECT id, username, email, password_hash, role FROM admins WHERE email = ? LIMIT 1', [emailLower]);
    const list = rows;
    return list[0] ?? null;
}
export async function findAdminById(id) {
    const [rows] = await pool.query('SELECT id, username, email, role FROM admins WHERE id = ? LIMIT 1', [id]);
    const list = rows;
    return list[0] ?? null;
}
export async function adminExistsByEmailOrUsername(emailLower, username) {
    const [rows] = await pool.query('SELECT id FROM admins WHERE email = ? OR username = ? LIMIT 1', [emailLower, username]);
    const list = rows;
    return Boolean(list[0]);
}
export async function createAdmin(input) {
    const [result] = await pool.query('INSERT INTO admins (username, email, password_hash, role) VALUES (?, ?, ?, ?)', [input.username, input.emailLower, input.passwordHash, input.role]);
    const insertId = result.insertId;
    return { id: insertId, username: input.username, role: input.role };
}
export async function existsAnyAdmin() {
    const [rows] = await pool.query('SELECT id FROM admins WHERE role = ? LIMIT 1', ['admin']);
    const list = rows;
    return Boolean(list[0]);
}
