import express from "express";
import http from "http";
import {Server} from "socket.io";
import {createServer} from "http";
import dotenv from "dotenv";
dotenv.config();
const app=express();
app.use(express.json());
const server=createServer(app);
const io=new Server(server);

const players=[];
 

io.on("connection",(socket)=>{
    console.log("a user connected");
    socket.on("disconnect",()=>{
        console.log("a user disconnected");
    })
});
const PORT=process.env.PORT || 3000;

server.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})

