// Yeh spinning loader tab dikhta hai jab kisi lazy route ka JS chunk download ho raha hota hai.
// Tailwind CSS se banaya gaya — koi external dependency nahi.
import React from "react";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="flex flex-col items-center gap-5">
        {/* Outer ring */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-white/5" />
          <div className="absolute inset-0 rounded-full border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-gray-600 text-xs font-medium tracking-[0.3em] uppercase">Loading</p>
      </div>
    </div>
  );
}
