import React from "react";

const VideoBackground = () => (
  <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover opacity-50"
    >
      <source src="/Logos/video1.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95" />
  </div>
);

export default VideoBackground;
