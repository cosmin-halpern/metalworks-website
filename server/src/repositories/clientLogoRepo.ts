import { pool } from '../db/mysql.js';

export type ClientLogoRow = {
    id: number;
    name: string;
    src: string;
    created_at: string;
};

export type ClientLogoDTO = {
    id: number;
    name: string;
    src: string;
    createdAt: string;
};

function toDTO(row: ClientLogoRow): ClientLogoDTO {
    return {
        id: row.id,
        name: row.name,
        src: row.src,
        createdAt: row.created_at,
    };
}

export async function listClientLogos(): Promise<ClientLogoDTO[]> {
    const [rows] = await pool.query(
        `
    SELECT id, name, src, created_at
    FROM client_logos
    ORDER BY created_at DESC
    `
    );
    return (rows as ClientLogoRow[]).map(toDTO);
}

export async function createClientLogo(input: {
    name: string;
    src: string;
}): Promise<ClientLogoDTO> {
    const [result] = await pool.query(
        'INSERT INTO client_logos (name, src) VALUES (?, ?)',
        [input.name, input.src]
    );

    const id = (result as any).insertId as number;

    const [rows] = await pool.query(
        'SELECT id, name, src, created_at FROM client_logos WHERE id = ? LIMIT 1',
        [id]
    );

    const row = (rows as ClientLogoRow[])[0];
    if (!row) throw new Error('Failed to load created logo');

    return toDTO(row);
}

export async function deleteClientLogoById(
    id: number
): Promise<ClientLogoDTO | null> {
    const [rows] = await pool.query(
        'SELECT id, name, src, created_at FROM client_logos WHERE id = ? LIMIT 1',
        [id]
    );

    const row = (rows as ClientLogoRow[])[0];
    if (!row) return null;

    await pool.query('DELETE FROM client_logos WHERE id = ?', [id]);

    return toDTO(row);
}