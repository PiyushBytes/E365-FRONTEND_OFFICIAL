import React from "react";

export default function AuthInput({ icon: Icon, type = "text", RightAction, ...props }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-500" />
      </div>
      <input type={type} className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all" {...props} />
      {RightAction && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{RightAction}</div>}
    </div>
  );
}
