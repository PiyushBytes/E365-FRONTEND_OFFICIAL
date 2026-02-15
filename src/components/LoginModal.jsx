import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    if (setIsOpen) {
      setIsOpen(false); // close modal if function provided
    }
  };

  return (
    <div
      className={`absolute top-full right-0 mt-2 w-44 transition-all duration-200 ease-out ${
        isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="bg-black/90 backdrop-blur-xl border border-red-500/20 rounded-lg shadow-lg p-2 flex flex-col gap-1">
        
        <button
          onClick={() => handleNavigate("/client")}
          className="text-white text-sm py-2 rounded-md hover:bg-red-600 transition"
        >
          Login as Client
        </button>

        <button
          onClick={() => handleNavigate("/artist")}
          className="text-white text-sm py-2 rounded-md hover:bg-red-600 transition"
        >
          Login as Artist
        </button>

        <button
          onClick={() => handleNavigate("/admin")}
          className="text-white text-sm py-2 rounded-md hover:bg-red-600 transition"
        >
          Admin Login
        </button>

      </div>
    </div>
  );
}
