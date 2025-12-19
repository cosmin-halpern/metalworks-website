import mongoose from 'mongoose';
const clientLogoSchema = new mongoose.Schema({
    name: { type: String, required: false },
    src: { type: String, required: true }
});
export default mongoose.model('ClientLogo', clientLogoSchema);
