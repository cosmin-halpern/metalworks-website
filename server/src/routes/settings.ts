import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import auth, { checkRole } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { optimizeImages } from '../middleware/optimizeImages.js';
import { z } from 'zod';
import { getSettingsSingleton, updateGtmIdSingleton, updateLogoUrlSingleton } from '../repositories/siteSettingsRepo.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Public: read settings
router.get('/', async (_req, res) => {
    try {
        const settings = await getSettingsSingleton();
        res.json({ logoUrl: settings.logoUrl || '', gtmId: settings.gtmId || '' });
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Admin: upload new logo
router.put(
    '/logo',
    auth,
    checkRole(['admin']),
    uploadImage.single('logo'),
    optimizeImages,
    async (req: any, res: any) => {
        try {
            const file = req.file;
            if (!file) return res.status(400).json({ msg: 'Logo file is required' });

            const current = await getSettingsSingleton();
            const oldLogoUrl = current.logoUrl; // "/uploads/..."

            const newLogoUrl = `/uploads/${file.filename}`;
            const updated = await updateLogoUrlSingleton(newLogoUrl);

            // best-effort delete old file
            try {
                if (oldLogoUrl) {
                    const oldAbs = path.join(__dirname, '../../', oldLogoUrl.replace(/^\//, ''));
                    if (fs.existsSync(oldAbs)) fs.unlinkSync(oldAbs);
                }
            } catch {
                // ignore
            }

            res.json({ logoUrl: updated.logoUrl });
        } catch (err: any) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
);

// Google Tag Manager container ID, e.g. GTM-ABC1234; empty string disables tracking
const trackingSchema = z.object({
    gtmId: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^(GTM-[A-Z0-9]{4,12})?$/, 'ID-ul trebuie să aibă forma GTM-XXXXXXX'),
});

// Admin: set tracking IDs
router.put('/tracking', auth, checkRole(['admin']), async (req, res) => {
    const parsed = trackingSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ msg: parsed.error.issues[0]?.message ?? 'Date invalide' });
    }
    try {
        const updated = await updateGtmIdSingleton(parsed.data.gtmId);
        res.json({ gtmId: updated.gtmId });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;