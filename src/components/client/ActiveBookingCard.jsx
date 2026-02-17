import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

const ActiveBookingCard = ({ booking }) => {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all">
      <div className="flex items-center gap-6 w-full md:w-auto">
        <img
          src={booking.image}
          alt={booking.artistName}
          className="w-20 h-20 rounded-2xl object-cover shadow-lg"
        />
        <div>
          <h4 className="text-xl font-bold text-white mb-1">
            {booking.artistName}
          </h4>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Sparkles size={14} /> {booking.eventType}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {booking.date}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
        <div className="text-right">
          <span className="block text-xs text-gray-500 uppercase">Amount</span>
          <span className="block text-lg font-bold text-white">
            {booking.amount}
          </span>
        </div>
        <div
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
            booking.status === "Confirmed"
              ? "bg-green-500/10 text-green-400"
              : "bg-yellow-500/10 text-yellow-400"
          }`}
        >
          {booking.status}
        </div>
      </div>
    </div>
  );
};

export default ActiveBookingCard;
