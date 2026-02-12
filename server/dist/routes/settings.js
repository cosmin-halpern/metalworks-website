import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import auth, { checkRole } from '../middleware/auth.js';
import { getSettingsSingleton, updateLogoUrlSingleton } from '../repositories/siteSettingsRepo.js';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath))
            fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (_req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });
// Public: read settings
router.get('/', async (_req, res) => {
    try {
        const settings = await getSettingsSingleton();
        res.json({ logoUrl: settings.logoUrl || '' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// Admin: upload new logo
router.put('/logo', auth, checkRole(['admin']), upload.single('logo'), async (req, res) => {
    try {
        const file = req.file;
        if (!file)
            return res.status(400).json({ msg: 'Logo file is required' });
        const current = await getSettingsSingleton();
        const oldLogoUrl = current.logoUrl; // "/uploads/..."
        const newLogoUrl = `/uploads/${file.filename}`;
        const updated = await updateLogoUrlSingleton(newLogoUrl);
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
        res.json({ logoUrl: updated.logoUrl });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
export default router;
