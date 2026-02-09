import mongoose from 'mongoose';

type ProductDoc = mongoose.Document & {
    title: string;
    description?: string;
    price: number;
    imageUrl: string;
    active: boolean;
    trackStock: boolean;
    stock: number;
};

const ProductSchema = new mongoose.Schema<ProductDoc>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        price: { type: Number, required: true, min: 0 },
        imageUrl: { type: String, required: true },
        active: { type: Boolean, default: true },

        trackStock: { type: Boolean, default: false },
        stock: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
);

const Product = mongoose.model<ProductDoc>('Product', ProductSchema);
export default Product;