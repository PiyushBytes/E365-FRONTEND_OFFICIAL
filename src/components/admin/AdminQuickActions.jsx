import React from "react";
import { 
  UserPlus, 
  FileText, 
  Activity, 
  ChevronRight 
} from "lucide-react";

const AdminQuickActions = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add New Artist */}
      <div className="bg-gradient-to-br from-red-600/20 to-zinc-900 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-red-500/50 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <UserPlus size={80} />
        </div>
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-red-900/50 group-hover:scale-110 transition-transform">
            <UserPlus size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Add New Artist</h3>
          <p className="text-sm text-gray-400 mb-6">Onboard a new talent to the platform.</p>
          <button className="flex items-center gap-2 text-sm font-bold text-red-400 group-hover:text-red-300 transition-colors">
            Create Profile <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Reports */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all group cursor-pointer">
        <div className="flex items-start justify-between mb-6">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <FileText size={24} />
          </div>
          <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded text-gray-400">Weekly</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">View Reports</h3>
        <p className="text-sm text-gray-400">Analyze platform performance and revenue.</p>
      </div>

      {/* System Status */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all group cursor-pointer">
        <div className="flex items-start justify-between mb-6">
          <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
            <Activity size={24} />
          </div>
          <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Operational
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">System Status</h3>
        <p className="text-sm text-gray-400">All systems operational. No issues detected.</p>
      </div>
    </div>
  );
};

export default AdminQuickActions;
