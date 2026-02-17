import React from 'react';
import { Star, ChevronRight } from 'lucide-react';

const RecommendedArtistCard = ({ artist }) => {
  return (
    <div className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-300">
      <div className="h-64 overflow-hidden relative">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold">{artist.rating}</span>
        </div>
      </div>
      <div className="p-5">
        <h4 className="text-lg font-bold text-white mb-1">{artist.name}</h4>
        <p className="text-sm text-gray-400 mb-4">{artist.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-red-500 font-bold">{artist.price}</span>
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendedArtistCard;
