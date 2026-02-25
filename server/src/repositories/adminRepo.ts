import { pool } from '../db/mysql.js';

export type AdminRow = {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'editor';
};

export async function findAdminByEmail(emailLower: string): Promise<AdminRow | null> {
    const [rows] = await pool.query(
        'SELECT id, username, email, password_hash, role FROM admins WHERE email = ? LIMIT 1',
        [emailLower]
    );
    const list = rows as AdminRow[];
    return list[0] ?? null;
}

export async function findAdminById(id: number): Promise<Omit<AdminRow, 'password_hash'> | null> {
    const [rows] = await pool.query(
        'SELECT id, username, email, role FROM admins WHERE id = ? LIMIT 1',
        [id]
    );
    const list = rows as Array<Omit<AdminRow, 'password_hash'>>;
    return list[0] ?? null;
}

export async function adminExistsByEmailOrUsername(emailLower: string, username: string): Promise<boolean> {
    const [rows] = await pool.query(
        'SELECT id FROM admins WHERE email = ? OR username = ? LIMIT 1',
        [emailLower, username]
    );
    const list = rows as Array<{ id: number }>;
    return Boolean(list[0]);
}

export async function createAdmin(input: {
    username: string;
    emailLower: string;
    passwordHash: string;
    role: 'admin' | 'editor';
}): Promise<{ id: number; username: string; role: 'admin' | 'editor' }> {
    const [result] = await pool.query(
        'INSERT INTO admins (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [input.username, input.emailLower, input.passwordHash, input.role]
    );

    const insertId = (result as any).insertId as number;
    return { id: insertId, username: input.username, role: input.role };
}

export async function existsAnyAdmin(): Promise<boolean> {
    const [rows] = await pool.query('SELECT id FROM admins WHERE role = ? LIMIT 1', ['admin']);
    const list = rows as Array<{ id: number }>;
    return Boolean(list[0]);
}