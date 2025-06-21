import { request } from 'express';
import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
    p_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    qty: {
        type: Number,
        required: true
    }
});

export const Cart = mongoose.model('Cart', cartSchema);