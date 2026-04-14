import React from 'react';

const RequestCard = ({ req, onAccept, onDecline }) => {
  return (
    <div className="group bg-zinc-900/60 hover:bg-zinc-800/60 rounded-md p-0 overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        {/* Date */}
        <div className="sm:w-20 bg-white/[0.02] border-b sm:border-b-0 sm:border-r border-white/5 flex flex-col items-center justify-center p-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{req.date.split(" ")[0]}</span>
          <span className="text-2xl font-black text-white">{req.date.split(" ")[1]}</span>
        </div>
        {/* Content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={req.clientImg} alt="Client" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 className="font-semibold text-white text-sm">{req.name}</h4>
                <p className="text-[11px] text-zinc-500">{req.location} · {req.eventType}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-zinc-600 uppercase font-bold tracking-wider mb-0.5">Offer</span>
              <span className="block text-lg font-black text-[#1ed760]">{req.offer}</span>
            </div>
          </div>
          <div className="flex gap-2 pt-3 border-t border-white/5">
            <button onClick={() => onAccept && onAccept(req)} className="flex-1 bg-[#1ed760] hover:bg-[#1fdf64] text-black py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors">
              Accept
            </button>
            <button onClick={() => onDecline && onDecline(req)} className="px-5 py-2.5 border border-zinc-700 hover:border-white text-white rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors">
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
