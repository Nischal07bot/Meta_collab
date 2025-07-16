import express from "express";
import http from "http";
import {Server} from "socket.io";
import {createServer} from "http";
import dotenv from "dotenv";
import cors from "cors";
import app from "./app.js"
import mediasoup from "mediasoup";
dotenv.config();
import {createWorker,worker,router} from "./mediasoup-config.js";
const server=createServer(app);
const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173", "http://localhost:5174"], // allow both
        methods:["GET","POST","PUT","DELETE"],
        credentials:true,
    },
});

(async()=>{
    createWorker();
})();

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

    socket.on("joinroom",async (roomid,callback)=>{
        console.log("Client joined room",roomid);
        const transport=await createWebRtcTransport(router);
        callback({ transportOptions: transport });

    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
      });



    socket.on("disconnect",()=>{
        console.log("a user disconnected",socket.id);
        delete players[socket.id];
        io.emit("playerdisconnect",socket.id);
    })
});

const createWebRtcTransport = async (router) => {
    const transport = await router.createWebRtcTransport({
        listenIps: [{ ip: '0.0.0.0', announcedIp: '192.168.1.100'}],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    transport.on('dtlsstatechange', dtlsState => {
      if (dtlsState === 'closed') {
        transport.close();
      }
    });

    transport.on('close', () => {
      console.log('Transport closed');
    });

    return transport;
  };


const PORT=process.env.PORT || 3000;

server.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})