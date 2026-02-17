import React from 'react';

const StatsCard = ({ label, value, trend, icon: Icon, color, subLabel }) => {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-md hover:border-white/20 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {Icon && <Icon size={60} />}
      </div>
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={`p-2.5 rounded-xl bg-white/5 ${color || 'text-white'}`}>
            <Icon size={20} />
          </div>
        )}
        {trend && (
           <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
             trend.includes('+') ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
           }`}>
             {trend}
           </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-gray-400">{label}</p>
        {subLabel && <p className="text-xs text-gray-500 mt-1">{subLabel}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
