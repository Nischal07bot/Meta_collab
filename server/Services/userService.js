import userModel from "../Model/userModel.js";

export const createUser=async(userData)=>{
    const {email,password}=userData;
    if(!email || !password)
    {
        throw new Error("Email and password are required");
    }
    const existingUser=await userModel.findOne({email});
    if(existingUser)
    {
        throw new Error("User already exists");
    }
    const hashedPassword=await userModel.hashPassword(password);
    const user=await userModel.create({email,password:hashedPassword});
    const isPasswordValid=await user.isValidPassword(password);
    if(!isPasswordValid)
    {
        throw new Error("Invalid password");
    }
    return user;
}