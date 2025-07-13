import React, { createContext, useContext, useRef, useEffect } from "react"
import { io } from "socket.io-client"
const SocketContext = createContext(null);
export const useSocket=()=>{
    const socket=useContext(SocketContext);
    if(!socket){
        throw new Error("SocketContext is not available");
    }
    return socket; 
}
export const SocketProvider=({children})=>{
    const socket=useRef(null);
    if(!socket.current)
    {
        socket.current=io("http://localhost:3000");
    }
    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}