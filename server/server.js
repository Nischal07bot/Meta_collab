import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

const app=express();
dotenv.config();
app.use(cors());
app.use(express.json());
const PORT=process.env.PORT || 3000
const MONGO_URI=process.env.MONGO_URI
mongoose.connect(MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
})

//useNewUrlParser:true, Why? The old parser had some issues with certain connection strings, especially when using special characters, IPv6, or DNS SRV records.
//useUnifiedTopology:true,Why? Provides better handling of replica sets, sharded clusters, etc., and fixes several deprecation warnings.
app.get("/",(req,res)=>{
    console.log("Hello World to my metaverse app");
    res.send("Hello World to my metaverse app");
})
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})