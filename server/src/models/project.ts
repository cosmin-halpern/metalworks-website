import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    media: [
        {
            type: { type: String, enum: ['image', 'video'], default: 'image' },
            src: { type: String, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);