import express from "express";
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

//Sign-up Route
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {

        //check if the user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message : `User already exists `});
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
      
    
        //save the user to the database
        await newUser.save();


        //create jwt token
        const token = jwt.sign({id: newUser._id }, process.env.JWT_SECRET,{
            expiresIn: '1h',
        })
        console.log(token)
        res.status(201).json({ message: 'User created successfully', token });
    }
    catch(err){
        res.status(500).json({ message:`Server error `, error: err.message });
    }
});

//Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message : `Invalid Credentials` });
        }

        //check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message : `Invalid Credentials `});
        }

        //creater a jwt token
        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {
            expiresIn :'1h',
        });

        res.status(200).json({message : 'login Successful', token});
    }
    catch(err){
        res.status(500).json({ message : `Server error `, error: err.message });
    }
});

export default router;