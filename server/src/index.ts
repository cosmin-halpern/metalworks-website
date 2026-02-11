import express from 'express';
import mongoose from 'mongoose';
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
        // allow requests like curl/postman (no Origin header)
        if (!origin) return callback(null, true);

        if (allowedOrigins.has(origin)) return callback(null, true);

        // block everything else
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

// 3. Health Check Routes (for debugging cPanel)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', node: process.version });
});

// 4. Serve Static Images
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/orders', ordersRoutes);

app.get('/', (req, res) => {
    res.send('Metalworks API is running...');
});

// 5. Start Server First (Prevents 504 Timeout)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// 6. Connect DB in background
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI as string)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.error('MongoDB Connection Error:', err));
}