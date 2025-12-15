"use client";
import React, { useState, useEffect, memo } from 'react';

// Mise à jour des types possibles
export type AdType = 'tree' | 'house' | 'water' | 'school' | 'ocean' | 'health' | 'food' | 'energy';

export interface Ad {
    title: string;
    subtitle: string;
    type: AdType;
}

// ==========================================
// 1. COMPOSANTS GRAPHIQUES EXISTANTS
// ==========================================

/* --- 1. ARBRE (TREE) --- */
const TreeGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-all duration-500 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <path d="M50 140 C50 110 45 90 50 60 C52 45 48 30 50 10" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" className="tree-path" />
        <path d="M50 100 Q30 90 20 80" stroke="#059669" strokeWidth="3" fill="none" className="tree-path" style={{ animationDelay: '0.2s' }} strokeLinecap="round" />
        <path d="M50 90 Q70 80 80 70" stroke="#059669" strokeWidth="3" fill="none" className="tree-path" style={{ animationDelay: '0.3s' }} strokeLinecap="round" />
        <path d="M48 60 Q30 50 25 40" stroke="#34d399" strokeWidth="2.5" fill="none" className="tree-path" style={{ animationDelay: '0.4s' }} strokeLinecap="round" />
        <path d="M52 50 Q70 40 75 30" stroke="#34d399" strokeWidth="2.5" fill="none" className="tree-path" style={{ animationDelay: '0.5s' }} strokeLinecap="round" />
        <path d="M50 30 Q40 20 35 10" stroke="url(#treeGradient)" strokeWidth="2" fill="none" className="tree-path" style={{ animationDelay: '0.6s' }} strokeLinecap="round" />
        <path d="M50 30 Q60 20 65 10" stroke="url(#treeGradient)" strokeWidth="2" fill="none" className="tree-path" style={{ animationDelay: '0.6s' }} strokeLinecap="round" />
        <g>
            <circle cx="20" cy="80" r="4" fill="#34d399" className="leaf" style={{ animationDelay: '0.8s' }} />
            <circle cx="80" cy="70" r="4" fill="#34d399" className="leaf" style={{ animationDelay: '0.9s' }} />
            <circle cx="50" cy="10" r="5" fill="#10b981" className="leaf" style={{ animationDelay: '1.3s' }} />
        </g>
    </svg>
));
TreeGraphic.displayName = 'TreeGraphic';

/* --- 2. MAISON (HOUSE) --- */
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
        <g className="house-base">
            <rect x="25" y="70" width="50" height="50" fill="url(#wallWhite)" stroke="#94a3b8" strokeWidth="1" className="house-fill" />
        </g>
        <g className="house-roof">
            <path d="M15 70 L50 35 L85 70" fill="url(#roofDark)" stroke="#0f172a" strokeWidth="1" strokeLinejoin="round" />
            <rect x="65" y="45" width="8" height="15" fill="#475569" className="house-fill" />
        </g>
        <rect x="43" y="95" width="14" height="25" fill="#78350f" className="house-pop" style={{ animationDelay: '1s' }} />
        <rect x="30" y="80" width="10" height="10" fill="#93c5fd" className="house-pop" style={{ animationDelay: '1.2s' }} />
        <rect x="60" y="80" width="10" height="10" fill="#93c5fd" className="house-pop" style={{ animationDelay: '1.3s' }} />
    </svg>
));
HouseGraphic.displayName = 'HouseGraphic';

/* --- 3. ROBINET (WATER) --- */
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
        <g className="pump-body">
            <rect x="45" y="50" width="10" height="90" fill="url(#metalPipe)" rx="1" />
            <path d="M45 60 H 30 Q 25 60 25 70" stroke="url(#metalPipe)" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M45 50 L 60 40" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" className="pump-handle" />
            <circle cx="60" cy="40" r="3" fill="#b91c1c" className="pump-handle" />
        </g>
        <g filter="url(#glowWater)">
            <circle cx="25" cy="75" r="4" fill="#3b82f6" className="water-drop" />
        </g>
        <g className="water-ripples">
            <ellipse cx="25" cy="135" rx="12" ry="3" stroke="#3b82f6" strokeWidth="1" fill="none" className="ripple-1" />
            <ellipse cx="25" cy="135" rx="20" ry="5" stroke="#3b82f6" strokeWidth="1" fill="none" className="ripple-2" />
        </g>
    </svg>
));
PumpGraphic.displayName = 'PumpGraphic';

/* --- 4. ÉCOLE (SCHOOL) --- */
const SchoolGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="schoolBrick" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
        </defs>
        <g className="house-base">
            <rect x="15" y="70" width="70" height="50" fill="url(#schoolBrick)" stroke="#78350f" strokeWidth="1" className="house-fill" />
            <rect x="40" y="90" width="20" height="30" fill="#fcd34d" className="house-fill" style={{ opacity: 0.5 }} />
        </g>
        <g className="house-roof">
            <path d="M10 70 L50 40 L90 70" fill="#374151" stroke="#1f2937" strokeWidth="1" />
            <rect x="42" y="30" width="16" height="20" fill="#fcd34d" />
            <path d="M40 30 L50 15 L60 30" fill="#374151" />
            <circle cx="50" cy="40" r="4" fill="#fff" />
        </g>
        <g className="school-flag">
            <line x1="85" y1="70" x2="85" y2="20" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M85 20 L 100 25 L 85 30" fill="#ef4444" className="flag-banner" />
        </g>
        <rect x="20" y="80" width="12" height="15" fill="#93c5fd" className="house-pop" style={{ animationDelay: '1s' }} />
        <rect x="68" y="80" width="12" height="15" fill="#93c5fd" className="house-pop" style={{ animationDelay: '1.2s' }} />
    </svg>
));
SchoolGraphic.displayName = 'SchoolGraphic';

/* --- 5. OCÉAN (OCEAN) --- */
const OceanGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="coralGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#be123c" />
                <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
        </defs>
        <path d="M50 140 C 50 120 40 110 30 100" stroke="url(#coralGradient)" strokeWidth="4" fill="none" strokeLinecap="round" className="coral-branch" />
        <path d="M50 130 C 50 110 60 90 70 80" stroke="url(#coralGradient)" strokeWidth="4" fill="none" strokeLinecap="round" className="coral-branch" style={{ animationDelay: '0.2s' }} />
        <path d="M30 100 C 20 90 25 80 35 70" stroke="url(#coralGradient)" strokeWidth="3" fill="none" strokeLinecap="round" className="coral-branch" style={{ animationDelay: '0.4s' }} />
        <circle cx="30" cy="90" r="2" fill="#60a5fa" className="ocean-bubble" style={{ animationDelay: '1s' }} />
        <circle cx="60" cy="70" r="3" fill="#60a5fa" className="ocean-bubble" style={{ animationDelay: '1.5s' }} />
        <circle cx="45" cy="50" r="2" fill="#60a5fa" className="ocean-bubble" style={{ animationDelay: '2s' }} />
    </svg>
));
OceanGraphic.displayName = 'OceanGraphic';

// ==========================================
// NOUVEAUX GRAPHISMES
// ==========================================

/* --- 6. SANTÉ (HEALTH) --- */
const HealthGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <filter id="glowHeart" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>
        
        {/* Support médical */}
        <rect x="48" y="100" width="4" height="40" fill="#cbd5e1" className="house-base" />
        
        {/* Cœur qui bat */}
        <g className="heart-beat" filter="url(#glowHeart)">
            <path d="M50 110 C 20 90 20 60 50 40 C 80 60 80 90 50 110 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" className="heart-draw" />
        </g>
        
        {/* Croix médicale */}
        <g className="house-pop" style={{ animationDelay: '0.8s' }}>
            <rect x="42" y="65" width="16" height="6" fill="white" rx="1" />
            <rect x="47" y="60" width="6" height="16" fill="white" rx="1" />
        </g>
        
        {/* Lignes de vie ECG */}
        <path d="M10 80 H 30 L 35 70 L 40 90 L 45 80" stroke="#ef4444" strokeWidth="2" fill="none" strokeLinecap="round" className="coral-branch" style={{ animationDelay: '1.2s' }} />
        <path d="M90 80 H 70 L 65 90 L 60 70 L 55 80" stroke="#ef4444" strokeWidth="2" fill="none" strokeLinecap="round" className="coral-branch" style={{ animationDelay: '1.4s' }} />
    </svg>
));
HealthGraphic.displayName = 'HealthGraphic';

/* --- 7. FAIM (FOOD/WHEAT) --- */
const FoodGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        {/* Tiges */}
        <path d="M50 140 Q 50 100 50 60" stroke="#eab308" strokeWidth="2" fill="none" className="wheat-grow" />
        <path d="M50 140 Q 30 100 30 70" stroke="#ca8a04" strokeWidth="2" fill="none" className="wheat-grow" style={{ animationDelay: '0.2s' }} />
        <path d="M50 140 Q 70 100 70 70" stroke="#ca8a04" strokeWidth="2" fill="none" className="wheat-grow" style={{ animationDelay: '0.4s' }} />
        
        {/* Épis de blé (Ondulent) */}
        <g className="wheat-sway" style={{ transformOrigin: '50px 60px' }}>
            <ellipse cx="50" cy="50" rx="4" ry="8" fill="#facc15" stroke="#a16207" strokeWidth="1" />
            <ellipse cx="50" cy="38" rx="4" ry="8" fill="#facc15" stroke="#a16207" strokeWidth="1" />
            <ellipse cx="50" cy="26" rx="3" ry="6" fill="#facc15" stroke="#a16207" strokeWidth="1" />
        </g>
        
        <g className="wheat-sway" style={{ transformOrigin: '30px 70px', animationDelay: '0.5s' }}>
            <ellipse cx="30" cy="60" rx="4" ry="8" fill="#eab308" stroke="#854d0e" strokeWidth="1" />
            <ellipse cx="30" cy="48" rx="3" ry="6" fill="#eab308" stroke="#854d0e" strokeWidth="1" />
        </g>
        
        <g className="wheat-sway" style={{ transformOrigin: '70px 70px', animationDelay: '1s' }}>
            <ellipse cx="70" cy="60" rx="4" ry="8" fill="#eab308" stroke="#854d0e" strokeWidth="1" />
            <ellipse cx="70" cy="48" rx="3" ry="6" fill="#eab308" stroke="#854d0e" strokeWidth="1" />
        </g>
    </svg>
));
FoodGraphic.displayName = 'FoodGraphic';

/* --- 8. ÉNERGIE (ENERGY/WIND) --- */
const EnergyGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="turbineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
        </defs>
        
        {/* Mât de l'éolienne */}
        <rect x="48" y="50" width="4" height="90" fill="url(#turbineGrad)" className="house-base" />
        
        {/* Soleil en fond */}
        <circle cx="20" cy="30" r="12" fill="#fcd34d" className="house-pop" style={{ animationDelay: '1.5s' }} />
        
        {/* Pales qui tournent */}
        <g className="turbine-spin" style={{ transformOrigin: '50px 50px' }}>
            <circle cx="50" cy="50" r="3" fill="#64748b" />
            <path d="M50 50 L 50 10 Q 60 10 50 50" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            <path d="M50 50 L 85 70 Q 80 80 50 50" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            <path d="M50 50 L 15 70 Q 20 80 50 50" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        </g>
        
        {/* Petite éolienne au loin */}
        <g style={{ opacity: 0.6 }}>
            <rect x="80" y="80" width="2" height="60" fill="#94a3b8" className="house-base" style={{ animationDelay: '0.5s' }} />
            <g className="turbine-spin" style={{ transformOrigin: '81px 80px', animationDuration: '3s' }}>
                <path d="M81 80 L 81 60 Q 85 60 81 80" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
                <path d="M81 80 L 98 90 Q 95 95 81 80" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
                <path d="M81 80 L 64 90 Q 67 95 81 80" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
            </g>
        </g>
    </svg>
));
EnergyGraphic.displayName = 'EnergyGraphic';


// ==========================================
// 2. COMPOSANT PRINCIPAL
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

    // Détermination du type d'animation
    let graphicType = currentAd.type;
    // Si le type n'est pas défini (compatibilité), on utilise le fallback
    if (!graphicType) {
        const types: AdType[] = ['tree', 'house', 'water', 'school', 'ocean', 'health', 'food', 'energy'];
        graphicType = types[(adIndex + (forcedType || 0)) % types.length];
    }

    const isGrown = phase === 'blooming' || phase === 'displayed' || phase === 'withering';

    return (
        <div className="relative pl-8 mb-8 min-h-[140px] flex items-end">
            <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-emerald-900/50 to-transparent"></div>

            <div className="absolute left-0 bottom-0 w-24 h-[160px] flex flex-col justify-end items-center pointer-events-none z-0">
                 {/* Animation graine pour les plantes et bâtiments */}
                 {phase === 'seed' && (['tree','house','school','food','energy'].includes(graphicType)) && (
                     <div className="w-2 h-2 bg-emerald-200 rounded-full glow-dot-green absolute bottom-0 animate-seed-fall"></div>
                 )}
                 
                 {graphicType === 'tree' && <TreeGraphic grown={isGrown} />}
                 {graphicType === 'house' && <HouseGraphic grown={isGrown} />}
                 {graphicType === 'water' && <PumpGraphic grown={isGrown} />}
                 {graphicType === 'school' && <SchoolGraphic grown={isGrown} />}
                 {graphicType === 'ocean' && <OceanGraphic grown={isGrown} />}
                 {graphicType === 'health' && <HealthGraphic grown={isGrown} />}
                 {graphicType === 'food' && <FoodGraphic grown={isGrown} />}
                 {graphicType === 'energy' && <EnergyGraphic grown={isGrown} />}
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