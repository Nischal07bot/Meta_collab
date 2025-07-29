import React, { createContext, useContext, useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error("SocketContext is not available");
    }
    return socket;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        // Avoid duplicate connections
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:3000", {
                transports: ["websocket"],
            });
            setSocket(socketRef.current);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
