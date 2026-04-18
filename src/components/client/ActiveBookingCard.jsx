import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

const ActiveBookingCard = ({ booking }) => {
  return (
    <div className="bg-linear-to-br from-white/75 to-emerald-50/50 border border-teal-300/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-teal-400/60 hover:shadow-lg transition-all">
      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="relative">
          <img
            src={booking.image}
            alt={booking.artistName}
            className="w-20 h-20 rounded-2xl object-cover shadow-lg ring-2 ring-teal-300/40"
          />
        </div>
        <div>
          <h4 className="text-xl font-bold text-slate-900 mb-1">
            {booking.artistName}
          </h4>
          <div className="flex items-center gap-4 text-sm text-slate-600">
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
          <span className="block text-xs text-slate-500 uppercase">Amount</span>
          <span className="block text-lg font-bold text-slate-900">
            {booking.amount}
          </span>
        </div>
        <div
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
            booking.status === "Confirmed"
              ? "bg-green-100 text-green-700"
              : "bg-teal-100 text-teal-700"
          }`}
        >
          {booking.status}
        </div>
      </div>
    </div>
  );
};

export default ActiveBookingCard;
