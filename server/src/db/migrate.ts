import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Compiled output is server/dist/db/migrate.js → migrations live at server/migrations/
const MIGRATIONS_DIR = path.resolve(__dirname, '../../migrations');

async function ensureTrackingTable(): Promise<void> {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
            name       VARCHAR(255) NOT NULL,
            applied_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY uk_schema_migrations_name (name)
        )
    `);
}

function parseStatements(sql: string): string[] {
    return sql
        .replace(/--[^\n]*/g, '')          // strip line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')  // strip block comments
        .split(';')
        .map(s => s.trim())
        .filter(Boolean);
}

export async function runMigrations(): Promise<void> {
    await ensureTrackingTable();

    const [rows] = await pool.query('SELECT name FROM schema_migrations');
    const applied = new Set((rows as { name: string }[]).map(r => r.name));

    if (!fs.existsSync(MIGRATIONS_DIR)) {
        console.log('[migrate] No migrations directory found — skipping.');
        return;
    }

    const pending = fs
        .readdirSync(MIGRATIONS_DIR)
        .filter(f => f.endsWith('.sql'))
        .sort()
        .filter(f => !applied.has(f));

    if (pending.length === 0) {
        console.log('[migrate] Database is up to date.');
        return;
    }

    console.log(`[migrate] Running ${pending.length} pending migration(s)...`);

    for (const file of pending) {
        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
        const statements = parseStatements(sql);

        try {
            for (const stmt of statements) {
                await pool.query(stmt);
            }
            await pool.query('INSERT INTO schema_migrations (name) VALUES (?)', [file]);
            console.log(`[migrate] ✓ ${file}`);
        } catch (err) {
            console.error(`[migrate] ✗ ${file} failed:`, err);
            throw err; // halt — server will not start with a broken schema
        }
    }

    console.log('[migrate] Done.');
}

// Allow running as a standalone script: node dist/db/migrate.js
if (process.argv[1] === __filename) {
    runMigrations()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}