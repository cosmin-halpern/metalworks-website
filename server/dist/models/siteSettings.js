import mongoose from 'mongoose';
const SiteSettingsSchema = new mongoose.Schema({
    logoUrl: { type: String, default: '' },
}, { timestamps: true });
const SiteSettings = mongoose.model('SiteSettings', SiteSettingsSchema);
export default SiteSettings;
