import { createContext, useContext, useState } from "react";

const roomContext=createContext();

const RoomProvider=({children})=>{
    const [roomid,setroomid]=useState(null);
    return(
        <roomContext.Provider value={{roomid,setroomid}}>
            {children}
        </roomContext.Provider>
    )
}
    
const useRoom=()=>{
    return useContext(roomContext);
}

export {RoomProvider,useRoom};