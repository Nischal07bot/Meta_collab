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
        socketRef.current = io("http://localhost:3000", {
            transports: ["websocket"],
        });
    }

    useEffect(() => {
       
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
