"use client";
import { useEffect, useState } from 'react';
import { Flame, Star, Play, Clock, Heart, ShieldAlert, Search, User, Calendar, X, Info, Tv, LogIn, Coffee, HeartHandshake, Ghost, Mail } from 'lucide-react';

export default function Home() {
    const [animes, setAnimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [section, setSection] = useState('TRENDING');
    const [selectedDay, setSelectedDay] = useState('Lunes');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [selectedAnime, setSelectedAnime] = useState(null);
    const [watchingEpisode, setWatchingEpisode] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('nakame_favs');
        if (saved) {
            try { setFavorites(JSON.parse(saved)); } catch (e) { setFavorites([]); }
        }
        const savedUser = localStorage.getItem('nakame_user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const handleLogin = () => {
        if (!user) {
            const nickname = prompt("Introduce tu apodo para Nakame TV:", "Nakama");
            const newUser = { name: nickname || "Usuario", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (nickname || "jostop30") };
            setUser(newUser);
            localStorage.setItem('nakame_user', JSON.stringify(newUser));
        } else {
            setUser(null);
            localStorage.removeItem('nakame_user');
        }
    };

    const fetchAnimes = async (type, queryText = '') => {
        setLoading(true);
        setAnimes([]); 
        let filter = '';
        if (queryText) {
            filter = `search: "${queryText}", type: ANIME`;
        } else if (type === 'FAVORITOS') {
            if (favorites.length === 0) { setAnimes([]); setLoading(false); return; }
            filter = `id_in: [${favorites.join(',')}], type: ANIME`;
        } else {
            switch(type) {
                case 'TRENDING': filter = 'sort: TRENDING_DESC, type: ANIME, isAdult: false'; break;
                case 'EMISION': filter = 'status: RELEASING, sort: POPULARITY_DESC, type: ANIME, isAdult: false'; break;
                case 'HORARIOS': filter = 'status: RELEASING, sort: POPULARITY_DESC, type: ANIME, isAdult: false'; break;
                case 'HENTAI': filter = 'sort: ID_DESC, type: ANIME, isAdult: true'; break;
            }
        }

        const query = `query { Page(perPage: 100) { media(${filter}) { id title { romaji } description coverImage { extraLarge } bannerImage averageScore episodes seasonYear status genres nextAiringEpisode { episode airingAt } } } }`;

        try {
            const res = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            const json = await res.json();
            setAnimes(json?.data?.Page?.media || []);
        } catch (err) { setAnimes([]); } finally { setLoading(false); }
    };

    useEffect(() => { if (section !== 'SEARCH') fetchAnimes(section); }, [section, favorites.length && section === 'FAVORITOS']);

    const toggleFavorite = (e, id) => {
        e.stopPropagation();
        const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
        setFavorites(updated);
        localStorage.setItem('nakame_favs', JSON.stringify(updated));
    };

    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const orderedWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    return (
        <main className="min-h-screen bg-[#0b0d12] text-white flex flex-col selection:bg-purple-500 selection:text-white">
            {/* MODAL DETALLES */}
            {selectedAnime && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => {setSelectedAnime(null); setWatchingEpisode(null)}}></div>
                    <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#12141c] rounded-[3rem] overflow-y-auto no-scrollbar border border-white/5 shadow-2xl animate-in zoom-in-95 duration-300">
                        <button onClick={() => {setSelectedAnime(null); setWatchingEpisode(null)}} className="absolute top-6 right-6 z-50 bg-white/10 p-3 rounded-full hover:bg-red-500 transition-colors"><X size={24} /></button>
                        <div className="relative h-[300px] md:h-[500px] bg-black">
                            {watchingEpisode ? (
                                <iframe src={`https://www.tomatomatoma.com/embed/${selectedAnime.id}/${watchingEpisode}`} className="w-full h-full" allowFullScreen></iframe>
                            ) : (
                                <>
                                    <img src={selectedAnime.bannerImage || selectedAnime.coverImage.extraLarge} className="w-full h-full object-cover opacity-40 animate-pulse" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-8 flex flex-col md:flex-row items-end gap-8 w-full">
                                        <img src={selectedAnime.coverImage.extraLarge} className="w-40 h-60 rounded-[2rem] shadow-2xl border-4 border-[#12141c] hidden md:block" />
                                        <div className="flex-1 space-y-3">
                                            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{selectedAnime.title.romaji}</h1>
                                            <div className="flex gap-4 pt-2">
                                                <button onClick={() => setWatchingEpisode(1)} className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase flex items-center gap-2 hover:bg-purple-500 hover:text-white transition-all"><Play fill="currentColor" size={18}/> Reproducir</button>
                                                <button onClick={(e) => toggleFavorite(e, selectedAnime.id)} className={`px-4 py-3 rounded-xl border transition-all ${favorites.includes(selectedAnime.id) ? 'bg-pink-600 border-pink-500' : 'bg-white/5 border-white/10'}`}><Heart size={20} fill={favorites.includes(selectedAnime.id) ? "white" : "none"} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2">
                                <h3 className="text-lg font-black uppercase italic mb-4 text-purple-500 flex items-center gap-2"><Tv size={20}/> Lista de Episodios</h3>
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2">
                                    {Array.from({ length: selectedAnime.episodes || 12 }, (_, i) => (
                                        <button key={i} onClick={() => setWatchingEpisode(i + 1)} className={`py-3 rounded-xl font-black text-xs transition-all border ${watchingEpisode === i + 1 ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-purple-500/50'}`}>{i + 1}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 text-center">
                                    <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em] italic">Apoya a Nakame TV</h3>
                                    <a href="https://paypal.me/AlbertoJosaphatDario" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-5 bg-gradient-to-r from-yellow-500 to-orange-600 text-black rounded-2xl font-black uppercase italic text-sm shadow-lg shadow-orange-500/20 hover:scale-105 transition-all">
                                        <Coffee size={20}/> ¡Invítame un café!
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NAV BAR */}
            <nav className="bg-[#0b0d12]/95 border-b border-white/5 sticky top-0 z-50 px-6 py-4 backdrop-blur-md">
                <div className="max-w-[1400px] mx-auto space-y-6">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setSection('TRENDING')}>
                            <div className="p-2 bg-purple-600 rounded-lg group-hover:rotate-12 transition-transform"><Play size={24} fill="currentColor"/></div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic">Nakame TV</span>
                        </div>
                        <form onSubmit={(e)=>{e.preventDefault(); fetchAnimes('SEARCH', searchQuery)}} className="flex-1 max-w-xl relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="¿Qué quieres ver hoy?" className="w-full bg-[#161921] border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-purple-500/50 transition-all" />
                        </form>
                        <button onClick={handleLogin} className="flex items-center gap-3 bg-[#161921] hover:bg-white hover:text-black border border-white/5 px-4 py-2.5 rounded-2xl transition-all group">
                            {user ? (
                                <><img src={user.photo} className="w-6 h-6 rounded-full" /><span className="text-xs font-black uppercase italic">{user.name}</span></>
                            ) : (
                                <><LogIn size={18} className="group-hover:text-purple-600"/><span className="text-xs font-black uppercase italic tracking-tighter">LOGIN</span></>
                            )}
                        </button>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        <NavBtn active={section==='TRENDING'} onClick={()=>setSection('TRENDING')} icon={<Flame size={16}/>} label="Tendencia" />
                        <NavBtn active={section==='EMISION'} onClick={()=>setSection('EMISION')} icon={<Play size={16}/>} label="Emisión" />
                        <NavBtn active={section==='HORARIOS'} onClick={()=>setSection('HORARIOS')} icon={<Clock size={16}/>} label="Horarios" />
                        <NavBtn active={section==='FAVORITOS'} onClick={()=>setSection('FAVORITOS')} icon={<Heart size={16}/>} label="Favoritos" />
                        <button onClick={()=>setSection('HENTAI')} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black transition-all border uppercase ${section === 'HENTAI' ? 'bg-red-600 border-red-500 shadow-lg shadow-red-600/30' : 'bg-red-900/10 border-red-900/20 text-red-500 hover:bg-red-900/30'}`}>
                            <ShieldAlert size={16}/> +18
                        </button>
                    </div>
                </div>
            </nav>

            {/* CONTENIDO PRINCIPAL */}
            <div className="max-w-[1400px] mx-auto px-6 py-10 flex-grow">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-in fade-in">
                        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-black uppercase italic tracking-[0.3em] text-purple-500">Nakame TV</p>
                    </div>
                ) : animes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 space-y-6 text-center animate-in zoom-in-95">
                        <div className="p-8 bg-white/5 rounded-full"><Ghost size={64} className="text-white/20" /></div>
                        <div>
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">¡Vaya! No hay nada aquí</h2>
                            <p className="text-gray-500 text-sm mt-2 uppercase font-bold">Intenta con otra búsqueda o sección</p>
                        </div>
                        <button onClick={() => setSection('TRENDING')} className="px-8 py-3 bg-purple-600 rounded-xl font-black uppercase text-xs italic">Volver al inicio</button>
                    </div>
                ) : section === 'HORARIOS' ? (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="flex gap-2 bg-[#161921] p-2 rounded-[2rem] border border-white/5 overflow-x-auto no-scrollbar shadow-inner">
                            {orderedWeek.map(day => (
                                <button key={day} onClick={()=>setSelectedDay(day)} className={`flex-1 min-w-[110px] py-3.5 rounded-[1.5rem] text-xs font-black transition-all ${selectedDay === day ? 'bg-purple-600 shadow-lg' : 'text-gray-500 hover:text-white'}`}>{day.toUpperCase()}</button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                            {animes.filter(a => a.nextAiringEpisode && days[new Date(a.nextAiringEpisode.airingAt * 1000).getDay()] === selectedDay).map(anime => (
                                <AnimeCard key={anime.id} anime={anime} onSelect={setSelectedAnime} isFav={favorites.includes(anime.id)} onFav={toggleFavorite} showTime={true} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 animate-in slide-in-from-bottom-4 duration-700">
                        {animes.map((anime, i) => (
                            <AnimeCard key={anime.id} anime={anime} onSelect={setSelectedAnime} isFav={favorites.includes(anime.id)} onFav={toggleFavorite} rank={section === 'TRENDING' && i < 10 ? i + 1 : null} />
                        ))}
                    </div>
                )}
            </div>

            {/* FOOTER PREMIUM */}
            <footer className="border-t border-white/5 bg-[#0b0d12] py-16 mt-20">
                <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center font-black italic shadow-2xl shadow-purple-600/40">N</div>
                            <span className="text-2xl font-black uppercase italic tracking-tighter">Nakame TV</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] max-w-xs mx-auto md:mx-0 leading-relaxed">Tu plataforma definitiva de streaming de anime. Calidad, rapidez y pasión.</p>
                    </div>

                    <div className="group space-y-2 flex flex-col items-center">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.4em] mb-2">Mastermind</p>
                        <div className="relative inline-block">
                             <p className="text-4xl font-black uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-800 tracking-tighter">jostop30</p>
                             <div className="w-full h-1.5 bg-purple-600 rounded-full scale-x-50 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4">
                        <a href="https://paypal.me/AlbertoJosaphatDario" target="_blank" rel="noopener noreferrer" 
                           className="group relative flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] font-black uppercase italic text-sm shadow-2xl shadow-blue-900/40 hover:shadow-blue-500/50 hover:-translate-y-2 transition-all overflow-hidden">
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <HeartHandshake size={24} className="animate-pulse" />
                            <span>Donación</span>
                        </a>
                        <div className="flex flex-col items-center md:items-end gap-1">
                            <a href="mailto:jostop30@gmail.com" className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-600 hover:text-white transition-colors"><Mail size={14}/> jostop30@gmail.com</a>
                            <div className="flex gap-4 text-[9px] font-black uppercase text-gray-600 tracking-widest">
                                <span>Soporte</span><span>•</span><span>Nakame © 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}

function AnimeCard({ anime, onSelect, isFav, onFav, rank, showTime }) {
    const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : "8.5";
    return (
        <div className="group cursor-pointer relative" onClick={() => onSelect(anime)}>
            {rank && <span className="absolute -top-5 -left-5 z-20 w-14 h-14 bg-purple-600 rounded-3xl flex items-center justify-center font-black italic border-4 border-[#0b0d12] shadow-xl group-hover:scale-110 transition-transform">#{rank}</span>}
            <div className="relative aspect-[2/3] rounded-[2.5rem] overflow-hidden bg-[#161921] border border-white/5 transition-all duration-500 group-hover:border-purple-500 group-hover:shadow-2xl group-hover:shadow-purple-600/20">
                <img src={anime.coverImage.extraLarge} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                <button onClick={(e) => onFav(e, anime.id)} className={`absolute top-5 right-5 z-30 p-3 rounded-2xl backdrop-blur-md transition-all ${isFav ? 'bg-pink-600 text-white scale-110' : 'bg-black/60 text-white/50 hover:text-white hover:scale-110 hover:bg-pink-600'}`}><Heart size={16} fill={isFav ? "white" : "none"} /></button>
                <div className="absolute top-5 left-5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] font-black border border-white/10"><Star size={12} className="text-yellow-500" fill="currentColor" /> {score}</div>
                {showTime && anime.nextAiringEpisode && <div className="absolute bottom-5 left-5 right-5 bg-purple-600/90 backdrop-blur-sm px-2 py-2 rounded-2xl text-[10px] font-black text-center uppercase tracking-tighter italic border border-purple-400/30 shadow-lg">{new Date(anime.nextAiringEpisode.airingAt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} HRS</div>}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><div className="p-4 bg-white rounded-full text-black shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500"><Play fill="currentColor" size={32} /></div></div>
            </div>
            <h3 className="mt-4 text-[12px] font-black uppercase truncate italic px-2 tracking-tight group-hover:text-purple-400 transition-colors">{anime.title.romaji}</h3>
        </div>
    );
}

function NavBtn({ active, onClick, icon, label }) {
    return (
        <button onClick={onClick} className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-[11px] font-black transition-all border uppercase italic tracking-tighter ${active ? 'bg-purple-600 border-purple-500 shadow-xl shadow-purple-600/30' : 'bg-[#161921] border-white/5 text-gray-500 hover:text-white hover:border-purple-500/50'}`}>{icon} {label}</button>
    );
}
