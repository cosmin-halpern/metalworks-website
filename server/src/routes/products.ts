import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import auth, { checkRole } from '../middleware/auth.js';
import { originalFileName, uploadProductFiles } from '../middleware/upload.js';
import { optimizeImages } from '../middleware/optimizeImages.js';
import {
    addProductMedia,
    createProduct,
    deleteProductById,
    deleteProductMedia,
    getProductById,
    listActiveProducts,
    listAllProducts,
    updateProduct,
    type NewProductMedia,
} from '../repositories/productRepo.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multipart form fields arrive as strings
const formBoolean = z.preprocess((v) => v === 'true' || v === true, z.boolean());

const createProductSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional().default(''),
    price: z.coerce.number().min(0).default(0),
    priceOnRequest: formBoolean.optional().default(false),
});

const updateProductSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0).optional(),
    priceOnRequest: formBoolean.optional(),
    active: formBoolean.optional(),
});

type UploadedFiles = Partial<Record<'image' | 'gallery' | 'attachments', Express.Multer.File[]>>;

// Extra images ("gallery") and PDFs ("attachments") sent with a create or update
function uploadedMedia(files: UploadedFiles | undefined): NewProductMedia[] {
    return [
        ...(files?.gallery ?? []).map((f) => ({ type: 'image' as const, src: `/uploads/${f.filename}` })),
        ...(files?.attachments ?? []).map((f) => ({
            type: 'file' as const,
            src: `/uploads/${f.filename}`,
            name: originalFileName(f),
        })),
    ];
}

function removeUpload(src: string) {
    try {
        const abs = path.join(__dirname, '../../', src.replace(/^\//, ''));
        if (fs.existsSync(abs)) fs.unlinkSync(abs);
    } catch {
        // ignore
    }
}

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

// GET all products including inactive ones (admin)
router.get('/admin', auth, checkRole(['admin']), async (_req, res) => {
    try {
        res.json(await listAllProducts());
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
    uploadProductFiles,
    optimizeImages,
    async (req: any, res: any) => {
        try {
            const parsed = createProductSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    msg: 'Validation failed',
                    errors: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
                });
            }

            const files = req.files as UploadedFiles | undefined;
            const imageFile = files?.image?.[0];
            if (!imageFile) return res.status(400).json({ msg: 'Image is required' });

            const imageUrl = `/uploads/${imageFile.filename}`;

            const created = await createProduct({
                ...parsed.data,
                imageUrl,
                active: true,
            });
            await addProductMedia(created.id, uploadedMedia(files));

            res.json(await getProductById(created.id));
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
    uploadProductFiles,
    optimizeImages,
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

            // replace the main image if a new one was uploaded
            const files = req.files as UploadedFiles | undefined;
            const newImage = files?.image?.[0];
            if (newImage) {
                patch.imageUrl = `/uploads/${newImage.filename}`;
            }

            const previous = await getProductById(id);
            const updated = await updateProduct(id, patch);
            if (!updated) return res.status(404).json({ msg: 'Product not found' });
            if (newImage && previous && previous.imageUrl !== updated.imageUrl) removeUpload(previous.imageUrl);

            // new gallery images / PDFs are added to the existing ones
            await addProductMedia(id, uploadedMedia(files));

            res.json(await getProductById(id));
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

        // best-effort delete of the files (media rows go with the product via ON DELETE CASCADE)
        for (const src of [deleted.imageUrl, ...deleted.images.map((m) => m.src), ...deleted.attachments.map((m) => m.src)]) {
            removeUpload(src);
        }

        res.json({ msg: 'Product removed' });
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// DELETE one extra image or PDF of a product (admin)
router.delete('/:id/media/:mediaId', auth, checkRole(['admin']), async (req: any, res: any) => {
    try {
        const id = parseId(req.params.id);
        const mediaId = parseId(req.params.mediaId);
        if (!id || !mediaId) return res.status(400).json({ msg: 'Invalid id' });

        const deleted = await deleteProductMedia(mediaId, id);
        if (!deleted) return res.status(404).json({ msg: 'Media item not found' });
        removeUpload(deleted.src);

        res.json({ msg: 'Media item removed' });
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;