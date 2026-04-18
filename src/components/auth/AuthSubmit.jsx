import React from 'react';
import { ArrowRight } from "lucide-react";

export default function AuthSubmit({ isLoading, text }) {
  return (
    <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-70 disabled:cursor-not-allowed">
      {isLoading ? "Loading..." : (
        <div className="flex items-center gap-2">
          <span>{text}</span>
          <ArrowRight size={16} className="group-hover:translate-x-1" />
        </div>
      )}
    </button>
  );
}
