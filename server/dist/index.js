import express from 'express';
import cors from 'cors';
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
import ordersRoutes from './routes/orders.js';
// Optional: DB ping endpoint (MySQL)
import { dbPing } from './repositories/dbRepo.js';
dotenv.config();
const app = express();
// 1. Dynamic Port for cPanel (Passenger uses a pipe string)
const PORT = process.env.PORT || 5000;
// 2. Comprehensive CORS for testing
const allowedOrigins = new Set([
    'https://test.corsican.ro',
    'http://localhost:5173',
    'http://localhost:3000',
]);
app.use(cors({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.has(origin))
            return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
}));
app.options('*', cors());
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
    }
    catch (err) {
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
app.use(express.static(clientDistPath, {
    index: false,
}));
// SPA fallback (React Router) - keep AFTER /api routes
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api'))
        return next();
    if (req.path.startsWith('/assets'))
        return next();
    if (path.extname(req.path))
        return next();
    if (!fs.existsSync(clientIndexHtml)) {
        return res.status(500).send(`React build not found at: ${clientIndexHtml}.`);
    }
    res.sendFile(clientIndexHtml);
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
