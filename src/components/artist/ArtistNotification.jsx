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
const ArtistNotification = ({ notification, onNegotiate, onAccept }) => {
  // Price ko format karne wala helper function, agar price nahi hai toh "Negotiable" dikhayega
  const formatPrice = (price) => {
    if (!price) return "Negotiable";
    return isNaN(price) ? price : `₹${Number(price).toLocaleString()}`;
  };

  return (
    <div className="relative bg-white border border-slate-200 shadow-sm rounded-2xl p-6 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-300">

      {/* Header section - Yaha event ka naam aur company details show hote hain */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h3 className="text-xl font-bold text-slate-900 tracking-tight">{notification.event_name || "Event Request"}</h3>
             <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
               New
             </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
             <Building2 size={14} className="text-slate-400" />
             <span>{notification.company_name || "Unknown Company"}</span>
          </div>
        </div>
        
        {/* Price Tag */}
        <div className="text-right">
           <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">Offer</div>
           <div className="text-xl font-bold text-indigo-600 flex items-center justify-end gap-1">
              {formatPrice(notification.client_offerings)}
           </div>
        </div>
      </div>
      
      {/* Details Grid - Event ki date, location, audience aur description grid me set karte hain */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
         <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="p-2 bg-white border border-slate-200 shadow-sm rounded-lg text-indigo-600">
               <Calendar size={16} />
            </div>
            <div>
               <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Date</div>
               <div className="text-xs font-semibold text-slate-900 mt-0.5">
                 {notification.event_date ? notification.event_date.split('T')[0] : 'TBD'}
               </div>
               <div className="text-[10px] font-medium text-slate-500">
                 {notification.event_date ? notification.event_date.split('T')[1]?.substring(0,5) || 'All Day' : ''}
               </div>
            </div>
         </div>

         <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="p-2 bg-white border border-slate-200 shadow-sm rounded-lg text-indigo-600">
               <MapPin size={16} />
            </div>
            <div>
               <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Location</div>
               <div className="text-xs font-semibold text-slate-900 mt-0.5">{notification.event_place || "Remote"}</div>
               <div className="text-[10px] font-medium text-slate-500">{notification.event_venue_type || "Venue"}</div>
            </div>
         </div>

         <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="p-2 bg-white border border-slate-200 shadow-sm rounded-lg text-indigo-600">
               <Users size={16} />
            </div>
            <div>
               <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Audience</div>
               <div className="text-xs font-semibold text-slate-900 mt-0.5">{notification.audience_size || "0"}</div>
            </div>
         </div>

         <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="p-2 bg-white border border-slate-200 shadow-sm rounded-lg text-indigo-600">
               <Info size={16} />
            </div>
            <div>
               <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Details</div>
               <div className="text-[11px] font-medium text-slate-600 leading-tight line-clamp-2 mt-0.5">
                 {notification.event_description || "No description provided."}
               </div>
            </div>
         </div>
      </div>

      {/* Action buttons - Accept, Negotiate ya Reject karne ke options */}
      <div className="flex gap-2 relative z-10">
        <button 
          onClick={() => onAccept && onAccept(notification)}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg text-xs font-bold tracking-wider hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
        >
           <Check size={16} />
           <span>Accept</span>
        </button>
        
        <button 
          onClick={() => onNegotiate && onNegotiate(notification)}
          className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-lg text-xs font-bold tracking-wider hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
           <MessageCircle size={16} className="text-slate-500" />
           <span>Negotiate</span>
        </button>
        
        <button className="px-4 bg-white border border-slate-200 text-slate-400 py-3 rounded-lg hover:bg-slate-50 hover:text-red-500 transition-all shadow-sm">
           <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ArtistNotification;
