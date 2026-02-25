import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import auth, { AuthRequest, checkRole } from '../middleware/auth.js';
import {
    adminExistsByEmailOrUsername,
    createAdmin,
    existsAnyAdmin,
    findAdminByEmail,
    findAdminById,
} from '../repositories/adminRepo.js';

const router = express.Router();

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const registerSchema = z.object({
    username: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['admin', 'editor']).optional().default('editor'),
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { msg: 'Too many login attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// @route   POST api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }

    const { email, password } = parsed.data;

    try {
        const admin = await findAdminByEmail(email.toLowerCase());
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: String(admin.id),
                role: admin.role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ msg: 'Server error' });
                }

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
                    path: '/',
                });

                res.json({ user: { id: admin.id, username: admin.username, role: admin.role } });
            }
        );
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

/**
 * @route   POST api/auth/register
 * @desc    Create a new admin/editor. Restricted to logged-in ADMINS only.
 */
router.post('/register', auth, checkRole(['admin']), async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            msg: 'Validation failed',
            errors: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        });
    }

    const { username, email, password, role } = parsed.data;

    try {
        const emailLower = email.toLowerCase();
        const exists = await adminExistsByEmailOrUsername(emailLower, username);
        if (exists) return res.status(400).json({ msg: 'User already exists' });

        const passwordHash = await bcrypt.hash(password, 10);
        const created = await createAdmin({
            username,
            emailLower,
            passwordHash,
            role,
        });

        res.json({ msg: `User ${created.username} created as ${created.role}` });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST logout — clears the auth cookie
router.post('/logout', (_req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax', path: '/' });
    res.json({ msg: 'Logged out' });
});

// GET current user
router.get('/me', auth, async (req: AuthRequest, res) => {
    try {
        const id = Number(req.user?.id);
        if (!id || Number.isNaN(id)) return res.status(401).json({ msg: 'Unauthorized' });

        const admin = await findAdminById(id);
        res.json(admin);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

/**
 * SEED ROUTE (Temporary)
 * Use this once to create your first SUPER ADMIN account.
 * Remove or comment out after first use!
 */
router.post('/seed-first-admin', async (req, res) => {
    const { secret, username, email, password } = req.body as {
        secret?: string;
        username?: string;
        email?: string;
        password?: string;
    };

    if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) return res.status(401).send('Unauthorized');
    if (!username || !email || !password) return res.status(400).json({ msg: 'Missing fields' });

    try {
        const already = await existsAnyAdmin();
        if (already) return res.status(400).json({ msg: 'Admin already exists' });

        const passwordHash = await bcrypt.hash(password, 10);
        await createAdmin({
            username,
            emailLower: email.toLowerCase(),
            passwordHash,
            role: 'admin',
        });

        res.send('First admin created successfully');
    } catch (err: any) {
        console.error(err);
        res.status(500).send(err.message || 'Server error');
    }
});

export default router;