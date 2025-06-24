import React, { useState, useEffect, useRef } from "react";

const MAP_WIDTH = 15;   
const MAP_HEIGHT = 10;  
const TILE_SIZE = 48;   
export default function Map() {
  const [pos, setPos] = useState({ x: 2, y: 2 });
  const mapRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPos((prev) => {
        let { x, y } = prev;
        if (e.key === "ArrowUp" || e.key === "w") y = Math.max(0, y - 1);
        if (e.key === "ArrowDown" || e.key === "s") y = Math.min(MAP_HEIGHT - 1, y + 1);
        if (e.key === "ArrowLeft" || e.key === "a") x = Math.max(0, x - 1);
        if (e.key === "ArrowRight" || e.key === "d") x = Math.min(MAP_WIDTH - 1, x + 1);
        return { x, y };
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const tiles = [];
  for (let row = 0; row < MAP_HEIGHT; row++) {
    for (let col = 0; col < MAP_WIDTH; col++) {
      tiles.push(
        <div
          key={`${row}-${col}`}
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE,
            border: "1px solid #ccc",
            boxSizing: "border-box",
            background: row === pos.y && col === pos.x ? "#4ade80" : "#f1f5f9",
            transition: "background 0.1s"
          }}
        />
      );
    }
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: MAP_WIDTH * TILE_SIZE,
        height: MAP_HEIGHT * TILE_SIZE,
        display: "grid",
        gridTemplateColumns: `repeat(${MAP_WIDTH}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${MAP_HEIGHT}, ${TILE_SIZE}px)`,
        margin: "40px auto",
        background: "#e0e7ef",
        borderRadius: 12,
        boxShadow: "0 4px 24px #0001"
      }}
      tabIndex={0}
    >
      {tiles}
    </div>
  );
}
