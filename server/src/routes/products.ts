import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import auth, { checkRole } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import {
    createProduct,
    deleteProductById,
    listActiveProducts,
    updateProduct,
} from '../repositories/productRepo.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createProductSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional().default(''),
    price: z.coerce.number().min(0).default(0),
});

const updateProductSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0).optional(),
    active: z.preprocess((v) => v === 'true' || v === true, z.boolean()).optional(),
});

function parseId(idParam: string): number | null {
    const id = Number(idParam);
    if (!id || Number.isNaN(id)) return null;
    return id;
}

// GET all products (public)
router.get('/', async (_req, res) => {
    try {
        const products = await listActiveProducts();
        res.json(products);
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST new product (admin)
router.post(
    '/',
    auth,
    checkRole(['admin']),
    uploadImage.single('image'),
    async (req: any, res: any) => {
        try {
            const parsed = createProductSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    msg: 'Validation failed',
                    errors: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
                });
            }

            const imageFile = req.file;
            if (!imageFile) return res.status(400).json({ msg: 'Image is required' });

            const imageUrl = `/uploads/${imageFile.filename}`;

            const created = await createProduct({
                ...parsed.data,
                imageUrl,
                active: true,
            });

            res.json(created);
        } catch (err: any) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
);

// PUT update product (admin) — can update fields and optionally replace image
router.put(
    '/:id',
    auth,
    checkRole(['admin']),
    uploadImage.single('image'),
    async (req: any, res: any) => {
        try {
            const id = parseId(req.params.id);
            if (!id) return res.status(400).json({ msg: 'Invalid product id' });

            const parsed = updateProductSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    msg: 'Validation failed',
                    errors: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
                });
            }

            const patch: any = { ...parsed.data };

            // replace image if new file uploaded
            if (req.file) {
                patch.imageUrl = `/uploads/${req.file.filename}`;
            }

            const updated = await updateProduct(id, patch);
            if (!updated) return res.status(404).json({ msg: 'Product not found' });

            res.json(updated);
        } catch (err: any) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
);

// DELETE product (admin)
router.delete('/:id', auth, checkRole(['admin']), async (req: any, res: any) => {
    try {
        const id = parseId(req.params.id);
        if (!id) return res.status(400).json({ msg: 'Invalid product id' });

        const deleted = await deleteProductById(id);
        if (!deleted) return res.status(404).json({ msg: 'Product not found' });

        // best-effort delete image file
        try {
            const abs = path.join(__dirname, '../../', deleted.imageUrl.replace(/^\//, ''));
            if (fs.existsSync(abs)) fs.unlinkSync(abs);
        } catch {
            // ignore
        }

        res.json({ msg: 'Product removed' });
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;