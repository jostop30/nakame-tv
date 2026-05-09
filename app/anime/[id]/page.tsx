"use client";
import { useEffect, useState } from 'react';
import { Cast, Maximize, PlayCircle } from 'lucide-react';

export default function AnimePlayer({ params }: { params: { id: string } }) {
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    // Conexión a tu API
    fetch(`http://localhost:3005/api/watch?url=https://www3.animeflv.net/ver/one-piece-tv-1`)
      .then(res => res.json())
      .then(data => setSources(data.sources || []));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl mb-8 group">
        {sources.length > 0 ? (
          <iframe src={sources[0].url} className="w-full h-full" allowFullScreen></iframe>
        ) : (
          <div className="flex items-center justify-center h-full text-nakame-500 animate-pulse"><PlayCircle size={64}/></div>
        )}
        
        {/* Controles Overlay Futuristas */}
        <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-black/60 p-2 rounded-lg text-white hover:text-nakame-500 backdrop-blur border border-white/10" title="Transmitir a Smart TV (Chromecast)">
            <Cast size={24} />
          </button>
          <button className="bg-black/60 p-2 rounded-lg text-white hover:text-nakame-500 backdrop-blur border border-white/10" title="Pantalla Completa">
            <Maximize size={24} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {sources.map((src, i) => (
          <button key={i} className="px-4 py-2 rounded-lg text-sm font-bold bg-white/5 hover:bg-nakame-600 border border-white/10 transition-colors">
            {src.server.toUpperCase()} ({src.lang})
          </button>
        ))}
      </div>
      
      <h1 className="text-4xl font-black mb-4">Episodio 1</h1>
      <p className="text-gray-400 max-w-3xl leading-relaxed">
        Aquí irá la sinopsis dinámica obtenida de tu API. Esta página está diseñada para actualizar automáticamente la información del capítulo y las opciones de servidor.
      </p>
    </div>
  );
}
