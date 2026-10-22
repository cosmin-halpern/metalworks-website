import { pool } from '../db/mysql.js';

export type SiteSettingsDTO = {
    logoUrl: string;
    gtmId: string;
    createdAt: string;
    updatedAt: string | null;
};

type SiteSettingsRow = {
    id: number;
    logo_url: string;
    gtm_id: string;
    created_at: string;
    updated_at: string | null;
};

export async function getSettingsSingleton(): Promise<SiteSettingsDTO> {
    const [rows] = await pool.query(
        `
    SELECT id, logo_url, gtm_id, created_at, updated_at
    FROM site_settings
    WHERE id = 1
    LIMIT 1
    `
    );

    const row = (rows as SiteSettingsRow[])[0];

    // If somehow row is missing, create it (safety)
    if (!row) {
        await pool.query(
            'INSERT INTO site_settings (id, logo_url) VALUES (1, ?) ON DUPLICATE KEY UPDATE id = id',
            ['']
        );
        return await getSettingsSingleton();
    }

    return {
        logoUrl: row.logo_url || '',
        gtmId: row.gtm_id || '',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export async function updateLogoUrlSingleton(logoUrl: string): Promise<SiteSettingsDTO> {
    await pool.query('UPDATE site_settings SET logo_url = ? WHERE id = 1', [logoUrl]);
    return await getSettingsSingleton();
}
export async function updateGtmIdSingleton(gtmId: string): Promise<SiteSettingsDTO> {
    await pool.query('UPDATE site_settings SET gtm_id = ? WHERE id = 1', [gtmId]);
    return await getSettingsSingleton();
}
