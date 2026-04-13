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

// Artist notification component - Yeh component artist ko aane wali event requests dikhata hai
const ArtistNotification = ({ notification, onNegotiate, onAccept, onReject }) => {
  // Price ko format karne wala helper function, agar price nahi hai toh "Negotiable" dikhayega
  const formatPrice = (price) => {
    if (!price) return "Negotiable";
    return isNaN(price) ? price : `₹${Number(price).toLocaleString()}`;
  };

  return (
    <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 overflow-hidden hover:border-zinc-800 transition-all duration-300">

      {/* Header section - Yaha event ka naam aur company details show hote hain */}
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
      
      {/* Details Grid - Event ki date, location, audience aur description grid me set karte hain */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
         <div className="p-3 bg-[#111111] rounded-xl border border-[#1a1a1a] flex items-start gap-3">
            <div className="p-2 bg-black rounded-lg text-white">
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

         <div className="p-3 bg-[#111111] rounded-xl border border-[#1a1a1a] flex items-start gap-3">
            <div className="p-2 bg-black rounded-lg text-white">
               <MapPin size={16} />
            </div>
            <div>
               <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Location</div>
               <div className="text-xs font-semibold text-gray-200 mt-0.5">{notification.event_place || "Remote"}</div>
               <div className="text-[10px] text-gray-500">{notification.event_venue_type || "Venue"}</div>
            </div>
         </div>

         <div className="p-3 bg-[#111111] rounded-xl border border-[#1a1a1a] flex items-start gap-3">
            <div className="p-2 bg-black rounded-lg text-white">
               <Users size={16} />
            </div>
            <div>
               <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Audience</div>
               <div className="text-xs font-semibold text-gray-200 mt-0.5">{notification.audience_size || "0"}</div>
            </div>
         </div>

         <div className="p-3 bg-[#111111] rounded-xl border border-[#1a1a1a] flex items-start gap-3">
            <div className="p-2 bg-black rounded-lg text-white">
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

      {/* Action buttons - Accept, Negotiate ya Reject karne ke options */}
      <div className="flex gap-2 relative z-10">
        <button 
          onClick={() => onAccept && onAccept(notification)}
          className="flex-1 bg-white text-black py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
           <Check size={16} />
           <span>Accept</span>
        </button>
        
        <button 
          onClick={() => onNegotiate && onNegotiate(notification)}
          className="flex-1 bg-[#111111] border border-[#1a1a1a] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-2"
        >
           <MessageCircle size={16} />
           <span>Negotiate</span>
        </button>
        
        <button 
          onClick={() => onReject && onReject(notification)}
          className="px-4 bg-[#111111] border border-[#1a1a1a] text-gray-400 py-3 rounded-xl hover:bg-[#1a1a1a] hover:text-white transition-all"
        >
           <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ArtistNotification;
