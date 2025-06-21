import express from 'express';

//importing user model 
import { User } from '../models/userModel.js';

//library to encrypt password
import bcrypt from 'bcrypt';

//library to create and decode tokens
import jwt from 'jsonwebtoken';

//middleware to authenticate tokens
import auth from '../middleware/auth.js';

//create router 
const router = express.Router();

//Get all user details
router.get('/', async(req, res) => {
    try {
        const users = await User.find();

        if (users.length == 0)
            return res.status(400).json({ Error: "No users found" });

        return res.status(200).json({ users });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//Get only one user details
router.get('/getOne', auth, async(req, res) => {
    const id = req.userId;

    try {
        const userDetails = await User.findById(id);

        if (!userDetails)
            return res.status(400).json({ Error: 'No User Found' });

        return res.status(200).json(userDetails);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//Register a new User
router.post('/register', async(req, res) => {
    const { username, email, phone, password } = req.body;
    try {
        if (!username ||
            !email ||
            !phone ||
            !password
        ) {
            return res.status(404).send({
                message: 'Send all required fields'
            });
        }

        //try to find if the user email is already registered
        const user = await User.findOne({ email });
        if (user)
            return res.status(404).json({ Error: 'Email already exists' })

        //encrypt password
        const hashedPass = await bcrypt.hash(password, 10);

        //create new user 
        const newUser = new User({
            username: username,
            email: email,
            phone: phone,
            password: hashedPass
        })

        //save new user
        await newUser.save();

        //create payload for the JWT
        const payload = {
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password
            }
        }

        //create token with required parameters
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24hr' });

        // return user information and token  
        return res.status(201).json({
            Success: "New user has been created",
            user: newUser,
            token: token
        });

    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//user login handling
router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(404).send({
                message: 'Send all required fields'
            });
        }

        //check if user exists in database
        const userData = await User.findOne({ email });
        if (!userData)
            return res.status(400).json({ Error: 'No User Found' });

        //check for bcrypt to compare input password with database stored password
        const isPass = await bcrypt.compare(password, userData.password);

        //if passwords do not match return error
        if (!isPass)
            return res.status(404).json({ Error: 'Invalid credentials' });

        //passwords match so create payload for JWT
        const payload = {
            id: userData._id,
            username: userData.username,
            email: userData.email,
            password: userData.password,
        }

        //create JWT with required options
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24hr' });

        //return userdata and token
        return res.status(200).json({
            Success: 'Login Successfull',
            User: userData,
            token: token
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//Deleting user account
router.delete('/:id', async(req, res) => {
    const { id } = req.params;
    try {
        //find user by id and delete the account
        await User.findByIdAndDelete(id);

        return res.status(200).json({ Success: "User account has been removed" });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//Updating user profile
router.put('/', auth, async(req, res) => {
    //get all the data sent from frontend
    const { username, email, phone, age, gender, address, pincode } = req.body;
    //get userId from auth after token verification
    const userId = req.userId;
    try {
        //check if the minimum fields are sent for the update
        if (!userId && (username || email || phone || age || gender)) {
            return res.status(404).json({ Error: "Send minimun required fields to update" });
        }

        //creating payload
        const payload = {};
        //checking each parameter if they are sent and if sent add to payload
        if (username) payload.username = username;
        if (email) payload.email = email;
        if (phone) payload.phone = phone;
        if (age) payload.age = age;
        if (gender) payload.gender = gender;
        if (address) payload.address = address;
        if (pincode) payload.pincode = pincode;

        //find theuser with id and upload with payload
        await User.findByIdAndUpdate(userId, payload);

        return res.status(200).json({ Success: "Updated succesfully" });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

export default router;