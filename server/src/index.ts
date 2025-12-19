import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import clientRoutes from './routes/clients.js';
import dotenv from "dotenv";
import {fileURLToPath} from "url";

dotenv.config();

const app = express();

app.use(cors({
    origin: 'https://test.corsican.ro',
    credentials: true
}));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is responding' });
});

app.get('/api/verify', (req, res) => {
    res.json({ msg: 'Server is reachable and running Node 20' });
});

// Handle pre-flight (OPTIONS) requests explicitly
app.options('*', cors());

const PORT = process.env.PORT || 5000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Serve Static Images
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('Metalworks API is running...');
});

// Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});