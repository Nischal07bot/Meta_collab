// LandingPage.jsx
import React from "react";
import demo from "../assets/demo.mp4"
import Character from "./Character.jsx";
import Navbar from "./Navbar.jsx"

const LandingPage = () => {
  return (
    <div className="relative min-h-screen  no-scrollbar">
      <Navbar />
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-indigo-950 to-blue-750">
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
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="mr-4">
              <img
                src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/6406427fd35e3db12a52cfc4_Star%204.svg"
                loading="lazy"
                alt=""
                className="w-5 h-5"
              />
            </div>
            <div>
              <img
                src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640642fa7d41d60cbce94fe0_Star%207.svg"
                loading="lazy"
                alt=""
                className="w-5 h-5"
              />
            </div>
          </div>
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
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col h-full items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Virtual HQ
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Bring your remote team together
          </p>
          <button className="bg-green-300 text-blue-700 px-8 py-3 w-30 h-8 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Get Started
          </button>
          <div className="mt-8">
            <Character />
          </div>
        </div>
        
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-96 h-64 rounded-lg overflow-hidden shadow-2xl">
            <video
              src={demo}
              autoPlay
              loop
              muted
              playsInline
              poster="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/645bf7b13ac3a54d23fb33ad_Screenshot%202023-05-10%20125910.jpg"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Second section */}
    </div>
  );
};

export default LandingPage;