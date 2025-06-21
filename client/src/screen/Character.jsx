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

  useEffect(() => {
    const directions = ["down", "left", "right", "up"];
    let currentDirectionIndex = 0;

    const animate = () => {
      currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;
      setDirection(directions[currentDirectionIndex]);
    };

    const interval = setInterval(animate, 100); // Change direction every 300ms

    return () => clearInterval(interval);
  }, []);

  const frameWidth = SPRITE_SIZE * 4; // Enlarged character
  const frameHeight = SPRITE_SIZE * 4;
  const frameColumn = 1; // Use the second column for animation

  return (
    <div
      className="relative mx-auto"
      style={{
        width: frameWidth,
        height: frameHeight,
        backgroundImage: `url(${character})`,
        backgroundSize: `${frameWidth * 4}px ${frameHeight * 4}px`,
        backgroundPosition: `-${frameWidth * frameColumn}px -${
          frameHeight * directionMap[direction]
        }px`,
        imageRendering: "pixelated",
      }}
    />
  );
};

export default Character;
