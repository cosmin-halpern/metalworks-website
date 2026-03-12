import express from 'express';
import multer from 'multer';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import clientRoutes from './routes/clients.js';
import productRoutes from './routes/products.js';
import settingsRoutes from './routes/settings.js';
import ordersRoutes, { stripeWebhookHandler } from './routes/orders.js';

// Optional: DB ping endpoint (MySQL)
import { dbPing } from './repositories/dbRepo.js';
import { runMigrations } from './db/migrate.js';

dotenv.config();

const app = express();

// 1. Dynamic Port for cPanel (Passenger uses a pipe string)
const PORT = process.env.PORT || 5000;

// Trust the first proxy (LiteSpeed/nginx reverse proxy on cPanel).
// Required for express-rate-limit to correctly read client IPs from X-Forwarded-For.
app.set('trust proxy', 1);

// 2. Allowed CORS origins — extend via ALLOWED_ORIGINS env var (comma-separated)
const allowedOrigins = new Set([
    'https://test.corsican.ro',
    'https://www.corsican.ro',
    'https://corsican.ro',
    'http://localhost:5173',
    'http://localhost:3000',
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()) : []),
]);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.has(origin)) return callback(null, true);
            return callback(new Error(`CORS blocked for origin: ${origin}`), false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    })
);

app.options('*', cors());

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());

// Stripe webhook must receive the raw body — register BEFORE express.json()
app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

app.use(express.json());

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Health Check Routes
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', node: process.version });
});

// Optional: MySQL DB check (very useful on cPanel)
app.get('/api/db-check', async (_req, res) => {
    try {
        const ok = await dbPing();
        res.json({ status: ok ? 'ok' : 'error' });
    } catch (err: any) {
        console.error('DB check error:', err);
        res.status(500).json({ status: 'error', message: err?.message || 'DB check failed' });
    }
});

// Serve Static Images
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Define Routes (API)
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/orders', ordersRoutes);

// Serve React build (client/dist)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
const clientIndexHtml = path.join(clientDistPath, 'index.html');

app.use(
    express.static(clientDistPath, {
        index: false,
    })
);

// SPA fallback (React Router) - keep AFTER /api routes
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    if (req.path.startsWith('/assets')) return next();
    if (path.extname(req.path)) return next();

    if (!fs.existsSync(clientIndexHtml)) {
        return res.status(500).send(`React build not found at: ${clientIndexHtml}.`);
    }

    res.sendFile(clientIndexHtml);
});

// Multer error handler — must be after routes
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof multer.MulterError || err?.message?.startsWith('Only ')) {
        return res.status(400).json({ msg: err.message });
    }
    next(err);
});

// Run pending migrations, then start accepting connections.
// Wrapped in an async IIFE to avoid top-level await, which breaks cPanel's LiteSpeed
// loader (lsnode.js uses require() which cannot handle top-level await in ESM modules).
(async () => {
    try {
        await runMigrations();
    } catch (err) {
        console.error('[migrate] Migration failed — refusing to start:', err);
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();