import mongoose from 'mongoose';

export type OrderPaymentMethod = 'cash' | 'bank' | 'card';
export type OrderStatus = 'new' | 'processing' | 'shipped' | 'completed' | 'cancelled';

type OrderItem = {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl?: string;
};

type ShippingDetails = {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
};

type InvoiceDetails = {
    needInvoice: boolean;
    companyName?: string;
    cui?: string;
    companyAddress?: string;
};

type OrderDoc = mongoose.Document & {
    orderNumber: string;
    items: OrderItem[];
    shipping: ShippingDetails;
    invoice: InvoiceDetails;
    paymentMethod: OrderPaymentMethod;
    total: number;
    status: OrderStatus;
};

const OrderItemSchema = new mongoose.Schema<OrderItem>(
    {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        imageUrl: { type: String, default: '' },
    },
    { _id: false }
);

const OrderSchema = new mongoose.Schema<OrderDoc>(
    {
        orderNumber: { type: String, required: true, unique: true, index: true },
        items: { type: [OrderItemSchema], required: true },
        shipping: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
        },
        invoice: {
            needInvoice: { type: Boolean, default: false },
            companyName: { type: String, default: '' },
            cui: { type: String, default: '' },
            companyAddress: { type: String, default: '' },
        },
        paymentMethod: { type: String, enum: ['cash', 'bank', 'card'], required: true },
        total: { type: Number, required: true, min: 0 },
        status: { type: String, enum: ['new', 'processing', 'shipped', 'completed', 'cancelled'], default: 'new' },
    },
    { timestamps: true }
);

const Order = mongoose.model<OrderDoc>('Order', OrderSchema);
export default Order;