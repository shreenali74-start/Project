import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    p_name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: false,
        default: 0
    },
    img: [{
        type: String,
    }],
    category:{
        type:String,
        required:true
    }

});

export const Product = mongoose.model('Product', productSchema);