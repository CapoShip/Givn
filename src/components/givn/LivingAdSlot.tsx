"use client";
import React, { useState, useEffect, memo } from 'react';

interface Ad {
    title: string;
    subtitle: string;
}

// ==========================================
// 1. COMPOSANTS GRAPHIQUES (CORRECTIFS VISUELS)
// ==========================================

/* --- ARBRE (Inchangé) --- */
const TreeGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-all duration-500 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="treeGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <filter id="glowTree" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>
        <path d="M50 140 C50 110 45 90 50 60 C52 45 48 30 50 10" stroke="url(#treeGradient)" strokeWidth="4" fill="none" strokeLinecap="round" className="tree-path" />
        <path d="M50 100 Q30 90 20 80" stroke="url(#treeGradient)" strokeWidth="3" fill="none" className="tree-path" style={{ animationDelay: '0.2s' }} strokeLinecap="round" />
        <path d="M50 90 Q70 80 80 70" stroke="url(#treeGradient)" strokeWidth="3" fill="none" className="tree-path" style={{ animationDelay: '0.3s' }} strokeLinecap="round" />
        <path d="M48 60 Q30 50 25 40" stroke="url(#treeGradient)" strokeWidth="2.5" fill="none" className="tree-path" style={{ animationDelay: '0.4s' }} strokeLinecap="round" />
        <path d="M52 50 Q70 40 75 30" stroke="url(#treeGradient)" strokeWidth="2.5" fill="none" className="tree-path" style={{ animationDelay: '0.5s' }} strokeLinecap="round" />
        <path d="M50 30 Q40 20 35 10" stroke="url(#treeGradient)" strokeWidth="2" fill="none" className="tree-path" style={{ animationDelay: '0.6s' }} strokeLinecap="round" />
        <path d="M50 30 Q60 20 65 10" stroke="url(#treeGradient)" strokeWidth="2" fill="none" className="tree-path" style={{ animationDelay: '0.6s' }} strokeLinecap="round" />
        <g filter="url(#glowTree)">
            <circle cx="20" cy="80" r="4" fill="#34d399" className="leaf" style={{ animationDelay: '0.8s' }} />
            <circle cx="15" cy="75" r="3" fill="#10b981" className="leaf" style={{ animationDelay: '0.9s' }} />
            <circle cx="25" cy="40" r="3.5" fill="#059669" className="leaf" style={{ animationDelay: '1s' }} />
            <circle cx="80" cy="70" r="4" fill="#34d399" className="leaf" style={{ animationDelay: '0.9s' }} />
            <circle cx="85" cy="65" r="3" fill="#10b981" className="leaf" style={{ animationDelay: '1s' }} />
            <circle cx="50" cy="10" r="5" fill="#34d399" className="leaf" style={{ animationDelay: '1.3s' }} />
        </g>
    </svg>
));
TreeGraphic.displayName = 'TreeGraphic';

/* --- MAISON (Design Traditionnel Clean) --- */
const HouseGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="wallWhite" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="roofDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
        </defs>
        
        {/* Corps de la maison (Carré solide) */}
        <g className="house-base">
            <rect x="25" y="70" width="50" height="50" fill="url(#wallWhite)" stroke="#94a3b8" strokeWidth="1" className="house-fill" />
        </g>
        
        {/* Toit (Classique) */}
        <g className="house-roof">
            <path d="M15 70 L50 35 L85 70" fill="url(#roofDark)" stroke="#0f172a" strokeWidth="1" strokeLinejoin="round" />
            <rect x="65" y="45" width="8" height="15" fill="#475569" className="house-fill" /> {/* Cheminée */}
        </g>
        
        {/* Porte (Bois) */}
        <rect x="43" y="95" width="14" height="25" fill="#78350f" className="house-pop" style={{ animationDelay: '1s' }} />
        
        {/* Fenêtres (Bleutées) */}
        <rect x="30" y="80" width="10" height="10" fill="#93c5fd" className="house-pop" style={{ animationDelay: '1.2s' }} />
        <rect x="60" y="80" width="10" height="10" fill="#93c5fd" className="house-pop" style={{ animationDelay: '1.3s' }} />
        
        {/* Verdure bas */}
        <path d="M20 120 Q 25 115 30 120 T 40 120" stroke="#16a34a" strokeWidth="2" fill="none" className="house-pop" style={{ animationDelay: '1.5s' }} />
        <path d="M60 120 Q 65 115 70 120 T 80 120" stroke="#16a34a" strokeWidth="2" fill="none" className="house-pop" style={{ animationDelay: '1.6s' }} />
    </svg>
));
HouseGraphic.displayName = 'HouseGraphic';

/* --- ROBINET (Design Corrigé + Goutte alignée) --- */
const PumpGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="metalPipe" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <filter id="glowWater" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>
        
        {/* Corps Robinet */}
        <g className="pump-body">
            {/* Tuyau vertical */}
            <rect x="45" y="50" width="10" height="90" fill="url(#metalPipe)" rx="1" />
            
            {/* Bec verseur (Sortie exacte à x=25, y=60) */}
            <path d="M45 60 H 30 Q 25 60 25 70" stroke="url(#metalPipe)" strokeWidth="8" fill="none" strokeLinecap="round" />
            
            {/* Poignée (Rouge) */}
            <path d="M45 50 L 60 40" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" className="pump-handle" />
            <circle cx="60" cy="40" r="3" fill="#b91c1c" className="pump-handle" />
        </g>
        
        {/* Goutte d'eau (Coordonnées exactes sous le bec : x=25, y=70 + marge) */}
        <g filter="url(#glowWater)">
            {/* Start at cy=75 to be just below the lip */}
            <circle cx="25" cy="75" r="4" fill="#3b82f6" className="water-drop" />
        </g>
        
        {/* Ondes (Centrées sur x=25) */}
        <g className="water-ripples">
            <ellipse cx="25" cy="135" rx="12" ry="3" stroke="#3b82f6" strokeWidth="1" fill="none" className="ripple-1" />
            <ellipse cx="25" cy="135" rx="20" ry="5" stroke="#3b82f6" strokeWidth="1" fill="none" className="ripple-2" />
        </g>
    </svg>
));
PumpGraphic.displayName = 'PumpGraphic';


// ==========================================
// 2. COMPOSANT PRINCIPAL (LOGIQUE)
// ==========================================

export default function LivingAdSlot({ 
    pool, 
    initialDelay, 
    cycleDuration = 9000, 
    forcedType 
}: { 
    pool: Ad[], 
    initialDelay: number, 
    cycleDuration?: number, 
    forcedType?: number 
}) {
    const [adIndex, setAdIndex] = useState(0);
    const [phase, setPhase] = useState('waiting');
    
    // Initialisation
    useEffect(() => {
        setAdIndex(Math.floor(Math.random() * pool.length));
        const t = setTimeout(() => setPhase('seed'), initialDelay);
        return () => clearTimeout(t);
    }, [initialDelay]);

    // Cycle
    useEffect(() => {
        if (phase === 'waiting') return;
        let timer: NodeJS.Timeout;
        
        switch (phase) {
            case 'seed': timer = setTimeout(() => setPhase('growing'), 100); break;
            case 'growing': timer = setTimeout(() => setPhase('blooming'), 1200); break;
            case 'blooming': timer = setTimeout(() => setPhase('displayed'), 600); break;
            case 'displayed': timer = setTimeout(() => setPhase('withering'), cycleDuration); break;
            case 'withering': 
                timer = setTimeout(() => { 
                    setAdIndex((prev) => (prev + 1) % pool.length); 
                    setPhase('reset'); 
                }, 600); 
                break;
            case 'reset': timer = setTimeout(() => setPhase('seed'), 50); break;
        }
        return () => clearTimeout(timer);
    }, [phase, cycleDuration, pool.length]);

    const currentAd = pool[adIndex];
    if (phase === 'waiting' || !currentAd) return <div className="h-[140px] mb-6"></div>;

    const type = forcedType !== undefined ? forcedType : adIndex % 3;
    const isGrown = phase === 'blooming' || phase === 'displayed' || phase === 'withering';

    return (
        <div className="relative pl-8 mb-8 min-h-[140px] flex items-end">
            <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-emerald-900/50 to-transparent"></div>

            <div className="absolute left-0 bottom-0 w-24 h-[160px] flex flex-col justify-end items-center pointer-events-none z-0">
                 {phase === 'seed' && type === 0 && (
                     <div className="w-2 h-2 bg-emerald-200 rounded-full glow-dot-green absolute bottom-0 animate-seed-fall"></div>
                 )}
                 {type === 0 && <TreeGraphic grown={isGrown} />}
                 {type === 1 && <HouseGraphic grown={isGrown} />}
                 {type === 2 && <PumpGraphic grown={isGrown} />}
            </div>

            {(phase === 'blooming' || phase === 'displayed' || phase === 'withering') && (
                <div className={`glass-panel rounded-xl p-4 relative overflow-hidden group hover:bg-emerald-500/5 transition-all cursor-pointer w-full ml-10 z-10 origin-bottom-left ${phase === 'blooming' ? 'animate-ad-grow' : ''} ${phase === 'withering' ? 'animate-wither' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-white"><span className="text-xs font-semibold tracking-wide text-emerald-50">{currentAd.title}</span></div>
                        <span className="text-[9px] text-emerald-500/50 uppercase tracking-widest border border-emerald-500/20 px-1.5 py-0.5 rounded">Ad</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-light">{currentAd.subtitle}</p>
                </div>
            )}
        </div>
    );
}