import React, { useEffect,useState } from "react" 
import { useSocket } from "../Context/Socketprovide"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRoom } from "../Context/roomContext";
export default function roomcr() {
    const socket=useSocket();
    const navigate=useNavigate();
    const {roomid,setroomid}=useRoom();
    const link="http://localhost:3000";
    const [roomPassword, setroomPassword] = useState("");
    const [roomPasswordjoin,setroomPasswordjoin]=useState("");
    const [roomId,setroomId]=useState("");
    const [roomName,setroomName]=useState("");
    const handleCreateRoom=async ()=>{
        const token = localStorage.getItem("token");
        if (!token) { alert("Not logged in"); return; }
        await axios.post(`${link}/room/create`,{roomName:roomName,roomPassword:roomPassword},{headers:{Authorization:`Bearer ${token}`}}).then(res=>{
            console.log(res.data);
            const roomIdd=res.data.room.roomId;
            setroomid(roomIdd);
            navigate(`/lobby`);
        }).catch(err=>{
            alert(err.response.data.message);
        })
    }
    const handleJoinRoom=async ()=>{
        const token = localStorage.getItem("token");
        if (!token) { alert("Not logged in"); return; }
       await axios.post(`${link}/room/joinroom`,{roomId:roomId,roomPasswordjoin:roomPasswordjoin},{headers:{Authorization:`Bearer ${token}`}}).then(res=>{
        console.log(res.data);
        const roomIdd=res.data.room.roomId;
        setroomid(roomIdd);
        navigate(`/lobby`);
       }).catch(err=>{
        alert(err.response.data.message);
       })
    }
    return (
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
      <div className="relative z-10 flex flex-col items-center justify-center h-screen bg-gradient-to-b from-indigo-950 to-blue-750 gap-4">
            <h1 className="text-4xl font-bold text-white">Welcome back User</h1>
            <div className="flex flex-row items-center justify-center gap-4 w-full">
            <div className="flex flex-col items-center gap-4 ml-10 mr-10 justify-center bg-indigo-950 rounded-2xl shadow-2xl p-8 max-w-md w-full min-h-[24rem] ">
          <div className="flex flex-row items-center justify-center gap-4">
              <img src="/avatar_29_dancing.png" alt="avatar" className="w-10 h-15" />
              <img src="/avatar_32_dancing.png" alt="avatar" className="w-10 h-15" />
              <img src="/avatar_68_dancing.png" alt="avatar" className="w-10 h-15" />
          </div>
          <h1 className="text-4xl font-bold text-white">Create Room</h1>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setroomName(e.target.value)}
              className="w-60 h-10 px-8 py-2  mt-4 p-2 gap-8 rounded-lg text-white bg-blue-900 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Room Password"
              value={roomPassword}
              onChange={(e) => setroomPassword(e.target.value)}
              className="w-60 h-10 px-8 py-2 mt-4 p-2 gap-8 rounded-lg text-white bg-blue-900 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateRoom}
              className="w-30 h-10 px-8 py-2 mt-4 gap-8 bg-green-300 hover:bg-green-700 text-blue-700 rounded-lg font-semibold transition"
            >
              Create Room
            </button>
             
        </div>
        <div className="flex flex-col items-center gap-4 mr-10 ml-10 justify-center bg-indigo-950 rounded-2xl shadow-2xl p-8 max-w-md w-full min-h-[24rem] ">
          <div className="flex flex-row items-center justify-center gap-4">
              <img src="/avatar_29_dancing.png" alt="avatar" className="w-10 h-15" />
              <img src="/avatar_32_dancing.png" alt="avatar" className="w-10 h-15" />
              <img src="/avatar_68_dancing.png" alt="avatar" className="w-10 h-15" />
          </div>
          <h1 className="text-4xl font-bold text-white">Join Room</h1>
            <input
              type="text"
              placeholder="Room Id"
              value={roomId}
              onChange={(e) => setroomId(e.target.value)}
              className="w-60 h-10 px-8 py-2  mt-4 p-2 gap-8 rounded-lg text-white bg-blue-900 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Room Password"
              value={roomPasswordjoin}
              onChange={(e) => setroomPasswordjoin(e.target.value)}
              className="w-60 h-10 px-8 py-2 mt-4 p-2 gap-8 rounded-lg text-white bg-blue-900 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleJoinRoom}
              className="w-30 h-10 px-8 py-2 mt-4 gap-8 bg-green-300 hover:bg-green-700 text-blue-700 rounded-lg font-semibold transition"
            >
              Join Room
            </button>
        </div>
        </div>
      </div>
      </div>
        
    )
}
