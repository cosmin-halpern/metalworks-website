import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Request } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const ALLOWED_IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

const ALLOWED_VIDEO_MIMES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);
const ALLOWED_VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov']);

const IMAGE_SIZE_LIMIT = 10 * 1024 * 1024;   // 10 MB
const PRODUCT_FILE_SIZE_LIMIT = 20 * 1024 * 1024; // 20 MB (PDF data sheets)
const MEDIA_SIZE_LIMIT = 100 * 1024 * 1024;  // 100 MB

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
});

function imageFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_IMAGE_MIMES.has(file.mimetype) && ALLOWED_IMAGE_EXTS.has(ext)) {
        return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'));
}

function mediaFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const ext = path.extname(file.originalname).toLowerCase();
    const isImage = ALLOWED_IMAGE_MIMES.has(file.mimetype) && ALLOWED_IMAGE_EXTS.has(ext);
    const isVideo = ALLOWED_VIDEO_MIMES.has(file.mimetype) && ALLOWED_VIDEO_EXTS.has(ext);
    if (isImage || isVideo) return cb(null, true);
    cb(new Error('Only image (JPEG, PNG, WebP, GIF) or video (MP4, WebM, MOV) files are allowed'));
}

export const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: IMAGE_SIZE_LIMIT },
});

export const uploadMedia = multer({
    storage,
    fileFilter: mediaFilter,
    limits: { fileSize: MEDIA_SIZE_LIMIT },
});

// Store products: "image" (main) and "gallery" take images, "attachments" takes PDFs
function productFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.fieldname === 'attachments') {
        if (file.mimetype === 'application/pdf' && ext === '.pdf') return cb(null, true);
        return cb(new Error('Only PDF files are allowed as attachments'));
    }
    if (ALLOWED_IMAGE_MIMES.has(file.mimetype) && ALLOWED_IMAGE_EXTS.has(ext)) return cb(null, true);
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'));
}

export const uploadProductFiles = multer({
    storage,
    fileFilter: productFilter,
    limits: { fileSize: PRODUCT_FILE_SIZE_LIMIT },
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 20 },
    { name: 'attachments', maxCount: 10 },
]);

// Browsers send file names as UTF-8 but multer reads them as Latin-1 ("FiÈ™a" instead of "Fișa")
export function originalFileName(file: Express.Multer.File): string {
    return Buffer.from(file.originalname, 'latin1').toString('utf8').slice(0, 255);
}
