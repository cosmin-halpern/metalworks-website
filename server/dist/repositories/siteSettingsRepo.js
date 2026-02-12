import { pool } from '../db/mysql.js';
export async function getSettingsSingleton() {
    const [rows] = await pool.query(`
    SELECT id, logo_url, created_at, updated_at
    FROM site_settings
    WHERE id = 1
    LIMIT 1
    `);
    const row = rows[0];
    // If somehow row is missing, create it (safety)
    if (!row) {
        await pool.query('INSERT INTO site_settings (id, logo_url) VALUES (1, ?) ON DUPLICATE KEY UPDATE id = id', ['']);
        return await getSettingsSingleton();
    }
    return {
        logoUrl: row.logo_url || '',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
export async function updateLogoUrlSingleton(logoUrl) {
    await pool.query('UPDATE site_settings SET logo_url = ? WHERE id = 1', [logoUrl]);
    return await getSettingsSingleton();
}
