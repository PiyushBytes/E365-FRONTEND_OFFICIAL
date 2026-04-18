import React from 'react';

const StatsCard = ({ label, value, trend, icon: Icon, color, subLabel }) => {
  return (
    <div className="bg-linear-to-br from-white/75 to-emerald-50/50 border border-teal-300/40 rounded-2xl p-6 backdrop-blur-md hover:border-teal-400/60 hover:shadow-lg transition-all group relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-teal-100/20 to-emerald-100/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {Icon && <Icon size={60} className="text-teal-600" />}
      </div>
      <div className="flex items-start justify-between mb-4 relative z-10">
        {Icon && (
          <div className={`p-2.5 rounded-xl bg-linear-to-br from-teal-100 to-emerald-100 ${color || 'text-teal-600'}`}>
            <Icon size={20} />
          </div>
        )}
        {trend && (
           <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
             trend.includes('+') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
           }`}>
             {trend}
           </div>
        )}
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
        <p className="text-sm text-slate-600">{label}</p>
        {subLabel && <p className="text-xs text-slate-500 mt-1">{subLabel}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
