import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    gender: {
        type: String,
        required: false,
        default: ''
    },
    pincode: {
        type: Number,
        required: false,
        default: undefined
    },
    address: {
        type: String,
        required: false,
        default: ''
    }
});

export const User = mongoose.model('User', userSchema);