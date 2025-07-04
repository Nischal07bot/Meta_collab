import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./Routes/userRoutes.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
dotenv.config();
const app=express();
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/users",userRoutes);

export default app;