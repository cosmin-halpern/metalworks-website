import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth, { checkRole } from '../middleware/auth.js';
import { adminExistsByEmailOrUsername, createAdmin, existsAnyAdmin, findAdminByEmail, findAdminById, } from '../repositories/adminRepo.js';
const router = express.Router();
// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }
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
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Server error' });
            }
            res.json({
                token,
                user: { id: admin.id, username: admin.username, role: admin.role },
            });
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});
/**
 * @route   POST api/auth/register
 * @desc    Create a new admin/editor. Restricted to logged-in ADMINS only.
 */
router.post('/register', auth, checkRole(['admin']), async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'username, email, password are required' });
    }
    try {
        const emailLower = email.toLowerCase();
        const exists = await adminExistsByEmailOrUsername(emailLower, username);
        if (exists)
            return res.status(400).json({ msg: 'User already exists' });
        const passwordHash = await bcrypt.hash(password, 10);
        const created = await createAdmin({
            username,
            emailLower,
            passwordHash,
            role: role || 'editor',
        });
        res.json({ msg: `User ${created.username} created as ${created.role}` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});
// GET current user
router.get('/me', auth, async (req, res) => {
    try {
        const id = Number(req.user?.id);
        if (!id || Number.isNaN(id))
            return res.status(401).json({ msg: 'Unauthorized' });
        const admin = await findAdminById(id);
        res.json(admin);
    }
    catch (err) {
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
    const { secret, username, email, password } = req.body;
    if (secret !== process.env.JWT_SECRET)
        return res.status(401).send('Unauthorized');
    if (!username || !email || !password)
        return res.status(400).json({ msg: 'Missing fields' });
    try {
        const already = await existsAnyAdmin();
        if (already)
            return res.status(400).json({ msg: 'Admin already exists' });
        const passwordHash = await bcrypt.hash(password, 10);
        await createAdmin({
            username,
            emailLower: email.toLowerCase(),
            passwordHash,
            role: 'admin',
        });
        res.send('First admin created successfully');
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err.message || 'Server error');
    }
});
export default router;
