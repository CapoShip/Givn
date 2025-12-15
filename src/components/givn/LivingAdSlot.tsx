"use client";
import React, { useState, useEffect, memo } from 'react';

interface Ad {
    title: string;
    subtitle: string;
}

// ==========================================
// 1. COMPOSANTS GRAPHIQUES (REDESIGN MODERNE)
// ==========================================

/* --- ARBRE (Inchangé car il fonctionnait bien) --- */
const TreeGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-all duration-500 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="treeGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="40%" stopColor="#10b981" />
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

/* --- MAISON "MODERN ECO-CABIN" --- */
const HouseGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="wallDark" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>
            <linearGradient id="accentWood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
        </defs>
        
        {/* Structure A-Frame (Triangle moderne) */}
        <path d="M50 40 L90 130 H10 L50 40 Z" fill="url(#wallDark)" stroke="#4b5563" strokeWidth="2" className="house-base" />
        
        {/* Grande Baie Vitrée (Triangle intérieur) */}
        <path d="M50 55 L80 125 H20 L50 55 Z" fill="#34d399" fillOpacity="0.1" stroke="#34d399" strokeWidth="1" className="house-fill" />
        
        {/* Poutres en bois (Détails) */}
        <path d="M50 40 L10 130" stroke="url(#accentWood)" strokeWidth="4" strokeLinecap="round" className="house-roof" />
        <path d="M50 40 L90 130" stroke="url(#accentWood)" strokeWidth="4" strokeLinecap="round" className="house-roof" />
        
        {/* Lumière intérieure */}
        <circle cx="50" cy="100" r="8" fill="#fcd34d" className="house-pop" style={{ animationDelay: '1s', filter: 'blur(4px)' }} />
        <circle cx="50" cy="100" r="4" fill="#fff" className="house-pop" style={{ animationDelay: '1s' }} />
    </svg>
));
HouseGraphic.displayName = 'HouseGraphic';

/* --- ROBINET "CLEAN WATER" (Minimaliste) --- */
const PumpGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="pipeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <filter id="waterGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>
        
        {/* Tuyau principal (Sort du sol) */}
        <rect x="45" y="60" width="10" height="80" fill="url(#pipeGradient)" className="pump-body" />
        
        {/* Tête du robinet */}
        <path d="M40 60 H60 V50 C60 45 55 40 50 40 C45 40 40 45 40 50 Z" fill="url(#pipeGradient)" className="pump-body" />
        
        {/* Bec verseur (Courbe élégante) */}
        <path d="M45 55 H35 Q 25 55 25 70" stroke="url(#pipeGradient)" strokeWidth="6" fill="none" strokeLinecap="round" className="pump-body" />
        
        {/* Vanne (Roue sur le dessus) */}
        <rect x="42" y="35" width="16" height="4" rx="2" fill="#ef4444" className="pump-handle" />
        <rect x="48" y="32" width="4" height="10" rx="1" fill="#ef4444" className="pump-handle" />
        
        {/* Goutte d'eau */}
        <g filter="url(#waterGlow)">
            <path d="M25 75 Q 25 85 25 85 Q 21 82 25 75 Z" fill="#60a5fa" className="water-drop" />
            <circle cx="25" cy="80" r="3" fill="#3b82f6" className="water-drop" />
        </g>
        
        {/* Ondes (Ripples) */}
        <ellipse cx="25" cy="130" rx="12" ry="3" stroke="#3b82f6" strokeWidth="1.5" fill="none" className="ripple-1" />
        <ellipse cx="25" cy="130" rx="20" ry="5" stroke="#3b82f6" strokeWidth="1" fill="none" className="ripple-2" />
    </svg>
));
PumpGraphic.displayName = 'PumpGraphic';


// ==========================================
// 2. COMPOSANT PRINCIPAL (LOGIQUE STABILISÉE)
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
    forcedType?: number // 0=Tree, 1=House, 2=Pump
}) {
    const [adIndex, setAdIndex] = useState(0);
    const [phase, setPhase] = useState('waiting');
    
    // Initialisation
    useEffect(() => {
        setAdIndex(Math.floor(Math.random() * pool.length));
        const t = setTimeout(() => setPhase('seed'), initialDelay);
        return () => clearTimeout(t);
    }, [initialDelay]);

    // Cycle Loop
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

    // Si forcedType est défini, on l'utilise. Sinon on utilise l'index.
    const type = forcedType !== undefined ? forcedType : adIndex % 3;
    const isGrown = phase === 'blooming' || phase === 'displayed' || phase === 'withering';

    return (
        <div className="relative pl-8 mb-8 min-h-[140px] flex items-end">
            <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-emerald-900/50 to-transparent"></div>

            <div className="absolute left-0 bottom-0 w-24 h-[160px] flex flex-col justify-end items-center pointer-events-none z-0">
                 {/* Seed only for Tree (0) */}
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