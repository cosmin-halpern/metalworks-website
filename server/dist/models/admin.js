import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor'], default: 'editor' }
}, { timestamps: true });
adminSchema.pre('save', async function (next) {
    // If password not modified, do nothing
    if (!this.isModified('password'))
        return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
// We need to extend the document type to include matchPassword
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
export default mongoose.model('Admin', adminSchema);
