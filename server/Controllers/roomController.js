import roomModel from "../Model/roomModel.js"
import {v4 as uuidv4} from "uuid";

export const createRoom=async(req,res)=>{
    const {roomName,roompassword}=req.body;
    const hashedPassword=await roomModel.hashPassword(roompassword);
    const room=new roomModel({
        roomName,
        roompassword:hashedPassword,
        roomId:uuidv4(),
        owner:req.user._id,
        createdAt:Date.now(),
        players:[req.user._id]
    });
    try{
        await room.save();
        res.status(201).json({message:"room created successfully",room});
    }
    catch(error)
    {
        if (error.code === 11000 && error.message.includes("owner_1_roomName_1")) {
            // This means the same user is trying to reuse roomName
            return res.status(400).json({
              message: "You have already created a room with this name. Please choose a different name."
            });
          }
          res.status(500).json({message:"Internal server error"});
    }
}
export const joinRoom=async(req,res)=>{
    const {roomId,roompassword}=req.body;
    try{
        const room=await roomModel.findOne({roomId});
        if(!room)
        {
            return res.status(404).json({message:"Room not found"});
        }
        const isPasswordValid=await room.isValidPassword(roompassword);
        if(!isPasswordValid)
        {
            return res.status(401).json({message:"Invalid password"});
        }
        if(room.players.includes(req.user._id))
        {
            return res.status(400).json({message:"You are already in this room"});
        }
        room.players.push(req.user._id);
        await room.save();
        res.status(200).json({message:"Joined room successfully",room});
    }
    catch(error)
    {
        res.status(500).json({message:"Internal server error"});
    }
}