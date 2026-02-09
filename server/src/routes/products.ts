import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/product.js';
import auth, { checkRole } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage (same pattern as projects)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// GET all products (public)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ active: true }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST new product (admin)
router.post(
    '/',
    auth,
    checkRole(['admin']),
    upload.single('image'),
    async (req: any, res: any) => {
        try {
            const { title, description, price } = req.body;

            const imageFile = req.file;
            if (!imageFile) return res.status(400).json({ msg: 'Image is required' });

            const imageUrl = `/uploads/${imageFile.filename}`;

            const newProduct = new Product({
                title,
                description: description || '',
                price: Number(price),
                imageUrl,
                active: true,
            });

            const product = await newProduct.save();
            res.json(product);
        } catch (err: any) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// PUT update product (admin) — can update fields and optionally replace image
router.put(
    '/:id',
    auth,
    checkRole(['admin']),
    upload.single('image'),
    async (req: any, res: any) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).json({ msg: 'Product not found' });

            const { title, description, price, active } = req.body;

            if (typeof title !== 'undefined') product.title = String(title);
            if (typeof description !== 'undefined') product.description = String(description);
            if (typeof price !== 'undefined') product.price = Number(price);
            if (typeof active !== 'undefined') product.active = String(active) === 'true';

            // replace image if new file uploaded
            if (req.file) {
                const oldImageUrl = product.imageUrl; // "/uploads/..."
                product.imageUrl = `/uploads/${req.file.filename}`;

                // best-effort delete old file
                try {
                    const oldAbs = path.join(__dirname, '../../', oldImageUrl.replace(/^\//, ''));
                    if (fs.existsSync(oldAbs)) fs.unlinkSync(oldAbs);
                } catch (e) {
                    // ignore
                }
            }

            await product.save();
            res.json(product);
        } catch (err: any) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// DELETE product (admin)
router.delete('/:id', auth, checkRole(['admin']), async (req: any, res: any) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        const imageUrl = product.imageUrl;

        await product.deleteOne();

        // best-effort delete image file
        try {
            const abs = path.join(__dirname, '../../', imageUrl.replace(/^\//, ''));
            if (fs.existsSync(abs)) fs.unlinkSync(abs);
        } catch (e) {
            // ignore
        }

        res.json({ msg: 'Product removed' });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;