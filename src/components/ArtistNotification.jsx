import React from 'react';
import { Sparkles, Calendar, CreditCard, Ticket } from 'lucide-react';

const ArtistNotification = ({ notification }) => {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-red-500/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
          <Ticket size={24} />
        </div>
        <span className="text-xs font-bold bg-green-500/10 text-green-400 px-3 py-1 rounded-full uppercase tracking-wider">
          New
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{notification.event_type || "Event Request"}</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <CreditCard size={16} className="text-gray-600" />
          <span>Offer: {notification.client_offerings || "Negotiable"}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
            <Calendar size={16} className="text-gray-600" />
            <span>{notification.event_place}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="text-gray-600 font-bold">Size:</span>
            <span>{notification.audience_size}</span>
        </div>
      </div>   

      <div className="flex gap-3 pt-4 border-t border-white/5">
        <button className="flex-1 bg-white text-black py-2.5 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-colors">
          Accept
        </button>
        <button className="px-4 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-gray-400 hover:text-white hover:border-white/30 transition-colors">
          Decline
        </button>
      </div>
    </div>
  );
};

export default ArtistNotification;
