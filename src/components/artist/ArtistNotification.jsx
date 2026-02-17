import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Building2, 
  Info,
  Check,
  X,
  MessageCircle
} from 'lucide-react';

const ArtistNotification = ({ notification, onNegotiate }) => {
  // Format price helper
  const formatPrice = (price) => {
    if (!price) return "Negotiable";
    return isNaN(price) ? price : `₹${Number(price).toLocaleString()}`;
  };

  return (
    <div className="relative bg-zinc-900/40 border border-white/5 rounded-3xl p-6 overflow-hidden hover:border-red-500/20 transition-all duration-300 group shadow-lg hover:shadow-red-900/5">
      
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 p-20 bg-red-500/5 blur-[80px] rounded-full pointer-events-none -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h3 className="text-xl font-bold text-white tracking-tight">{notification.event_name || "Event Request"}</h3>
             <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider">
               New
             </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
             <Building2 size={14} className="text-gray-500" />
             <span>{notification.company_name || "Unknown Company"}</span>
          </div>
        </div>
        
        {/* Price Tag */}
        <div className="text-right">
           <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Offer</div>
           <div className="text-xl font-bold text-green-400 flex items-center justify-end gap-1">
              {formatPrice(notification.client_offerings)}
           </div>
        </div>
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
         <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3 hover:bg-white/10 transition-colors">
            <div className="p-2 bg-black/40 rounded-lg text-blue-400">
               <Calendar size={16} />
            </div>
            <div>
               <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Date</div>
               <div className="text-xs font-semibold text-gray-200 mt-0.5">
                 {notification.event_date ? notification.event_date.split('T')[0] : 'TBD'}
               </div>
               <div className="text-[10px] text-gray-500">
                 {notification.event_date ? notification.event_date.split('T')[1]?.substring(0,5) || 'All Day' : ''}
               </div>
            </div>
         </div>

         <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3 hover:bg-white/10 transition-colors">
            <div className="p-2 bg-black/40 rounded-lg text-purple-400">
               <MapPin size={16} />
            </div>
            <div>
               <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Location</div>
               <div className="text-xs font-semibold text-gray-200 mt-0.5">{notification.event_place || "Remote"}</div>
               <div className="text-[10px] text-gray-500">{notification.event_venue_type || "Venue"}</div>
            </div>
         </div>

         <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3 hover:bg-white/10 transition-colors">
            <div className="p-2 bg-black/40 rounded-lg text-yellow-400">
               <Users size={16} />
            </div>
            <div>
               <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Audience</div>
               <div className="text-xs font-semibold text-gray-200 mt-0.5">{notification.audience_size || "0"}</div>
            </div>
         </div>

         <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3 hover:bg-white/10 transition-colors">
            <div className="p-2 bg-black/40 rounded-lg text-gray-400">
               <Info size={16} />
            </div>
            <div>
               <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Details</div>
               <div className="text-[10px] text-gray-300 leading-tight line-clamp-2 mt-0.5">
                 {notification.event_description || "No description provided."}
               </div>
            </div>
         </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 relative z-10">
        <button className="flex-1 bg-white text-black py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group/btn">
           <Check size={16} className="group-hover/btn:scale-110 transition-transform" />
           <span>Accept</span>
        </button>
        
        <button 
          onClick={() => onNegotiate && onNegotiate(notification)}
          className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-600/20 hover:border-blue-500/50 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
        >
           <MessageCircle size={16} />
           <span>Negotiate</span>
        </button>
        
        <button className="px-4 bg-white/5 border border-white/10 text-gray-400 py-3 rounded-xl hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all">
           <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ArtistNotification;
