import express from "express";
import http from "http";
import {Server} from "socket.io";
import {createServer} from "http";
import dotenv from "dotenv";
import cors from "cors";
import app from "./app.js"
const server=createServer(app);
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST","PUT","DELETE"],
        credentials:true,
    },
});

const players={};
io.on("connection",(socket)=>{
    console.log("a user connected",socket.id); 
    players[socket.id]={x:0,y:0,avataridx:0};
    socket.emit("otherplayers",players);
    socket.broadcast.emit("currentplayer",{id:socket.id, state:players[socket.id] });
    socket.on("move",(data)=>{
        players[socket.id].x=data.x;
        players[socket.id].y=data.y;
        players[socket.id].avataridx=data.avataridx;
        let direction=data.direction;
        socket.broadcast.emit("playermove",{id:socket.id,state:players[socket.id],dir:direction});
    })
    socket.on("disconnect",()=>{
        console.log("a user disconnected",socket.id);
        delete players[socket.id];
        io.emit("playerdisconnect",socket.id);
    })
});
const PORT=process.env.PORT || 3000;

server.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})