import React, { createContext, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error("Socket not found. Wrap your app in <SocketProvider>");
    }
    return socket;
};

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    if (!socketRef.current) {
        // Use environment variable or fallback to localhost for development
        const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
        socketRef.current = io(serverUrl, {
            transports: ["websocket", "polling"], // Allow fallback to polling
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
    }

    useEffect(() => {
        const socket = socketRef.current;
        
        socket.on('connect', () => {
            console.log('Connected to server');
        });
        
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
        
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
};
