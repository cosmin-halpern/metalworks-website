import mongoose from 'mongoose';

type SiteSettingsDoc = mongoose.Document & {
    logoUrl: string; // "/uploads/..."
};

const SiteSettingsSchema = new mongoose.Schema<SiteSettingsDoc>(
    {
        logoUrl: { type: String, default: '' },
    },
    { timestamps: true }
);

const SiteSettings = mongoose.model<SiteSettingsDoc>('SiteSettings', SiteSettingsSchema);
export default SiteSettings;