import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    active: { type: Boolean, default: true },
    trackStock: { type: Boolean, default: false },
    stock: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
const Product = mongoose.model('Product', ProductSchema);
export default Product;
