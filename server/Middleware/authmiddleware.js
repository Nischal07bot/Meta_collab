import jwt from "jsonwebtoken";

export const authmiddleware=(req,res,next)=>{
    const header=req.headers.authorization;
    if(!header)
    {
        return res.status(401).json({message:"Unauthorized"});
    }
    const token=header.split(" ")[1];
    if(!token)
    {
        return res.status(401).json({message:"Unauthorized"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(error)
    {
        return res.status(401).json({message:"Unauthorized"});
    }
}