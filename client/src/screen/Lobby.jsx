import React, { useState,useEffect } from "react";
//here we will show the list of the players in this room 
import { useNavigate } from "react-router-dom";

export default function playerlist(){
    const [players,setplayers]=useState([]);
    const navigate=useNavigate();
    //testing
    useEffect(()=>{
        setplayers([{name:"John"},{name:"Jane"},{name:"Jim"},{name:"Jill"}]);
    },[])
    const handlejoinmap=()=>{
        console.log("join map");
        navigate("/game");
    }
return(
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-indigo-950 to-blue-750">
        <div className="flex flex-col items-center gap-4 mr-10 ml-10 justify-center bg-indigo-950 rounded-2xl shadow-2xl p-8 max-w-md w-full min-h-[24rem] ">
            <h1 className="text-4xl font-bold text-white">TEAM MEMBERS</h1>
            {players.map((player,idx)=>{
                return(
                    <div key={idx} className="w-30 h-10 bg-green-300 rounded-lg  hover:bg-green-700 font-semibold transition flex items-center justify-center">
                        <h1 className="text-2xl font-semibold text-blue-700">{player.name}</h1>
                    </div>
                )
            })}
        </div>
        <button
        onClick={handlejoinmap}
        className="w-30 h-10 bg-green-300 rounded-lg  hover:bg-green-700 font-semibold transition flex items-center justify-center">
            <h1 className="text-2xl font-semibold text-blue-700">Join Map</h1>
        </button>
    </div>
);
}