import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';
import auth, { checkRole } from '../middleware/auth.js';
const router = express.Router();
// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = {
            user: {
                id: admin.id,
                role: admin.role
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
            if (err)
                throw err;
            res.json({
                token,
                user: { id: admin.id, username: admin.username, role: admin.role }
            });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
/**
 * @route   POST api/auth/register
 * @desc    Create a new admin/editor. Restricted to logged-in ADMINS only.
 */
router.post('/register', auth, checkRole(['admin']), async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        let admin = await Admin.findOne({ $or: [{ email }, { username }] });
        if (admin)
            return res.status(400).json({ msg: 'User already exists' });
        admin = new Admin({ username, email, password, role: role || 'editor' });
        await admin.save();
        res.json({ msg: `User ${username} created as ${admin.role}` });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// GET current user
router.get('/me', auth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.user?.id).select('-password');
        res.json(admin);
    }
    catch (err) {
        res.status(500).send('Server error');
    }
});
/**
 * SEED ROUTE (Temporary)
 * Use this once to create your first SUPER ADMIN account.
 * Remove or comment out after first use!
 */
router.post('/seed-first-admin', async (req, res) => {
    const { secret, username, email, password } = req.body;
    // Simple safety check so not anyone can call this
    if (secret !== process.env.JWT_SECRET)
        return res.status(401).send('Unauthorized');
    try {
        let admin = await Admin.findOne({ role: 'admin' });
        if (admin)
            return res.status(400).json({ msg: 'Admin already exists' });
        admin = new Admin({ username, email, password, role: 'admin' });
        await admin.save();
        res.send('First admin created successfully');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
export default router;
