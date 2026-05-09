"use client";
import { Search, Flame, Play, Calendar, Heart, Clock, User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#0b0d12] border-b border-white/5 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-purple-500"><Play size={32} fill="currentColor"/></div>
            <span className="text-2xl font-black text-white tracking-tighter">NAKAME TV</span>
          </Link>

          <div className="flex-1 max-w-xl mx-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar anime..." 
              className="w-full bg-[#161921] border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-purple-500/50"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-purple-500">BUSCAR</button>
          </div>

          <button className="bg-white/5 p-2.5 rounded-xl hover:bg-white/10"><User size={20}/></button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20">
            <Flame size={16} fill="currentColor"/> Tendencias
          </button>
          <button className="flex items-center gap-2 bg-white/5 text-gray-400 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10">
            <Play size={16}/> En Emisión
          </button>
          <button className="flex items-center gap-2 bg-white/5 text-gray-400 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10">
            <Clock size={16}/> Próximamente
          </button>
          <button className="flex items-center gap-2 bg-white/5 text-gray-400 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10">
            <Heart size={16}/> Favoritos
          </button>
        </div>
      </div>
    </nav>
  );
}
