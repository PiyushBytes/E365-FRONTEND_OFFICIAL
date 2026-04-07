import React from "react";
import StatsCard from "../common/StatsCard";
import RequestCard from "./RequestCard";
import { Ticket, ListMusic, Clock, CheckCircle2, CreditCard } from "lucide-react";

export default function ArtistOverviewTab({ user, available, setAvailable, stats, requests, handleAccept }) {
  const statsData = [
    { label: "Total Bookings", value: stats.totalBookings, trend: "+12%", icon: ListMusic, color: "text-blue-400" },
    { label: "Pending Requests", value: stats.pendingRequests, trend: "Action Req", icon: Clock, color: "text-yellow-400" },
    { label: "Confirmed", value: stats.acceptedBookings, trend: "This Month", icon: CheckCircle2, color: "text-green-400" },
    { label: "Revenue", value: stats.revenue, trend: "+8.5%", icon: CreditCard, color: "text-purple-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
        <div><h2 className="text-3xl font-bold mb-1">Welcome back, {user?.username}</h2><p className="text-gray-400 text-sm">Here's your summary.</p></div>
        <div onClick={() => setAvailable(!available)} className={`cursor-pointer flex items-center gap-3 px-3 py-1.5 rounded-full border ${available ? 'border-green-500/30 bg-green-500/5' : 'border-gray-700 bg-gray-800/20'}`}>
          <div className={`w-2 h-2 rounded-full ${available ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${available ? 'text-green-400' : 'text-gray-500'}`}>{available ? "Online" : "Offline"}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, i) => <StatsCard key={i} {...stat} />)}
      </div>
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Ticket size={20} className="text-red-500" /> New Requests</h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {requests.length ? requests.map((req, i) => <RequestCard key={i} req={req} onAccept={handleAccept} onDecline={() => {}} />) : <div className="col-span-full p-8 text-center text-gray-500 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">No pending requests.</div>}
        </div>
      </section>
    </div>
  );
}
