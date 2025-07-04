import userModel from "../Model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {validationResult} from "express-validator";
import * as userService from "../Services/userService.js";
export const createusercontroller=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    try{
        const user=await userService.createUser(req.body);
        const token=user.generateToken();
        delete user._doc.password;
        res.status(201).json({user,token});
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
export const logincontroller=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    try{
        const {email,password}=req.body;
        const user=await userModel.findOne({email});
        if(!user)
        {
            return res.status(401).json({message:"Invalid email or password"});
        }
        const isPasswordValid=await user.isValidPassword(password);
        if(!isPasswordValid)
        {
            return res.status(401).json({message:"Invalid email or password"});
        }
        const token=user.generateToken();
        delete user._doc.password;
        res.status(201).json({user,token});
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}