import React from "react";
import StatsCard from "../common/StatsCard";
import PMNotification from "./PMNotification";
import { Users, Calendar, Bell } from "lucide-react";

export default function PMOverviewTab({ notifications, unreadCount, loading, handleOpenChat, handleCancel, setActiveTab }) {
  const statsData = [
    { label: "Active Requests", value: notifications.length.toString(), trend: "Needs Action", icon: Bell, color: "text-purple-400" },
    { label: "Managed Artists", value: "45", trend: "+2", icon: Users, color: "text-blue-400" },
    { label: "Upcoming Events", value: "12", trend: "This Month", icon: Calendar, color: "text-green-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, i) => <StatsCard key={i} {...stat} />)}
      </div>
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Bell size={20} className="text-purple-500" /> Recent Requests{unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount} new</span>}</h3>
          <button onClick={() => setActiveTab("requests")} className="text-sm text-gray-400 hover:text-white">See All</button>
        </div>
        {loading ? <div className="text-gray-400 text-center py-10">Loading requests...</div> : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {notifications.slice(0, 2).map((req, i) => <PMNotification key={i} notification={req} onOpenChat={handleOpenChat} onCancel={handleCancel} />)}
            {notifications.length === 0 && <div className="col-span-full p-8 text-center text-gray-500 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">No pending requests.</div>}
          </div>
        )}
      </section>
    </div>
  );
}
