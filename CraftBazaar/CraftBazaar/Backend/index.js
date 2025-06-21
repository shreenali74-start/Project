import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

//importing routes
import productRoute from './routes/productRoute.js';
import userRoute from './routes/userRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoutes.js';

//configure dotenv
dotenv.config();

//Port for express app to run
const PORT = 5000

//MongoDB connection URI
const mongoURI = process.env.mongoSecret;

//Express app
const app = express();

//cors policy implementation
app.use(cors());

//Support for json format data
app.use(express.json());

//Route to get static upload files
app.use("/uploads", express.static("uploads/products"));

//Route to handle products
app.use('/products', productRoute);

//Route to handle Users
app.use('/user', userRoute);

//Route to handle cart
app.use('/cart', cartRoute);

//Route to handle orders
app.use('/orders', orderRoute);

// connection to mongodb
mongoose
    .connect(mongoURI)
    .then(() => {
        console.log('App is connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`App is hosted on : http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`Error : ${error}`);
    });