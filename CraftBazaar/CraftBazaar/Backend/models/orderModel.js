import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
    }, ],
    totalAmount: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
    totalBill: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    recipient: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: Number,
        required: false
    },
    shippingAddress: {
        type: String,
        default: '',
        required: false
    },
    pincode: {
        type: Number,
        required: false,
        default: undefined
    },
    paymentMode: {
        type: String,
        enum: ['Cash on Delivery', 'UPI', 'Card'],
        default: 'Cash on Delivery',
        required: false
    }
});

export const Order = mongoose.model('Order', orderSchema);