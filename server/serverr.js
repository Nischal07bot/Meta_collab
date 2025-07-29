import express from "express";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import {createWorker,worker,router} from "./mediasoup-config.js";
let mediasoupWorker = null;
let mediasoupRouter = null;
const initializeServer = async () => {
  try {
    // Initialize mediasoup
    await createWorker();
    mediasoupWorker = worker;
    mediasoupRouter = router;
    
    console.log("MediaSoup initialized successfully");
    
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

const rooms = {}; // roomId → { players: { socketId → state } }
const transports = new Map(); // Store transports
const producers = new Map(); // Store producers
const consumers = new Map(); // Store consumers

io.on("connection", (socket) => {
  socket.on("joinroom", async(roomId,callback) => {

    socket.join(roomId);
    if (mediasoupRouter) {
      const transport = await createWebRtcTransport(mediasoupRouter);
      if (callback && typeof callback === 'function') {
        callback({transportOptions:transport});
      } 
    } else {
      if (callback && typeof callback === 'function') {
        callback({transportOptions:null});
      }
    }
    if (!rooms[roomId]) rooms[roomId] = { players: {} };
    rooms[roomId].players[socket.id] = { x: 0, y: 0, avataridx: 0 };

    const roomPlayers = rooms[roomId].players;

    //the  video logic will start here 
    socket.to(roomId).emit("roomJoined", { roomId, username: socket.id });

    //the  video logic will end here 
    socket.emit("otherplayers", roomPlayers);
    socket.to(roomId).emit("currentplayer", {
      id: socket.id,
      state: roomPlayers[socket.id],
    });

    socket.on("move", (data) => {
      rooms[roomId].players[socket.id] = {
        x: data.x,
        y: data.y,
        avataridx: data.avataridx,
      };
      socket.to(roomId).emit("playermove", {
        id: socket.id,
        state: rooms[roomId].players[socket.id],
        dir: data.direction,
      });
    });

    // Video call functionality
    socket.on("startCall", async (callback) => {
      try {
        console.log(`Starting video call in room ${roomId}`);
        const roomPlayers = Object.keys(rooms[roomId].players);
        
        console.log(`Room players: ${roomPlayers}`);
        console.log(`Current socket: ${socket.id}`);
        
        // Notify OTHER players in the room about the call (not the one who started it)
        socket.to(roomId).emit("callStarted", { 
          roomId, 
          participants: roomPlayers,
          startedBy: socket.id
        });
        
        console.log(`Emitted callStarted to room ${roomId}`);
        
        callback({ success: true, roomId });
      } catch (error) {
        console.error("Error starting call:", error);
        callback({ success: false, error: error.message });
      }
    });

    socket.on("joinCall", async (callback) => {
      try {
        console.log(`Client ${socket.id} joining call in room ${roomId}`);
        
        // Create transport for this client
        const transport = await createWebRtcTransport(router);
        transports.set(socket.id, transport);

        callback({ 
          success: true, 
          transportOptions: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters
          },
          rtpCapabilities: router.rtpCapabilities
        });
      } catch (error) {
        console.error("Error joining call:", error);
        callback({ success: false, error: error.message });
      }
    });

    socket.on("connectTransport", async (transportId, dtlsParameters, callback) => {
      try {
        const transport = transports.get(socket.id);
        if (!transport) {
          return callback({ success: false, error: "Transport not found" });
        }

        await transport.connect({ dtlsParameters });
        callback({ success: true });
      } catch (error) {
        console.error("Error connecting transport:", error);
        callback({ success: false, error: error.message });
      }
    });

    socket.on("produce", async (transportId, kind, rtpParameters, callback) => {
      try {
        const transport = transports.get(socket.id);
        if (!transport) {
          return callback({ success: false, error: "Transport not found" });
        }

        const producer = await transport.produce({ kind, rtpParameters });
        producers.set(producer.id, { producer, socketId: socket.id });

        // Notify other participants in the room about new producer
        socket.to(roomId).emit("newProducer", { 
          producerId: producer.id, 
          kind: producer.kind,
          socketId: socket.id 
        });

        callback({ success: true, producerId: producer.id });
      } catch (error) {
        console.error("Error producing:", error);
        callback({ success: false, error: error.message });
      }
    });

    socket.on("consume", async (producerId, callback) => {
      try {
        const producerData = producers.get(producerId);
        if (!producerData) {
          return callback({ success: false, error: "Producer not found" });
        }

        const transport = transports.get(socket.id);
        if (!transport) {
          return callback({ success: false, error: "Transport not found" });
        }

        const consumer = await transport.consume({
          producerId: producerId,
          rtpCapabilities: router.rtpCapabilities,
          paused: false
        });

        consumers.set(consumer.id, { consumer, socketId: socket.id });

        callback({
          success: true,
          consumerId: consumer.id,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
          type: consumer.type,
          producerId: consumer.producerId
        });
      } catch (error) {
        console.error("Error consuming:", error);
        callback({ success: false, error: error.message });
      }
    });

    socket.on("resumeConsumer", async (consumerId, callback) => {
      try {
        const consumerData = consumers.get(consumerId);
        if (!consumerData) {
          return callback({ success: false, error: "Consumer not found" });
        }

        await consumerData.consumer.resume();
        callback({ success: true });
      } catch (error) {
        console.error("Error resuming consumer:", error);
        callback({ success: false, error: error.message });
      }
    });

    socket.on("endCall", () => {
      console.log(`Ending call in room ${roomId}`);
      io.to(roomId).emit("callEnded", { roomId });
    });

    socket.on("disconnect", () => {
      // Clean up video call resources
      const transport = transports.get(socket.id);
      if (transport) {
        transport.close();
        transports.delete(socket.id);
      }
      
      // Remove producers for this socket
      for (const [producerId, producerData] of producers.entries()) {
        if (producerData.socketId === socket.id) {
          producerData.producer.close();
          producers.delete(producerId);
        }
      }
      
      // Remove consumers for this socket
      for (const [consumerId, consumerData] of consumers.entries()) {
        if (consumerData.socketId === socket.id) {
          consumerData.consumer.close();
          consumers.delete(consumerId);
        }
      }

      delete rooms[roomId].players[socket.id];
      socket.to(roomId).emit("playerdisconnect", socket.id);
    });
  });
});

const createWebRtcTransport = async (router) => {
  const transport = await router.createWebRtcTransport({
    listenIps: [{ ip: '0.0.0.0', announcedIp: '192.168.1.100' }],
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
  }catch(error){
    console.log("failed to initialize server",error);
    process.exit(1);
  }
};
initializeServer();
