import React, { useEffect, useRef, useState } from 'react'
import {useSocket} from "../Context/Socketprovide.jsx"
import kaboom from "kaboom"
import { scaleFactor } from "../scalefactor.js"
import {io} from "socket.io-client"
import {useContext} from "react"
import {useRoom} from "../Context/roomContext.jsx"
import VideoConference from './VideoConference.jsx'

function setupsprite(startidx)
{
    return {
        "idle-down":startidx,
        "walk-down":{from:startidx,to:startidx+3,loop:true,speed:8},
        "idle-side":startidx+39,
        "walk-side":{from:startidx+39,to:startidx+42,loop:true,speed:8},
        "idle-up":startidx+2*39,
        "walk-up":{from:startidx+2*39,to:startidx+2*39+3,loop:true,speed:8},
    };
}


let arr = [936, 940, 944, 948, 952, 956, 960, 964];


export default function GamePage() {
    const canvasRef = useRef(null);
    const avatar = useRef(null);
    let avataridx=0;
    const {roomid}=useRoom();
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [isInCall, setIsInCall] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = io("http://localhost:3000");
        
        // Add callback function to joinroom event
        socketInstance.emit("joinroom", roomid, (response) => {
            console.log("Joined room response:", response);
        });
        
        setSocket(socketInstance);

        // Add global callStarted listener for debugging
        socketInstance.on("callStarted", (data) => {
            console.log("GLOBAL CALL STARTED RECEIVED:", data);
            alert(`Call started by ${data.startedBy}! You should join automatically.`);
            
            setIsInCall(true);
            setShowVideoCall(true);
            
            // Automatically join the call for all participants
            socketInstance.emit("joinCall", (response) => {
                if (response.success) {
                    console.log("Automatically joined call:", response);
                } else {
                    console.error("Failed to join call:", response.error);
                }
            });
        });

        // Video call event listeners
        socketInstance.on("callEnded", (data) => {
            console.log("Call ended:", data);
            setIsInCall(false);
            setShowVideoCall(false);
        });
        socketInstance.on("playerdisconnect",(data)=>{
            console.log("Player disconnected:", data);
            setIsInCall(false);
            setShowVideoCall(false);
            Object.values(others).forEach(o => o.destroy());
        });

        let k;
        let animss = {};
        let others={};
        for (let i = 0; i < arr.length; i++) {
            let anims = setupsprite(arr[i]);
            for (let key in anims) {
                animss[`${key}-${i}`] = anims[key];
            }
        }

        if (canvasRef.current) {
            k = kaboom({
                global: false,
                width: window.innerWidth,
                height: window.innerHeight,
                canvas: canvasRef.current,
                background: [49, 16, 79],
                scale: 1,
            });
            k.loadSprite("spritesheet", "/spritesheet.png", {
                sliceX: 39,
                sliceY: 31,
                anims: animss,
            });
            k.loadSprite("map", "/map.png");

            k.scene("main", async () => {
                const mapdata = await (await fetch("/mapp.json")).json();
                const layers = mapdata.layers;
                const mid=k.width()/2;
                const value=mid/2;
                const map = k.add([
                    k.sprite("map"),
                    k.pos(value,0),
                    k.scale(2),
                ])
                /*
                setcamscale(k);
                k.onResize(() => {
                    setcamscale(k);
                });*/
                const player=k.make([
                    k.sprite("spritesheet",{anim:"idle-down-6"}),
                    k.area({
                        shape:new k.Rect(k.vec2(0,3),10,10),
                    }),
                    k.body(),
                    k.anchor("center"),
                    k.pos(),
                    k.scale(3),
                     {
                        speed:150,
                        direction:"down",
                     }
                ])



        ////socket logic ,.....
        socketInstance.on("otherplayers",(data)=>{
                for(const id in data)
                {
                    if (Object.prototype.hasOwnProperty.call(data, id))
                    {
                        if(id===socketInstance.id) continue;
                        spawnplayer(id,data[id]);
                    }
                }
        })
        socketInstance.on("currentplayer",(data)=>{
            spawnplayer(data.id,data.state);
        })
        socketInstance.on("playermove",(data)=>{
            const playermov=others[data.id];
            if(playermov)
            {
                playermov.pos=k.vec2(data.state.x,data.state.y);
                playermov.play("walk-"+data.dir+"-6");
                playermov.direction=data.dir;
            }
            others[data.id]=playermov;
        })
        socketInstance.on('roomJoined', (data) => {
            console.log(`Joined room ${data.roomId} as ${data.username}`);
            // Initialize media streams and UI updates here
          });

        // Video call event listeners
        socketInstance.on("callStarted", (data) => {
            console.log("Call started:", data);
            setIsInCall(true);
            setShowVideoCall(true);
            
            // Automatically join the call for all participants
            socketInstance.emit("joinCall", (response) => {
                if (response.success) {
                    console.log("Automatically joined call:", response);
                    // The VideoConference component will handle the rest
                } else {
                    console.error("Failed to join call:", response.error);
                }
            });
        });

        socketInstance.on("callEnded", (data) => {
            console.log("Call ended:", data);
            setIsInCall(false);
            setShowVideoCall(false);
        });
        socketInstance.on("playerdisconnect",(data)=>{
            console.log("Player disconnected:", data);
            setIsInCall(false);
            setShowVideoCall(false);
            Object.values(others).forEach(o => o.destroy());
        });
        //////socket logic ends here 

        function spawnplayer(id,state)
        {
            const player=k.add([
                k.sprite("spritesheet",{anim:"idle-down-6"}),
                k.area({
                    shape:new k.Rect(k.vec2(0,3),10,10),
                }),
                k.body(),
                k.anchor("center"),
                k.pos(map.pos.x+state.x,map.pos.y+state.y),
                k.scale(3),
                 {
                    speed:150,
                    direction:"down",
                 }
            ]);
            others[id]=player;
        }
                for(const layer of layers){
                    if(layer.name === "boundaries"){
                        for(const boundary of layer.objects){
                            map.add([
                                k.area({
                                    shape: new k.Rect(k.vec2(0),boundary.width,boundary.height),
                                }),
                                k.body({isStatic:true}),
                                k.pos(boundary.x,boundary.y),
                                boundary.name,
                            ]);
            
                            console.log(boundary.name);
            
                        }
                        continue;
                    }
                    if(layer.name==="spawnpoint")
                    {
                        for(const entity of layer.objects)
                        {
                            //only one entity here but there can be many 
                            if(entity.name === "player")
                            {
                                console.log(entity.name);
                                player.pos=k.vec2((map.pos.x+entity.x)*1,
                                (map.pos.y+entity.y)*1);
                                k.add(player);
                            }
                        }
                    }
                }
                k.onUpdate(()=>{
                    let dx=0;
                    let dy=0;
                    if(k.isKeyDown("a"))
                    {
                        dx=-player.speed;
                        player.flipX=true;
                        player.play("walk-side-6");
                        player.direction="side";
                    }
                    if(k.isKeyDown("d"))
                    {
                        dx=player.speed;
                        player.flipX=false;
                        player.play("walk-side-6");
                        player.direction="side";
                    }
                    if(k.isKeyDown("w"))
                    {
                        dy=-player.speed;
                        player.play("walk-up-6");
                        player.direction="up";
                    }
                    if(k.isKeyDown("s"))
                    {
                        dy=player.speed;
                        player.play("walk-down-6");
                        player.direction="down";
                    }
                    
                    if (dx !== 0 || dy !== 0) {
                        player.move(dx , dy);
                        socketInstance.emit("move",{x:player.pos.x,y:player.pos.y,avataridx:avataridx,direction:player.direction});
                    }
                        else
                    {
                        player.play("walk-"+player.direction+"-6");
                    }
                })
            });
            k.go("main");
        }
        // Cleanup on unmount
        return () => {
            if (k) k.destroyAll();
            socketInstance.disconnect();
            Object.values(others).forEach(o => o.destroy());
        };
    }, [roomid]);

    const handleStartCall = () => {
        if (socket) {
            socket.emit("startCall", (response) => {
                if (response.success) {
                    console.log("Call started successfully");
                    setIsInCall(true);
                    setShowVideoCall(true);
                } else {
                    console.error("Failed to start call:", response.error);
                    alert("Failed to start video call");
                }
            });
        }
    };

    const handleCloseVideoCall = () => {
        setShowVideoCall(false);
        setIsInCall(false);
    };
    
    return (
        <div className="relative flex justify-center items-center h-screen w-screen bg-violet-950">
            <canvas ref={canvasRef} id="game-canvas" className="absolute inset-0"></canvas>
            
            {/* Call Button */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={handleStartCall}
                    disabled={isInCall}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        isInCall 
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                >
                    {isInCall ? 'In Call' : '📞 Start Call'}
                </button>
            </div>

            {/* Video Conference Modal */}
            <VideoConference
                isOpen={showVideoCall}
                onClose={handleCloseVideoCall}
                socket={socket}
            />
        </div>
    );
}