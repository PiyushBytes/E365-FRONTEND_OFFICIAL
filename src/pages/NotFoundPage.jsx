// 404 Not Found page — koi bhi unknown URL is page par aayega
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white gap-6 px-4 text-center">
      <p className="text-8xl font-black text-white/5 select-none">404</p>
      <div className="-mt-4">
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-500 text-sm max-w-sm">
          The page you are looking for does not exist or you do not have permission to view it.
        </p>
      </div>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2.5 bg-red-600 hover:bg-red-500 rounded-full text-sm font-bold transition-colors"
      >
        Go Home
      </button>
    </div>
  );
}
