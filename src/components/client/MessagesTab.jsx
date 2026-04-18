import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Music, CheckCircle2, Clock } from "lucide-react";

export default function MessagesTab({ chatboxes, selectedChatbox, setSelectedChatbox, chatMessages, setChatMessages, loadingMessages, handleSelectChatbox }) {
  const [titles, setTitles] = useState(() => JSON.parse(localStorage.getItem("chatTitles") || "{}"));

  // Automatically open chat widget when a chat is selected
  useEffect(() => {
    if (selectedChatbox) {
      localStorage.setItem("chatboxId", selectedChatbox.id);
      window.dispatchEvent(new CustomEvent("open-chat-widget"));
      setSelectedChatbox(null);
      setChatMessages([]);
    }
  }, [selectedChatbox]);

  const getStatusColor = (status) => {
    if (status === "Confirmed") {
      return "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
    }
    return "bg-blue-500/20 border-blue-500/40 text-blue-300";
  };

  const getStatusIcon = (status) => {
    return status === "Confirmed" ? <CheckCircle2 size={14} /> : <Clock size={14} />;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900">My Event Bookings</h2>
      {chatboxes.length === 0 ? (
        <div className="text-gray-400 text-center py-20">
          <Music size={48} className="mx-auto mb-4 opacity-30" />
          <p>No bookings yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {chatboxes.map((booking) => (
            <div
              key={booking.id}
              onClick={() => handleSelectChatbox(booking)}
              className="group cursor-pointer transition-all duration-300 active:scale-95"
            >
              {/* Card */}
              <div className="bg-linear-to-br from-blue-50/40 via-teal-50/30 to-emerald-50/40 border border-teal-200/50 rounded-2xl p-4 sm:p-6 transition-all duration-300 group-hover:border-teal-400/60 group-hover:shadow-lg group-hover:bg-linear-to-br group-hover:from-blue-50/60 group-hover:via-teal-50/50 group-hover:to-emerald-50/60">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                  <div className="flex items-center gap-2">
                    <Music size={16} className="text-teal-600 shrink-0" />
                    <span className="text-xs uppercase tracking-wider text-teal-700 font-bold">
                      {booking.eventType || "Event"}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold text-xs whitespace-nowrap w-fit ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="uppercase tracking-wider">{booking.status || "Pending"}</span>
                  </div>
                </div>

                {/* Artist Name */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 wrap-break-word">
                  {booking.artistName || titles[booking.id] || `Booking ${booking.id.slice(0, 8)}`}
                </h3>

                {/* Details Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {/* Event Date */}
                  <div className="bg-white/50 border border-teal-200/50 rounded-lg p-3 sm:p-4 flex items-start gap-3 hover:bg-white/70 transition-colors">
                    <Calendar size={18} className="text-teal-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600 uppercase tracking-wider font-bold mb-0.5">
                        Event Date
                      </p>
                      <p className="text-slate-900 font-semibold text-sm sm:text-base">
                        {booking.eventDate
                          ? new Date(booking.eventDate).toLocaleDateString("en-IN", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "TBD"}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-white/50 border border-teal-200/50 rounded-lg p-3 sm:p-4 flex items-start gap-3 hover:bg-white/70 transition-colors">
                    <MapPin size={18} className="text-teal-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600 uppercase tracking-wider font-bold mb-0.5">
                        Location
                      </p>
                      <p className="text-slate-900 font-semibold text-sm sm:text-base truncate">
                        {booking.eventLocation || booking.location || "Location TBD"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-teal-200/50">
                  <div className="text-xs text-slate-600 font-medium">
                    {new Date(booking.created_at).toLocaleDateString("en-IN")}
                  </div>
                  <span className="text-xs text-teal-700 font-bold uppercase tracking-wider group-hover:text-teal-600 transition-colors">
                    Click to view messages →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}