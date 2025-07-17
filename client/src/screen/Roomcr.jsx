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
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-indigo-950 to-blue-750 gap-4">
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
    )
}
