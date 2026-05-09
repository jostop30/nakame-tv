"use client";
import { Star, Heart, Play } from 'lucide-react';
import { useState } from 'react';

export default function AnimeCard({ anime }: any) {
  const [isFav, setIsFav] = useState(false);

  return (
    <div className="anime-card group">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img src={anime.coverImage.large} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
            <Star size={12} className="text-yellow-500" fill="currentColor" />
            <span className="text-[10px] font-bold">9.1</span>
          </div>
        </div>

        <button 
          onClick={(e) => { e.preventDefault(); setIsFav(!isFav); }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border border-white/10 transition-all ${isFav ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-red-500'}`}
        >
          <Heart size={16} fill={isFav ? "currentColor" : "none"} />
        </button>

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-purple-600 p-4 rounded-full shadow-xl shadow-purple-500/50 scale-75 group-hover:scale-100 transition-transform">
                <Play fill="white" size={24} />
            </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-sm line-clamp-1 group-hover:text-purple-400 transition-colors">{anime.title.romaji}</h3>
        <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase">24 eps</span>
            <div className="w-1 h-1 bg-gray-700 rounded-full" />
            <span className="text-[10px] font-bold text-gray-500 uppercase">2024</span>
        </div>
      </div>
    </div>
  );
}
