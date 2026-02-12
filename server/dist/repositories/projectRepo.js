import { pool } from '../db/mysql.js';
async function getProjectMedia(projectId) {
    const [rows] = await pool.query(`
    SELECT id, project_id, type, src, sort_order
    FROM project_media
    WHERE project_id = ?
    ORDER BY sort_order ASC, id ASC
    `, [projectId]);
    return rows.map((r) => ({ type: r.type, src: r.src }));
}
export async function listProjects() {
    const [rows] = await pool.query(`
    SELECT id, title, description, cover_image, created_at, updated_at
    FROM projects
    ORDER BY created_at DESC
    `);
    const projects = rows;
    // Fetch media for each project (simple approach; OK for small/medium lists)
    const result = [];
    for (const p of projects) {
        const media = await getProjectMedia(p.id);
        result.push({
            id: p.id,
            title: p.title,
            description: p.description,
            coverImage: p.cover_image,
            media,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
        });
    }
    return result;
}
export async function getProjectById(id) {
    const [rows] = await pool.query(`
    SELECT id, title, description, cover_image, created_at, updated_at
    FROM projects
    WHERE id = ?
    LIMIT 1
    `, [id]);
    const p = rows[0];
    if (!p)
        return null;
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
export async function createProject(input) {
    const [result] = await pool.query(`
    INSERT INTO projects (title, description, cover_image)
    VALUES (?, ?, ?)
    `, [input.title, input.description, input.coverImage]);
    const projectId = result.insertId;
    if (input.media.length) {
        const values = input.media.map((m, idx) => [projectId, m.type, m.src, idx]);
        await pool.query(`
      INSERT INTO project_media (project_id, type, src, sort_order)
      VALUES ?
      `, [values]);
    }
    const created = await getProjectById(projectId);
    if (!created)
        throw new Error('Failed to load created project');
    return created;
}
export async function deleteProjectById(id) {
    const existing = await getProjectById(id);
    if (!existing)
        return null;
    // project_media rows will be deleted by FK ON DELETE CASCADE
    await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    return existing;
}
