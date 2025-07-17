import mongoose from "mongoose"
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
const roomSchema=new mongoose.Schema({
    roomName:{
        type:String,
        required:true,
    },
    roomPassword:{
        type:String,
        required:true,
    },
    roomId:{
        type:String,
        required:true,
        unique:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    players:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }]
});
roomSchema.index({owner:1,roomName:1},{unique:true});
roomSchema.statics.hashPassword=async function(password)
{
    return await bcrypt.hash(password,5);

}
roomSchema.methods.isValidPassword=async function(password)
{
    return await bcrypt.compare(password,this.roomPassword);
}

const roomModel=mongoose.model("Room",roomSchema);
export default roomModel;