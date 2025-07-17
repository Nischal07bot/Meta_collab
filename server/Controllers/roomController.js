import roomModel from "../Model/roomModel.js"
import {v4 as uuidv4} from "uuid";

export const createRoom = async (req, res) => {
    const { roomName, roomPassword } = req.body;
    console.log(roomName,roomPassword);
    if (!roomName || !roomPassword) {
        return res.status(400).json({ 
            message: "Room name and password are required" 
        });
    }
    try {
        const hashedPassword = await roomModel.hashPassword(roomPassword);
        const room = new roomModel({
            roomName,
            roomPassword: hashedPassword,
            roomId: roomName.toString().toLowerCase()+req.user.email.toString().toLowerCase(),
            owner: req.user.id,
            players: [req.user.id]
        });
        
        await room.save();
        res.status(201).json({ message: "room created successfully", room });
    } catch (error) {
        if (error.code === 11000 && error.message.includes("owner_1_roomName_1")) {
            return res.status(400).json({
                message: "You have already created a room with this name. Please choose a different name."
            });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}
export const joinRoom=async(req,res)=>{
    const {roomId,roomPasswordjoin}=req.body;
    console.log(req.body);
    try{
        const room=await roomModel.findOne({roomId});
        if(!room)
        {
            return res.status(404).json({message:"Room not found"});
        }
        const isPasswordValid=await room.isValidPassword(roomPasswordjoin);
        if(!isPasswordValid)
        {
            return res.status(401).json({message:"Invalid password"});
        }
        if(room.players.map(id=>id.toString()).includes(req.user.id.toString()))
        {
            return res.status(200).json({message:"You are already in this room",room});
        }
        room.players.push(req.user.id);
        await room.save();
        res.status(200).json({message:"Joined room successfully",room});
    }
    catch(error)
    {
        res.status(500).json({message:"Internal server error"});
    }
}
export const getPlayers=async(req,res)=>{
    const {roomId}=req.query;
    try{
        const room=await roomModel.findOne({roomId}).populate("players","email");
        if(!room)
        {
            return res.status(404).json({message:"Room not found"});
        }
        res.status(200).json({message:"Players fetched successfully",players:room.players});
    }
    catch(error)
    {
        res.status(500).json({message:"Can't fetch players"});
    }
}