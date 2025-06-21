import express from 'express';

//importing product model
import { Product } from '../models/productModel.js';

//Middleware to upload image with multer
import upload from '../middleware/upload.js';

//creating router
const router = express.Router();

// Get All products
router.get('/', async (_req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({ category });
        return res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get only 1 product details
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const productDetails = await Product.findById(id);
        if (!productDetails)
            return res.status(404).json({ error: 'Product not found' });

        return res.status(200).json({ productDetails });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new product
router.post('/add', upload.single("image"), async (req, res) => {
    const { p_name, desc, price, stock, category } = req.body;
    try {
        if (!p_name || !desc || !price || !stock || !category) {
            return res.status(400).json({
                message: 'Send all required fields'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: 'Product image is required'
            });
        }

        const newProduct = new Product({
            p_name,
            price,
            desc,
            stock,
            category,
            img: [`/uploads/${req.file.filename}`]
        });

        await newProduct.save();

        return res.status(201).json({
            success: 'New product created',
            product: newProduct
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ success: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a product (with support for image upload)
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { p_name, price, stock, desc, category } = req.body;

    if (!(p_name || price || stock || desc || category || req.file)) {
        return res.status(400).json({
            message: 'Send at least one field to update'
        });
    }

    try {
        const payload = {};
        if (p_name) payload.p_name = p_name;
        if (price) payload.price = price;
        if (stock) payload.stock = stock;
        if (desc) payload.desc = desc;
        if (category !== undefined) payload.category = category;
        if (req.file) payload.img = [`/uploads/${req.file.filename}`];

        const updatedProduct = await Product.findByIdAndUpdate(id, payload, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ success: "Product has been updated", product: updatedProduct });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;