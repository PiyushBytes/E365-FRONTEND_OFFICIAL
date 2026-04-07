import React from "react";

export default function RoleSelector({ roles, selectedRole, onSelect }) {
  return (
    <div className={`grid grid-cols-${roles.length} gap-2 p-1 bg-black/40 rounded-xl border border-white/5`}>
      {roles.map((r) => (
        <button key={r.id} type="button" onClick={() => onSelect(r.id)} className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-300 ${selectedRole === r.id ? 'bg-white/10 shadow-lg border border-white/10' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}>
          <r.icon size={18} className={`mb-1 ${selectedRole === r.id ? r.color : 'text-gray-400'}`} />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedRole === r.id ? 'text-white' : 'text-gray-500'}`}>{r.label}</span>
        </button>
      ))}
    </div>
  );
}
