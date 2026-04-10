import React from "react";
import ArtistNotification from "./ArtistNotification";
import { Ticket } from "lucide-react";

// RequestsTab - Is section mein artist ki saari request history (nayi aur purani dono) show hoti hai
export default function RequestsTab({ notifications, handleNegotiate, handleAccept }) {
  return (
    <div className="max-w-7xl mx-auto animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Request History</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-300 hover:text-white">Pending</button>
          <button className="px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-300 hover:text-white">Accepted</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Notifications map karke check karte hain, nahi milti toh fallback UI dikhate hain */}
        {notifications.length > 0 ? (
          notifications.map((req, idx) => <ArtistNotification key={idx} notification={req} onNegotiate={handleNegotiate} onAccept={handleAccept} />)
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
            <Ticket size={48} className="mx-auto mb-4 opacity-50" /><p>No requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
