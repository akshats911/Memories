import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
 
export const signin = async (req,res)=>{
    const {email, password} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            return res.status(404).json({message: "User doesn't exist"});
        } 
        const isPassCorr = await bcrypt.compare(password, existingUser.password);
        if (!isPassCorr) {
            return res.status(400).json({message: "Invalid Credentials"});
        }
        const token = jwt.sign({email:existingUser.email, id:existingUser._id}, 'test', {expiresIn: "1h"});
        console.log(token);
        res.status(200).json({userObject: existingUser, token});
    }catch (error) {
        res.status(500).json({message: "Something went wrong"});
    }
}  

export const signup = async (req,res)=>{
    const {email, password, confirmPassword, firstName, lastName} = req.body;
    try {
        // console.log("yahan tak aagya tha lolll");
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        } 
        if (password !== confirmPassword) {
            return res.status(400).json({message: "Passwords don't match"});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const userObject = await User.create({email, password: hashedPassword, name: `${firstName} ${lastName}`});
        const token = jwt.sign({email:userObject.email, id:userObject._id}, 'test', {expiresIn: "1h"});
        res.status(200).json({userObject, token});
    } catch (error) {
        res.status(500).json({message: "Something went wrong"});
    }
}