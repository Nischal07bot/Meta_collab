import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
   const url="http://localhost:3000";
  const handleLogin = () => {
    axios.post(`${url}/users/login`,{email:username,password:password}).then((res)=>{
      if(res.status===201)
      {
        console.log(res.data);
        localStorage.setItem("token",res.data.token);
        navigate("/roomcr");
      }
    })
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-indigo-950 to-blue-750">
  <div className="flex flex-col items-center gap-4 justify-center bg-indigo-950 rounded-2xl shadow-2xl p-8 max-w-md w-full min-h-[24rem] ">
    <div className="flex flex-row items-center justify-center gap-4">
        <img src="/avatar_29_dancing.png" alt="avatar" className="w-10 h-15" />
        <img src="/avatar_32_dancing.png" alt="avatar" className="w-10 h-15" />
        <img src="/avatar_68_dancing.png" alt="avatar" className="w-10 h-15" />
    </div>
    <h1 className="text-4xl font-bold text-white">Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-60 h-10 px-8 py-2  mt-4 p-2 gap-8 rounded-lg text-white bg-blue-900 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-60 h-10 px-8 py-2 mt-4 p-2 gap-8 rounded-lg text-white bg-blue-900 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleLogin}
        className="w-30 h-10 px-8 py-2 mt-4 gap-8 bg-green-300 hover:bg-green-700 text-blue-700 rounded-lg font-semibold transition"
      >
        Login
      </button>
      <p className="text-white">Dont have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
  </div>
</div>

  );
}
