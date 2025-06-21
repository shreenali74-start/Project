import express from 'express';

//importing the cart model
import { Cart } from '../models/cartModel.js';

//authentication middleware for JWT
import auth from '../middleware/auth.js';

//create router
const router = express.Router();

//route to add item to cart
router.post('/add', auth, async(req, res) => {

    //get user id after authentication middleware processing
    const u_id = req.userId;

    //get product id and quantity from frontend
    const { p_id, qty } = req.body;
    try {
        //check if all required field are recieved
        if (!p_id ||
            !u_id ||
            !qty
        ) {
            return res.status(404).send({
                message: 'Send all required fields'
            });
        }

        // Check if the product is already in the user's cart
        const existingCartItem = await Cart.findOne({ u_id, p_id });

        //if item is already in cart return error
        if (existingCartItem) {
            return res.status(409).json({ message: 'Product already in cart' });
        }

        //create new cart item
        const newCart = new Cart({
            p_id,
            u_id,
            qty
        });

        //save cart item 
        await newCart.save();

        //return success
        return res.status(201).json({
            Success: 'Item Added to cart',
            product: newCart
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        return res.status(500).send({ message: err.message });
    }
});

// GET /api/cart/:userId
router.get('/', auth, async(req, res) => {
    try {
        //get user id after authentication middleware processing
        const userId = req.userId;
        //find all cart items for the user id
        const cartItems = await Cart.find({ u_id: userId }).populate('p_id', 'p_name price img'); // Populate product details

        // Transform the cartItems to include product details directly
        const transformedCartItems = cartItems.map(item => {
            return {
                _id: item._id, // Cart item ID
                userId: item.u_id,
                qty: item.qty,
                productId: item.p_id._id, // Product ID
                p_name: item.p_id.p_name,
                price: item.p_id.price,
                img: item.p_id.img,
            };
        });

        //return all cart items
        return res.status(200).json(transformedCartItems);
    } catch (error) {
        console.error('Error getting cart items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//Route to update the quantity
router.put('/updateQty', async(req, res) => {
    //getting cart id and quantity
    const { cartId, qty } = req.body;
    try {
        //check if id or qty is missing
        if (!cartId || !qty) {
            return res.status(404).send({
                message: 'Send all required fields'
            });
        }

        // find and update quantity with id and qty
        await Cart.findByIdAndUpdate(cartId, { qty: qty });
        return res.status(200).json({ Success: "Updated succesfully" });

    } catch (error) {
        console.error('Error getting cart items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//Route to delete the items in cart
router.delete('/', auth, async(req, res) => {

    //get user id after authentication middleware processing
    const userId = req.userId;
    try {
        //check if the user id is valid
        if (!userId) {
            return res.status(400).json({
                Error: "Invalid token authentication"
            });
        }

        //delete all the cart items with user id
        await Cart.deleteMany({ u_id: userId });
        return res.status(200).json({ success: "Deleted succesfully" });

    } catch (error) {
        console.error('Error deleting cart items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

export default router;