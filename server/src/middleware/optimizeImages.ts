import fs from 'fs/promises';
import { NextFunction, Request, Response } from 'express';

// Compresses images right after multer saves them, keeping the same file name so
// routes and stored paths are unaffected. Never fails an upload: on any problem the
// original file is kept.
//
// sharp is a native module and must be installed on the server ("Run NPM Install" in
// cPanel). It is loaded lazily so the app still starts, and uploads still work
// uncompressed, if it is missing.

const MAX_DIMENSION = 1920;
const QUALITY = 78;
// Keep the original unless the optimized file is at least 10% smaller
const MIN_SAVING_RATIO = 0.9;

type Sharp = typeof import('sharp');

let sharpPromise: Promise<Sharp | null> | null = null;

function loadSharp(): Promise<Sharp | null> {
    if (!sharpPromise) {
        sharpPromise = import('sharp')
            .then((mod) => {
                const sharp = mod.default;
                // Shared hosting: keep memory and CPU use low
                sharp.cache(false);
                sharp.concurrency(1);
                return sharp;
            })
            .catch((err) => {
                console.warn('[optimizeImages] sharp not available, uploads are stored uncompressed:', err?.message);
                return null;
            });
    }
    return sharpPromise;
}

async function optimizeFile(sharp: Sharp, file: Express.Multer.File) {
    const original = await fs.readFile(file.path);

    // .rotate() applies the EXIF orientation (phone photos) before metadata is stripped
    let pipeline = sharp(original, { failOn: 'none' })
        .rotate()
        .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true });

    if (file.mimetype === 'image/jpeg') {
        pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
    } else if (file.mimetype === 'image/png') {
        // Stays PNG so logos keep their transparency
        pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
    } else if (file.mimetype === 'image/webp') {
        pipeline = pipeline.webp({ quality: QUALITY });
    } else {
        return; // GIF (may be animated) and videos are left untouched
    }

    const optimized = await pipeline.toBuffer();
    if (optimized.length >= original.length * MIN_SAVING_RATIO) return;

    // Write next to the original, then swap, so a crash never leaves a half-written file
    const tmpPath = `${file.path}.tmp`;
    await fs.writeFile(tmpPath, optimized);
    await fs.rename(tmpPath, file.path);
    file.size = optimized.length;
}

function collectFiles(req: Request): Express.Multer.File[] {
    const files: Express.Multer.File[] = [];
    if (req.file) files.push(req.file);
    if (Array.isArray(req.files)) files.push(...req.files);
    else if (req.files) Object.values(req.files).forEach((list) => files.push(...list));
    return files;
}

export async function optimizeImages(req: Request, _res: Response, next: NextFunction) {
    const images = collectFiles(req).filter((f) => f.mimetype.startsWith('image/'));
    if (images.length === 0) return next();

    const sharp = await loadSharp();
    if (!sharp) return next();

    for (const file of images) {
        try {
            await optimizeFile(sharp, file);
        } catch (err) {
            console.error(`[optimizeImages] keeping original ${file.filename}:`, err);
        }
    }
    next();
}
