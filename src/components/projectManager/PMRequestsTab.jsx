import React from "react";
import PMNotification from "./PMNotification";
import { Bell } from "lucide-react";

export default function PMRequestsTab({ notifications, unreadCount, loading, fetchRequests, handleOpenChat, handleCancel }) {
  return (
    <div className="max-w-7xl mx-auto animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">All Requests{unreadCount > 0 && <span className="ml-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full">{unreadCount} new</span>}</h2>
        <button onClick={fetchRequests} className="text-sm text-gray-400 hover:text-white border border-slate-700 px-4 py-2 rounded-lg">🔄 Refresh</button>
      </div>
      {loading ? <div className="text-gray-400 text-center py-20">Loading requests...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notifications.length > 0 ? notifications.map((req, i) => <PMNotification key={i} notification={req} onOpenChat={handleOpenChat} onCancel={handleCancel} />) : (
             <div className="col-span-full py-20 text-center text-gray-500 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed"><Bell size={48} className="mx-auto mb-4 opacity-50" /><p>No requests found.</p></div>
          )}
        </div>
      )}
    </div>
  );
}
