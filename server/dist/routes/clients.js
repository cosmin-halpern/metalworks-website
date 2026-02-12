import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import auth from '../middleware/auth.js';
import { createClientLogo, deleteClientLogoById, listClientLogos, } from '../repositories/clientLogoRepo.js';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });
function parseId(idParam) {
    const id = Number(idParam);
    if (!id || Number.isNaN(id))
        return null;
    return id;
}
// GET all logos (public)
router.get('/', async (_req, res) => {
    try {
        const logos = await listClientLogos();
        res.json(logos);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// POST new logo (auth)
router.post('/', auth, upload.single('logo'), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ msg: 'No file uploaded' });
        const name = req.body?.name
            ? String(req.body.name)
            : String(req.file.originalname);
        const src = `/uploads/${req.file.filename}`;
        const created = await createClientLogo({ name, src });
        res.json(created);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// DELETE logo (auth)
router.delete('/:id', auth, async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id)
            return res.status(400).json({ msg: 'Invalid id' });
        const deleted = await deleteClientLogoById(id);
        if (!deleted)
            return res.status(404).json({ msg: 'Logo not found' });
        // Best-effort delete uploaded file too
        try {
            const abs = path.join(__dirname, '../../', deleted.src.replace(/^\//, ''));
            if (fs.existsSync(abs))
                fs.unlinkSync(abs);
        }
        catch {
            // ignore
        }
        res.json({ msg: 'Logo removed' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
export default router;
