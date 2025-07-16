import React, { useEffect, useRef } from 'react'
import useState from 'react'
import kaboom from "kaboom"
import { scaleFactor } from "../scalefactor.js"
import {io} from "socket.io-client"
import {useSocket} from "../Context/Socketprovide.jsx"
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
    useEffect(() => {
       const socket=useSocket();
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
        socket.on("otherplayers",(data)=>{
                for(const id in data)
                {
                    if (Object.prototype.hasOwnProperty.call(data, id))
                    {
                        if(id===socket.id) continue;
                        spawnplayer(id,data[id]);
                    }
                }
        })
        socket.on("currentplayer",(data)=>{
            spawnplayer(data.id,data.state);
        })
        socket.on("playermove",(data)=>{
            const playermov=others[data.id];
            if(playermov)
            {
                playermov.pos=k.vec2(data.state.x,data.state.y);
                playermov.play("walk-"+data.dir+"-6");
                playermov.direction=data.dir;
            }
            others[data.id]=playermov;
        })
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
                        socket.emit("move",{x:player.pos.x,y:player.pos.y,avataridx:avataridx,direction:player.direction});
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
            socket.disconnect();
            Object.values(others).forEach(o => o.destroy());
        };
    }, []);
    
    return (
        <div className="flex justify-center items-center h-screen w-screen bg-violet-950 w-full h-full">
            <canvas ref={canvasRef} id="game-canvas"></canvas>
        </div>
    );
}