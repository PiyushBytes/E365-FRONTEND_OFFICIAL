import React from "react";
import { Copy, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const LiveBookingsTable = ({ bookings }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md"
    >
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Live Bookings</h3>
        <button className="text-sm text-red-500 hover:text-red-400 font-bold uppercase tracking-wider">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Artist</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bookings.map((booking, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-b from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold">
                      {booking.client.charAt(0)}
                    </div>
                    <span className="font-medium text-white">{booking.client}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-300">{booking.artist}</td>
                <td className="p-4 text-gray-400 text-sm">{booking.date}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400' :
                    booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      booking.status === 'Confirmed' ? 'bg-green-400 animate-pulse' :
                      booking.status === 'Pending' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`} />
                    {booking.status}
                  </span>
                </td>
                <td className="p-4 font-medium text-white">{booking.amount}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Copy ID">
                      <Copy size={16} />
                    </button>
                    {booking.status === 'Pending' && (
                       <>
                        <button className="p-1.5 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors" title="Approve">
                          <CheckCircle2 size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="Reject">
                          <XCircle size={16} />
                        </button>
                       </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default LiveBookingsTable;
