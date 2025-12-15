"use client";
import React, { useState, useEffect, memo } from 'react';

interface Ad {
    title: string;
    subtitle: string;
}

// ==========================================
// 1. COMPOSANTS GRAPHIQUES (NOUVEAUX DESIGNS)
// ==========================================

/* --- ARBRE (Inchangé, il est bien) --- */
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

/* --- NOUVELLE MAISON (Couleurs chaudes) --- */
const HouseGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            {/* Dégradé Murs (Terracotta) */}
            <linearGradient id="wallGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#7c2d12" /> {/* Dark brick */}
                <stop offset="100%" stopColor="#c2410c" /> {/* Orange brick */}
            </linearGradient>
            {/* Dégradé Toit (Ardoise bleutée) */}
            <linearGradient id="roofGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1e293b" /> {/* Slate dark */}
                <stop offset="100%" stopColor="#475569" /> {/* Slate light */}
            </linearGradient>
             <filter id="windowGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>
        
        {/* BASE / MURS */}
        <g className="house-base">
            <path d="M25 80 H75 V130 H25 Z" stroke="url(#wallGradient)" strokeWidth="3" fill="url(#wallGradient)" className="house-fill" />
        </g>
        
        {/* TOIT */}
        <g className="house-roof">
            <path d="M20 80 L50 50 L80 80" stroke="url(#roofGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
             {/* Cheminée */}
            <path d="M65 65 V55 H75 V75" stroke="url(#wallGradient)" strokeWidth="3" fill="url(#wallGradient)" className="house-fill" style={{ animationDelay: '0.2s' }}/>
        </g>
        
        {/* PORTE (Bois) */}
        <rect x="42" y="105" width="16" height="25" rx="1" fill="#78350f" className="house-pop" style={{ animationDelay: '1s' }} />
        
        {/* FENÊTRES LUMINEUSES */}
        <g filter="url(#windowGlow)">
            <rect x="33" y="92" width="12" height="12" rx="1" fill="#fde68a" className="house-pop" style={{ animationDelay: '1.2s' }} />
            <rect x="55" y="92" width="12" height="12" rx="1" fill="#fde68a" className="house-pop" style={{ animationDelay: '1.3s' }} />
        </g>
    </svg>
));
HouseGraphic.displayName = 'HouseGraphic';

/* --- NOUVEAU ROBINET (Laiton/Doré élégant) --- */
const PumpGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            {/* Dégradé Laiton/Or */}
            <linearGradient id="brassGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#b45309" /> {/* Dark bronze */}
                <stop offset="50%" stopColor="#f59e0b" /> {/* Gold */}
                <stop offset="100%" stopColor="#d97706" /> {/* Amber */}
            </linearGradient>
            <filter id="glowWater" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>
        
        {/* CORPS DU ROBINET */}
        <g className="pump-body">
            {/* Poteau vertical */}
            <rect x="42" y="70" width="8" height="70" fill="url(#brassGradient)" rx="2" />
            {/* Bec verseur courbe */}
            <path d="M46 75 V 60 Q 46 45 25 55" fill="none" stroke="url(#brassGradient)" strokeWidth="6" strokeLinecap="round" />
             {/* Embout du bec */}
            <circle cx="25" cy="55" r="4" fill="url(#brassGradient)" />
        </g>

        {/* POIGNÉE EN CROIX (Tourne) */}
        <g className="pump-body">
             <g className="pump-handle-spin-anchor" style={{ transformOrigin: '46px 58px' }}>
                <path d="M36 58 H56 M46 48 V68" stroke="url(#brassGradient)" strokeWidth="4" strokeLinecap="round" className="pump-handle" />
                <circle cx="46" cy="58" r="3" fill="#78350f" />
            </g>
        </g>
        
        {/* GOUTTE D'EAU */}
        <g filter="url(#glowWater)">
            <circle cx="25" cy="60" r="4" fill="#3b82f6" className="water-drop" />
        </g>
        
        {/* ONDULATIONS (Au sol) */}
        <g className="water-ripples">
            {/* Centre de l'onde ajusté sous le nouveau bec (x=25) */}
            <ellipse cx="25" cy="130" rx="15" ry="4" stroke="#3b82f6" strokeWidth="1" fill="none" className="ripple-1" />
            <ellipse cx="25" cy="130" rx="25" ry="6" stroke="#3b82f6" strokeWidth="1" fill="none" className="ripple-2" />
        </g>
    </svg>
));
PumpGraphic.displayName = 'PumpGraphic';


// ==========================================
// 2. COMPOSANT PRINCIPAL (LOGIQUE STABLE)
// ==========================================

export default function LivingAdSlot({ pool, initialDelay, cycleDuration = 9000, variantOffset = 0 }: { pool: Ad[], initialDelay: number, cycleDuration?: number, variantOffset?: number }) {
    const [adIndex, setAdIndex] = useState(0);
    const [phase, setPhase] = useState('waiting');
    
    useEffect(() => {
        setAdIndex(Math.floor(Math.random() * pool.length));
        const t = setTimeout(() => setPhase('seed'), initialDelay);
        return () => clearTimeout(t);
    }, [initialDelay]);

    useEffect(() => {
        if (phase === 'waiting') return;
        let timer: NodeJS.Timeout;
        switch (phase) {
            case 'seed': timer = setTimeout(() => setPhase('growing'), 100); break;
            case 'growing': timer = setTimeout(() => setPhase('blooming'), 1200); break;
            case 'blooming': timer = setTimeout(() => setPhase('displayed'), 600); break;
            case 'displayed': timer = setTimeout(() => setPhase('withering'), cycleDuration); break;
            case 'withering': timer = setTimeout(() => { setAdIndex((prev) => (prev + 1) % pool.length); setPhase('reset'); }, 600); break;
            case 'reset': timer = setTimeout(() => setPhase('seed'), 50); break;
        }
        return () => clearTimeout(timer);
    }, [phase, cycleDuration, pool.length]);

    const currentAd = pool[adIndex];
    if (phase === 'waiting' || !currentAd) return <div className="h-[140px] mb-6"></div>;

    const type = (adIndex + variantOffset) % 3;
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