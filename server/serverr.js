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

const players={};
io.on("connection",(socket)=>{
    console.log("a user connected",socket.id); 
    players[socket.id]={x:0,y:0,avataridx:0};
    socket.emit("currentplayers",players);
    socket.broadcast.emit("currentplayer",{id:socket.id, state:players[socket.id] });
    socket.on("move",(data)=>{
        players[socket.id].x=data.x;
        players[socket.id].y=data.y;
        players[socket.id].avataridx=data.avataridx;
        socket.broadcast.emit("playermove",{id:socket.id,state:players[socket.id]});
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

