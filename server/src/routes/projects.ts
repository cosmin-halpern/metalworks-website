import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import auth, { checkRole } from '../middleware/auth.js';
import { uploadMedia } from '../middleware/upload.js';
import { createProject, deleteProjectById, deleteProjectMedia, listProjects } from '../repositories/projectRepo.js';

const router = express.Router();

const createProjectSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1),
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

// GET all projects
router.get('/', async (req, res) => {
    try {
        const parsed = paginationSchema.safeParse(req.query);
        if (!parsed.success) return res.status(400).json({ msg: 'Invalid pagination params' });

        const result = await listProjects(parsed.data.page, parsed.data.limit);
        res.json(result);
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST new project
// (keeping same behavior as your original: auth required, no role check here)
router.post(
    '/',
    auth,
    uploadMedia.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'gallery', maxCount: 60 },
    ]),
    async (req: any, res: any) => {
        try {
            const parsed = createProjectSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    msg: 'Validation failed',
                    errors: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
                });
            }

            const coverImageFile = req.files?.['coverImage']?.[0] ?? null;
            if (!coverImageFile) return res.status(400).json({ msg: 'Cover image is required' });

            const coverImagePath = `/uploads/${coverImageFile.filename}`;

            let media: Array<{ type: 'image' | 'video'; src: string }> = [];
            if (req.files?.['gallery']) {
                media = req.files['gallery'].map((file: any) => ({
                    type: file.mimetype?.startsWith('video') ? 'video' : 'image',
                    src: `/uploads/${file.filename}`,
                }));
            }

            const created = await createProject({
                ...parsed.data,
                coverImage: coverImagePath,
                media,
            });

            res.json(created);
        } catch (err: any) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
);

// DELETE project
router.delete('/:id', auth, checkRole(['admin']), async (req: any, res: any) => {
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) return res.status(400).json({ msg: 'Invalid id' });

        const deleted = await deleteProjectById(id);
        if (!deleted) return res.status(404).json({ msg: 'Project not found' });

        // best-effort delete cover + gallery files
        const allPaths = [
            deleted.coverImage,
            ...deleted.media.map((m) => m.src),
        ];

        for (const p of allPaths) {
            try {
                const abs = path.join(__dirname, '../../', p.replace(/^\//, ''));
                if (fs.existsSync(abs)) fs.unlinkSync(abs);
            } catch {
                // ignore
            }
        }

        res.json({ msg: 'Project removed' });
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// DELETE a single media item from a project's gallery
router.delete('/:id/media/:mediaId', auth, async (req: any, res: any) => {
    try {
        const projectId = Number(req.params.id);
        const mediaId = Number(req.params.mediaId);
        if (!projectId || Number.isNaN(projectId) || !mediaId || Number.isNaN(mediaId)) {
            return res.status(400).json({ msg: 'Invalid id' });
        }

        const deleted = await deleteProjectMedia(mediaId, projectId);
        if (!deleted) return res.status(404).json({ msg: 'Media item not found' });

        try {
            const abs = path.join(__dirname, '../../', deleted.src.replace(/^\//, ''));
            if (fs.existsSync(abs)) fs.unlinkSync(abs);
        } catch {
            // ignore file deletion errors
        }

        res.json({ msg: 'Media item removed' });
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;