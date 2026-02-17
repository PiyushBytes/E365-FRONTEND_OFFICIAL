import React from 'react';

const RequestCard = ({ req, onAccept, onDecline }) => {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-0 overflow-hidden hover:border-red-500/30 transition-all group">
      <div className="flex flex-col sm:flex-row">
        {/* Date Stub */}
        <div className="sm:w-24 bg-red-900/10 border-b sm:border-b-0 sm:border-r border-white/5 flex flex-col items-center justify-center p-4">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">
            {req.date.split(" ")[0]}
          </span>
          <span className="text-2xl font-bold text-white">
            {req.date.split(" ")[1]}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={req.clientImg}
                alt="Client"
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />
              <div>
                <h4 className="font-bold text-white text-base">{req.name}</h4>
                <p className="text-xs text-gray-400">
                  {req.location} • {req.eventType}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-xs text-gray-500 uppercase mb-1">
                Offer
              </span>
              <span className="block text-lg font-bold text-green-400">
                {req.offer}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
            <button
              onClick={() => onAccept && onAccept(req)}
              className="flex-1 bg-white text-black hover:bg-red-600 hover:text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Accept
            </button>
            <button
               onClick={() => onDecline && onDecline(req)}
               className="px-4 py-2 border border-white/10 hover:border-red-500/50 hover:text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-gray-400"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
