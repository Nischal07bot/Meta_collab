import React, { useEffect, useState } from "react";
import character from "../assets/Character_009.png"

const SPRITE_SIZE = 32;

const directionMap = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};
const Character = () => {
  const [direction, setDirection] = useState("down");
  const [row,setrow]=useState(0);
  const [col,setcol]=useState(0);

  useEffect(() => {
   
    const animate = () => {
      setrow((currentrow)=>(currentrow+1)%4);
      setcol((currentcol)=>(currentcol+1)%4);
    };

    const interval = setInterval(animate, 150); // Change direction every 300ms

    return () => clearInterval(interval);
  }, []);

  const frameWidth = SPRITE_SIZE * 3; // Enlarged character
  const frameHeight = SPRITE_SIZE * 3;
  //const frameColumn = 1; // Use the second column for animation

  return (
    <div
      className="relative mx-auto"
      style={{
        width: frameWidth,
        height: frameHeight,
        backgroundImage: `url(${character})`,
        backgroundSize: `${frameWidth * 4}px ${frameHeight * 4}px`,
        backgroundPosition: `-${frameWidth * col}px -${
          frameHeight * row
        }px`,
        imageRendering: "pixelated",
        animation: "move 1s infinite",
      }}
    />
  );
};

export default Character;
