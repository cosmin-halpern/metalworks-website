import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { NextFunction, Request, Response } from 'express';

// Compresses images right after multer saves them, keeping the same file name so
// routes and stored paths are unaffected. Never fails an upload: on any problem the
// original file is kept.
//
// sharp is a native module. The hosting no longer lets us run `npm install`, so the
// deploy workflow installs a Linux build of sharp into server/vendor/node_modules and
// uploads it over FTP. It is loaded lazily: if it is missing or its binary doesn't run
// on the server, the app still starts and uploads are stored uncompressed.

const MAX_DIMENSION = 1920;
const QUALITY = 78;
// Keep the original unless the optimized file is at least 10% smaller
const MIN_SAVING_RATIO = 0.9;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// From dist/middleware (or src/middleware) up to server/vendor
const VENDOR_DIR = path.join(__dirname, '../../vendor');

type Sharp = typeof import('sharp');

let sharpPromise: Promise<Sharp | null> | null = null;

async function importSharp(): Promise<Sharp> {
    try {
        return (await import('sharp')).default;
    } catch {
        // Not in server/node_modules: try the copy uploaded by the deploy workflow
        const requireFromVendor = createRequire(path.join(VENDOR_DIR, 'index.js'));
        return requireFromVendor('sharp') as Sharp;
    }
}

export function loadSharp(): Promise<Sharp | null> {
    if (!sharpPromise) {
        sharpPromise = importSharp()
            .then((sharp) => {
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
