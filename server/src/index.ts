import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import clientRoutes from './routes/clients.js';
import productRoutes from './routes/products.js';
import settingsRoutes from './routes/settings.js';
import ordersRoutes from './routes/orders.js';

dotenv.config();

const app = express();

// Dynamic Port for cPanel/Passenger
const PORT = process.env.PORT || 5000;

// CORS
const allowedOrigins = new Set([
    'https://test.corsican.ro',
    'http://localhost:5173',
    'http://localhost:3000',
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

app.use(express.json());

// Temporary request log for login (helps when cPanel hides stack traces)
app.use('/api/auth/login', (req, _res, next) => {
    console.log('[AUTH LOGIN]', {
        method: req.method,
        url: req.originalUrl,
        contentType: req.headers['content-type'],
    });
    next();
});

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', node: process.version });
});

// Serve Static Images
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/orders', ordersRoutes);

// Global API error handler (must be AFTER routes)
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith('/api')) return next();

    console.error('[API ERROR]', req.method, req.originalUrl);
    console.error(err);

    const message = err instanceof Error ? err.message : 'Internal Server Error';
    res.status(500).json({ status: 'error', message });
});

// Serve React build (client/dist)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
const clientIndexHtml = path.join(clientDistPath, 'index.html');

app.use(
    express.static(clientDistPath, {
        index: false,
    })
);

// SPA fallback (React Router) - keep AFTER /api routes and static middleware
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    if (req.path.startsWith('/assets')) return next();
    if (path.extname(req.path)) return next();

    if (!fs.existsSync(clientIndexHtml)) {
        return res
            .status(500)
            .send(`React build not found at: ${clientIndexHtml}.`);
    }

    res.sendFile(clientIndexHtml);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Connect DB in background
if (process.env.MONGO_URI) {
    mongoose
        .connect(process.env.MONGO_URI as string)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.error('MongoDB Connection Error:', err));
} else {
    console.warn('MONGO_URI is not set. DB connection will not be established.');
}