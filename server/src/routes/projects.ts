import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import auth, { checkRole } from '../middleware/auth.js';
import { createProject, deleteProjectById, listProjects } from '../repositories/projectRepo.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (_req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// GET all projects
router.get('/', async (_req, res) => {
    try {
        const projects = await listProjects();
        res.json(projects);
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
    upload.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'gallery', maxCount: 60 },
    ]),
    async (req: any, res: any) => {
        try {
            const { title, description } = req.body as { title?: string; description?: string };

            if (!title) return res.status(400).json({ msg: 'title is required' });
            if (!description) return res.status(400).json({ msg: 'description is required' });

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
                title: String(title),
                description: String(description),
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

export default router;