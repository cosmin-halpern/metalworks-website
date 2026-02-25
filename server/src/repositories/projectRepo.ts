import { pool } from '../db/mysql.js';

export type ProjectMediaItem = {
    id?: number;
    type: 'image' | 'video';
    src: string;
};

export type ProjectDTO = {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    media: ProjectMediaItem[];
    createdAt: string;
    updatedAt: string | null;
};

type ProjectRow = {
    id: number;
    title: string;
    description: string;
    cover_image: string;
    created_at: string;
    updated_at: string | null;
};

type ProjectMediaRow = {
    id: number;
    project_id: number;
    type: 'image' | 'video';
    src: string;
    sort_order: number;
};

async function getProjectMedia(projectId: number): Promise<ProjectMediaItem[]> {
    const [rows] = await pool.query(
        `
    SELECT id, project_id, type, src, sort_order
    FROM project_media
    WHERE project_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
        [projectId]
    );

    return (rows as ProjectMediaRow[]).map((r) => ({ id: r.id, type: r.type, src: r.src }));
}

const MAX_PAGE_SIZE = 100;

export type PaginatedResult<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
};

export async function listProjects(
    page = 1,
    limit = 20
): Promise<PaginatedResult<ProjectDTO>> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), MAX_PAGE_SIZE);
    const offset = (safePage - 1) * safeLimit;

    const [[{ total }]] = await pool.query(
        'SELECT COUNT(*) as total FROM projects'
    ) as any;

    const [rows] = await pool.query(
        `SELECT id, title, description, cover_image, created_at, updated_at
         FROM projects
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [safeLimit, offset]
    );

    const projects = rows as ProjectRow[];

    const data: ProjectDTO[] = [];
    for (const p of projects) {
        const media = await getProjectMedia(p.id);
        data.push({
            id: p.id,
            title: p.title,
            description: p.description,
            coverImage: p.cover_image,
            media,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
        });
    }

    return {
        data,
        total: Number(total),
        page: safePage,
        limit: safeLimit,
        pages: Math.ceil(Number(total) / safeLimit),
    };
}

export async function getProjectById(id: number): Promise<ProjectDTO | null> {
    const [rows] = await pool.query(
        `
    SELECT id, title, description, cover_image, created_at, updated_at
    FROM projects
    WHERE id = ?
    LIMIT 1
    `,
        [id]
    );

    const p = (rows as ProjectRow[])[0];
    if (!p) return null;

    const media = await getProjectMedia(p.id);

    return {
        id: p.id,
        title: p.title,
        description: p.description,
        coverImage: p.cover_image,
        media,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
    };
}

export async function createProject(input: {
    title: string;
    description: string;
    coverImage: string;
    media: ProjectMediaItem[];
}): Promise<ProjectDTO> {
    const [result] = await pool.query(
        `
    INSERT INTO projects (title, description, cover_image)
    VALUES (?, ?, ?)
    `,
        [input.title, input.description, input.coverImage]
    );

    const projectId = (result as any).insertId as number;

    if (input.media.length) {
        const values = input.media.map((m, idx) => [projectId, m.type, m.src, idx]);
        await pool.query(
            `
      INSERT INTO project_media (project_id, type, src, sort_order)
      VALUES ?
      `,
            [values]
        );
    }

    const created = await getProjectById(projectId);
    if (!created) throw new Error('Failed to load created project');
    return created;
}

export async function deleteProjectById(id: number): Promise<ProjectDTO | null> {
    const existing = await getProjectById(id);
    if (!existing) return null;

    // project_media rows will be deleted by FK ON DELETE CASCADE
    await pool.query('DELETE FROM projects WHERE id = ?', [id]);

    return existing;
}

export async function addProjectMedia(
    projectId: number,
    media: { type: 'image' | 'video'; src: string }[]
): Promise<ProjectMediaItem[]> {
    if (!media.length) return [];

    // Append after the current highest sort_order
    const [[{ maxOrder }]] = await pool.query(
        'SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM project_media WHERE project_id = ?',
        [projectId]
    ) as any;

    const values = media.map((m, idx) => [projectId, m.type, m.src, Number(maxOrder) + 1 + idx]);
    const [result] = await pool.query(
        'INSERT INTO project_media (project_id, type, src, sort_order) VALUES ?',
        [values]
    );

    const insertId = (result as any).insertId as number;
    const [rows] = await pool.query(
        'SELECT id, type, src FROM project_media WHERE project_id = ? AND id >= ? ORDER BY id ASC LIMIT ?',
        [projectId, insertId, media.length]
    );

    return (rows as { id: number; type: 'image' | 'video'; src: string }[]).map(r => ({
        id: r.id,
        type: r.type,
        src: r.src,
    }));
}

export async function deleteProjectMedia(
    mediaId: number,
    projectId: number
): Promise<{ src: string } | null> {
    const [rows] = await pool.query(
        'SELECT id, src FROM project_media WHERE id = ? AND project_id = ? LIMIT 1',
        [mediaId, projectId]
    );
    const row = (rows as { id: number; src: string }[])[0];
    if (!row) return null;

    await pool.query('DELETE FROM project_media WHERE id = ?', [mediaId]);
    return { src: row.src };
}