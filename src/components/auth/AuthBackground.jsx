import React from "react";
import VideoBackground from "../common/VideoBackground";

export default function AuthBackground({ children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black font-sans">
      <VideoBackground />
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-600/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      {children}
    </div>
  );
}
