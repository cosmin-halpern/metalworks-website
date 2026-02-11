import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import auth, { checkRole } from '../middleware/auth.js';
import SiteSettings from '../models/siteSettings.js';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath))
            fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });
const getSingleton = async () => {
    let doc = await SiteSettings.findOne();
    if (!doc)
        doc = await SiteSettings.create({ logoUrl: '' });
    return doc;
};
// Public: read settings
router.get('/', async (req, res) => {
    try {
        const settings = await getSingleton();
        res.json({ logoUrl: settings.logoUrl || '' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// Admin: upload new logo
router.put('/logo', auth, checkRole(['admin']), upload.single('logo'), async (req, res) => {
    try {
        const file = req.file;
        if (!file)
            return res.status(400).json({ msg: 'Logo file is required' });
        const settings = await getSingleton();
        const oldLogoUrl = settings.logoUrl; // "/uploads/..."
        settings.logoUrl = `/uploads/${file.filename}`;
        await settings.save();
        // best-effort delete old file
        try {
            if (oldLogoUrl) {
                const oldAbs = path.join(__dirname, '../../', oldLogoUrl.replace(/^\//, ''));
                if (fs.existsSync(oldAbs))
                    fs.unlinkSync(oldAbs);
            }
        }
        catch {
            // ignore
        }
        res.json({ logoUrl: settings.logoUrl });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
export default router;
