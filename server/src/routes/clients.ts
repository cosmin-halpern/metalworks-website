import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import ClientLogo from '../models/clientLogo.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const logos = await ClientLogo.find();
        res.json(logos);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.post('/', auth, upload.single('logo'), async (req: any, res: any) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

        const newLogo = new ClientLogo({
            name: req.body.name || req.file.originalname,
            src: `/uploads/${req.file.filename}`
        });

        const logo = await newLogo.save();
        res.json(logo);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await ClientLogo.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Logo removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

export default router;