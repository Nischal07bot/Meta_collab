import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:[3,"username must be at least 3 characters long"],
    },
    password:{
        type:String,
        required:true,
        minlength:[3,"password must be at least 3 characters long"],
    }
})
userSchema.statics.hashPassword=async function(password)
{
    return await bcrypt.hash(password,5);
}
userSchema.methods.isValidPassword=async function(password)
{
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateToken=function()
{
    return jwt.sign({email:this.email,id:this._id},process.env.JWT_SECRET,{expiresIn:"1h"});
}
const userModel=mongoose.model("User",userSchema);
export default userModel;