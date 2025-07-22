import React, { useState,useEffect } from "react";
//here we will show the list of the players in this room 
import { useNavigate } from "react-router-dom";
import { useRoom } from "../Context/roomContext";
import axios from "axios";
export default function playerlist(){
    const [players,setplayers]=useState([]);
    const navigate=useNavigate();
    const {roomid}=useRoom();
    //testing
    const link="http://localhost:3000";
    useEffect(()=>{
        const token = localStorage.getItem("token");
        if (!token) { alert("Not logged in"); return; }
        axios.get(`${link}/room/getplayers`,{
            headers:{
                Authorization:`Bearer ${token}`
            },
            params:{
                roomId:roomid
            }       
        }).then(res=>{
            console.log(res.data);
            setplayers(res.data.players);
        }).catch(err=>{
            alert(err.response.data.message);
        })
    },[roomid])
    const handlejoinmap=()=>{
        console.log("join map");
        navigate("/game");
    }
return(
    <div className="relative min-h-screen  no-scrollbar">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-indigo-950 to-blue-750  pointer-events-none">
        {/* Starry background wrapper */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Star 6 */}
          <div className="absolute top-8 left-6 opacity-80">
            <img
              src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640642d487bb294c34df2050_Star%206.svg"
              loading="lazy"
              alt=""
              className="w-8 h-8"
            />
          </div>

          {/* Star 5 */}
          <div className="absolute top-32 right-8 opacity-70">
            <img
              src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640642962d6a7b0b4d469a27_Star%205.svg"
              loading="lazy"
              alt=""
              className="w-6 h-6"
            />
          </div>

          {/* Star 8 */}
          <div className="absolute bottom-24 left-1/4 opacity-60">
            <img
              src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640643218def2ffb98cefcee_Star%208.svg"
              loading="lazy"
              alt=""
              className="w-10 h-10"
            />
          </div>

          {/* Star 9 */}
          <div className="absolute bottom-16 right-1/3 opacity-75">
            <img
              src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640644b54c044561733508ca_Star%209.svg"
              loading="lazy"
              alt=""
              className="w-7 h-7"
            />
          </div>

          {/* Center stars (4 & 7) */}
          <div className="absolute bottom-30 left-1/2 opacity-60">
          <img 
           src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640644b54c044561733508ca_Star%209.svg"
           loading="lazy"
           alt=""
           className="w-10 h-10"
           />
          </div>
          <div className="absolute top-30 left-1/3 opacity-60">
          <img 
           src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640644b54c044561733508ca_Star%209.svg"
           loading="lazy"
           alt=""
           className="w-10 h-10"
           />
          </div>
          <div className="absolute top-100 left-50 opacity-60">
          <img 
           src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640644b54c044561733508ca_Star%209.svg"
           loading="lazy"
           alt=""
           className="w-10 h-10"
           />
          </div>
          <div className="absolute top-100 right-50 opacity-60">
          <img 
           src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640644b54c044561733508ca_Star%209.svg"
           loading="lazy"
           alt=""
           className="w-10 h-10"
           />
          </div>
        </div>
      </div>
    <div className="relative z-10 flex flex-col items-center justify-center h-screen bg-gradient-to-b from-indigo-950 to-blue-750">
        <div className="flex flex-col items-center gap-4 mr-10 ml-10 justify-center bg-indigo-950 rounded-2xl shadow-2xl p-8 max-w-md w-full min-h-[24rem] ">
            <h1 className="text-4xl font-bold text-white">TEAM MEMBERS</h1>
            {players.map((player,idx)=>{
                return(
                    <div
                    key={idx}
                    className="max-w-[8rem] px-2 py-1 bg-green-300 rounded-lg hover:bg-green-700 font-semibold transition flex items-center justify-center overflow-hidden"
                  >
                    <h1 className="text-sm font-semibold text-blue-700 truncate text-center">
                      {player.email}
                    </h1>
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
    </div>
    
);
}