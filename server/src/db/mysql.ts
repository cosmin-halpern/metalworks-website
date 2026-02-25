import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


// Ensure env vars are loaded before creating the pool (ESM import order safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This resolves to: server/.env (because this file is server/src/db/mysql.ts)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const required = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'] as const;
for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing required env var: ${key}`);
    }
}

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,       // shared cPanel hosts cap connections per user at ~10–25
    queueLimit: 50,           // cap queue so requests fail fast under overload
    connectTimeout: 10_000,   // 10 s — prevent silent hangs if MySQL is slow to respond
    enableKeepAlive: true,    // recycle idle connections before the server drops them
    keepAliveInitialDelay: 30_000, // start keep-alive pings after 30 s of idle
});