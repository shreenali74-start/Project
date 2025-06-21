import express from 'express';

//importing the orders model
import { Order } from '../models/orderModel.js'

//JWT authentication middleware
import auth from '../middleware/auth.js';

//create router
const router = express.Router();

//route to get all the orders
router.get('/', async(req, res) => {
    try {
        //finding data in DESC order of orderDate
        const orders = await Order.find().sort({ orderDate: -1 });

        //check if orders array is empty
        if (orders.length !== 0)
            return res.status(200).json(orders);
        else
            return res.status(400).json({ Error: "No Orders Found." })
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new order (protected route)
router.post('/', auth, async(req, res) => {
    try {

        //get some parameters from request bodya
        const { items, totalAmount, gst, totalBill } = req.body;

        //get user id from authentication middleware after processing token
        const userId = req.userId;

        //create new order in the database
        const order = new Order({
            userId,
            items,
            totalAmount,
            gst,
            totalBill,
        });

        //save the order in database
        const savedOrder = await order.save();
        //return the saved order
        return res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//update address and recipient details
router.put('/update', async(req, res) => {

    //get all the required data for updating order
    const { orderId, username, email, phone, address, pincode } = req.body;

    try {
        //check if any data is missing
        if (!orderId ||
            !username ||
            !email ||
            !phone ||
            !address ||
            !pincode
        ) {
            return res.status(404).send({
                message: 'Send all required fields',
            });
        }

        //create payload to update the order
        const payload = {
            recipient: username,
            email: email,
            phone: phone,
            shippingAddress: address,
            pincode: pincode
        }

        //find the order with id and update with payload
        await Order.findByIdAndUpdate(orderId, payload);
        //return success message 
        return res.status(200).json({ Success: "Updated succesfully" });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all orders for a user
router.get('/user', auth, async(req, res) => {
    try {
        //get user id from authenication middleware after processing the token
        const userId = req.userId;
        //find all the orders related to user id 
        const orders = await Order.find({ userId }).populate('items.productId'); // Populate product details

        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a single order by ID
router.get('/:orderId', auth, async(req, res) => {
    try {
        //get order details with id from url
        const order = await Order.findById(req.params.orderId).populate('items.productId');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//Delete or remove an order from database
router.delete('/:orderId', async(req, res) => {
    //get the order id from url
    const { orderId } = req.params;
    try {
        //find and delete the order from database with ordetr id
        await Order.findByIdAndDelete(orderId);

        return res.status(200).json({ Success: "Order has been cancelled" });
    } catch (error) {
        console.error('Error deleting order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

export default router;