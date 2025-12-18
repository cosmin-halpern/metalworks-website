import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Project from '../models/project.js';
import auth, { checkRole } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads'); // Go up two levels from src/routes to root/uploads
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// GET all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST new project
router.post('/', auth, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'gallery', maxCount: 20 }]), async (req: any, res: any) => {
    try {
        const { title, description } = req.body;

        const coverImageFile = req.files['coverImage'] ? req.files['coverImage'][0] : null;
        if (!coverImageFile) return res.status(400).json({ msg: 'Cover image is required' });

        const coverImagePath = `/uploads/${coverImageFile.filename}`;

        let media = [];
        if (req.files['gallery']) {
            media = req.files['gallery'].map((file: any) => ({
                type: file.mimetype.startsWith('video') ? 'video' : 'image',
                src: `/uploads/${file.filename}`
            }));
        }

        const newProject = new Project({
            title,
            description,
            coverImage: coverImagePath,
            media
        });

        const project = await newProject.save();
        res.json(project);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE project
router.delete('/:id', auth, checkRole(['admin']), async (req: any, res: any) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });

        await project.deleteOne();
        res.json({ msg: 'Project removed' });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;