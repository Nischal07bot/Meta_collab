import { createContext, useContext, useState } from "react";

const userContext=createContext();
const UserProvider=({children})=>{
    const [user,setuser]=useState(null);
    return(
        <userContext.Provider value={{user,setuser}}>
            {children}
        </userContext.Provider>
    )
}

const useUser=()=>{
    return useContext(userContext);
}

export {UserProvider,useUser};