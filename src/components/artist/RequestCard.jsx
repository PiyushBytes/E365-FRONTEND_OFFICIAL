import React from 'react';

const RequestCard = ({ req, onAccept, onDecline }) => {
  return (
    <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md rounded-xl overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        {/* Date */}
        <div className="sm:w-24 bg-slate-50 border-b sm:border-b-0 sm:border-r border-slate-100 flex flex-col items-center justify-center p-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{req.date.split(" ")[0]}</span>
          <span className="text-3xl font-extrabold text-slate-900">{req.date.split(" ")[1]}</span>
        </div>
        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <img src={req.clientImg} alt="Client" className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-100" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{req.name}</h4>
                <p className="text-[12px] font-medium text-slate-500">{req.location} · {req.eventType}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Offer</span>
              <span className="block text-lg font-bold text-indigo-600">{req.offer}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onAccept && onAccept(req)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-[12px] font-semibold tracking-wide transition-colors focus:ring-2 focus:ring-indigo-500/20">
              Accept
            </button>
            <button onClick={() => onDecline && onDecline(req)} className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md text-[12px] font-semibold tracking-wide transition-colors focus:ring-2 focus:ring-slate-200">
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
