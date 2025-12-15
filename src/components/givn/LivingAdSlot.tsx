"use client";
import React, { useState, useEffect, memo } from 'react';

export type AdType = 'tree' | 'house' | 'water' | 'school' | 'ocean' | 'health' | 'food' | 'energy';

export interface Ad {
    title: string;
    subtitle: string;
    type: AdType;
}

// ==========================================
// 1. COMPOSANTS GRAPHIQUES (MODERNISÉS)
// ==========================================

/* --- ARBRE (Inchangé) --- */
const TreeGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-all duration-500 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <path d="M50 140 C50 110 45 90 50 60 C52 45 48 30 50 10" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" className="tree-path" />
        <path d="M50 100 Q30 90 20 80" stroke="#059669" strokeWidth="3" fill="none" className="tree-path" style={{ animationDelay: '0.2s' }} strokeLinecap="round" />
        <path d="M50 90 Q70 80 80 70" stroke="#059669" strokeWidth="3" fill="none" className="tree-path" style={{ animationDelay: '0.3s' }} strokeLinecap="round" />
        <path d="M48 60 Q30 50 25 40" stroke="#34d399" strokeWidth="2.5" fill="none" className="tree-path" style={{ animationDelay: '0.4s' }} strokeLinecap="round" />
        <path d="M52 50 Q70 40 75 30" stroke="#34d399" strokeWidth="2.5" fill="none" className="tree-path" style={{ animationDelay: '0.5s' }} strokeLinecap="round" />
        <path d="M50 30 Q40 20 35 10" stroke="#34d399" strokeWidth="2" fill="none" className="tree-path" style={{ animationDelay: '0.6s' }} strokeLinecap="round" />
        <g>
            <circle cx="20" cy="80" r="4" fill="#34d399" className="leaf" style={{ animationDelay: '0.8s' }} />
            <circle cx="80" cy="70" r="4" fill="#34d399" className="leaf" style={{ animationDelay: '0.9s' }} />
            <circle cx="50" cy="10" r="5" fill="#10b981" className="leaf" style={{ animationDelay: '1.3s' }} />
        </g>
    </svg>
));
TreeGraphic.displayName = 'TreeGraphic';

/* --- MAISON (Inchangé) --- */
const HouseGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <g className="house-base">
            <rect x="25" y="70" width="50" height="50" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" className="house-fill" />
        </g>
        <g className="house-roof">
            <path d="M15 70 L50 35 L85 70" fill="#1e293b" stroke="#0f172a" strokeWidth="1" strokeLinejoin="round" />
            <rect x="65" y="45" width="8" height="15" fill="#475569" className="house-fill" />
        </g>
        <rect x="43" y="95" width="14" height="25" fill="#78350f" className="house-pop" style={{ animationDelay: '1s' }} />
        <rect x="30" y="80" width="10" height="10" fill="#93c5fd" className="house-pop" style={{ animationDelay: '1.2s' }} />
        <rect x="60" y="80" width="10" height="10" fill="#93c5fd" className="house-pop" style={{ animationDelay: '1.3s' }} />
    </svg>
));
HouseGraphic.displayName = 'HouseGraphic';

/* --- ROBINET (Version améliorée précédente) --- */
const PumpGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="waterStreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
        </defs>
        <g className="pump-body">
            <rect x="42" y="50" width="16" height="90" fill="#64748b" rx="2" />
            <path d="M42 65 H 25 Q 15 65 15 80" stroke="#64748b" strokeWidth="10" fill="none" strokeLinecap="round" />
            <g className="origin-[42px_50px] animate-pump-handle">
                <path d="M42 50 L 65 35" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
                <circle cx="65" cy="35" r="4" fill="#b91c1c" />
            </g>
        </g>
        <g className={grown ? 'opacity-100' : 'opacity-0 transition-opacity delay-500'}>
            <path d="M15 80 L 15 135" stroke="url(#waterStreamGrad)" strokeWidth="6" fill="none" className="animate-water-flow" strokeDasharray="5,5" />
            <circle cx="15" cy="80" r="3" fill="#3b82f6" className="animate-drop-fall" style={{ animationDelay: '0s' }} />
            <circle cx="15" cy="80" r="3" fill="#3b82f6" className="animate-drop-fall" style={{ animationDelay: '0.5s' }} />
            <circle cx="15" cy="80" r="3" fill="#3b82f6" className="animate-drop-fall" style={{ animationDelay: '1.0s' }} />
            <g className="water-ripples" transform="translate(15, 135)">
                <ellipse cx="0" cy="0" rx="10" ry="3" stroke="#3b82f6" strokeWidth="1.5" fill="none" className="animate-ripple" style={{ animationDelay: '0s' }}/>
                <ellipse cx="0" cy="0" rx="15" ry="4" stroke="#3b82f6" strokeWidth="1" fill="none" className="animate-ripple" style={{ animationDelay: '0.4s' }}/>
            </g>
        </g>
    </svg>
));
PumpGraphic.displayName = 'PumpGraphic';

/* --- ÉCOLE (Inchangé) --- */
const SchoolGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <g className="house-base">
            <rect x="15" y="70" width="70" height="50" fill="#9a3412" stroke="#7c2d12" strokeWidth="1" className="house-fill" />
            <rect x="40" y="90" width="20" height="30" fill="#fcd34d" className="house-fill" style={{ opacity: 0.3 }} />
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

/* --- OCÉAN (Version améliorée précédente) --- */
const OceanGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="oceanBg" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0c4a6e" /> 
                <stop offset="100%" stopColor="#075985" /> 
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <rect x="0" y="0" width="100" height="140" fill="url(#oceanBg)" opacity="0.8" rx="12" />
        <g className="kelp-sway" filter="url(#glow)">
             <path d="M30 140 Q 20 110 35 70" stroke="#67e8f9" strokeWidth="4" fill="none" strokeLinecap="round" />
             <path d="M70 140 Q 80 120 65 80" stroke="#22d3ee" strokeWidth="4" fill="none" strokeLinecap="round" style={{ animationDelay: '0.3s' }} />
             <path d="M50 140 Q 40 100 55 50" stroke="#a5f3fc" strokeWidth="3" fill="none" strokeLinecap="round" style={{ animationDelay: '0.6s' }} />
        </g>
        <g filter="url(#glow)">
            <circle cx="40" cy="90" r="4" fill="#fff" className="ocean-bubble-rise" style={{ animationDelay: '0.5s' }} />
            <circle cx="65" cy="70" r="3" fill="#cffafe" className="ocean-bubble-rise" style={{ animationDelay: '1.2s' }} />
            <circle cx="55" cy="30" r="5" fill="#fff" className="ocean-bubble-rise" style={{ animationDelay: '2s', opacity: 0.9 }} />
             <circle cx="20" cy="120" r="2" fill="#cffafe" className="ocean-bubble-rise" style={{ animationDelay: '0.2s', animationDuration: '3s' }} />
        </g>
    </svg>
));
OceanGraphic.displayName = 'OceanGraphic';

/* --- SANTÉ (NOUVEAU LOOK HOLOGRAPHIQUE) --- */
const HealthGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" /> {/* Emerald */}
                <stop offset="50%" stopColor="#22d3ee" /> {/* Cyan */}
                <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
             <filter id="ecgGlow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
        </defs>
        
        {/* Arrière-plan grille holographique */}
        <rect x="5" y="40" width="90" height="60" rx="4" fill="url(#grid)" className="house-base" opacity="0.5" />
        <rect x="5" y="40" width="90" height="60" rx="4" stroke="url(#ecgGrad)" strokeWidth="1" fill="none" opacity="0.3" />

        {/* Ligne ECG lumineuse */}
        <g filter="url(#ecgGlow)">
             <path d="M10 70 H 30 L 35 50 L 45 90 L 50 70 H 70 L 75 60 L 85 80 L 90 70 H 100" stroke="url(#ecgGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="ecg-line" />
        </g>
        
        {/* Point lumineux qui suit le tracé */}
        <circle r="3" fill="#ccfbf1" className="ecg-blip" filter="url(#ecgGlow)">
             <animateMotion dur="2s" repeatCount="indefinite" path="M10 70 H 30 L 35 50 L 45 90 L 50 70 H 70 L 75 60 L 85 80 L 90 70 H 100" />
        </circle>
    </svg>
));
HealthGraphic.displayName = 'HealthGraphic';

/* --- NOURRITURE (Inchangé) --- */
const FoodGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <g className="wheat-stem">
            <path d="M50 140 Q 50 100 50 60" stroke="#a16207" strokeWidth="3" fill="none" />
            <path d="M25 140 Q 30 110 30 70" stroke="#854d0e" strokeWidth="2.5" fill="none" style={{ animationDelay: '0.2s' }} />
            <path d="M75 140 Q 70 110 70 70" stroke="#854d0e" strokeWidth="2.5" fill="none" style={{ animationDelay: '0.4s' }} />
        </g>
        <g className="wheat-head" style={{ transformOrigin: '50px 60px' }}>
            <ellipse cx="50" cy="45" rx="6" ry="18" fill="#eab308" />
            <path d="M50 27 L 50 15 M 46 30 L 42 20 M 54 30 L 58 20" stroke="#fde047" strokeWidth="1" />
        </g>
        <g className="wheat-head" style={{ transformOrigin: '30px 70px', animationDelay: '0.2s' }}>
            <ellipse cx="30" cy="55" rx="5" ry="15" fill="#ca8a04" />
            <path d="M30 40 L 28 30 M 26 45 L 22 35" stroke="#fde047" strokeWidth="1" />
        </g>
        <g className="wheat-head" style={{ transformOrigin: '70px 70px', animationDelay: '0.4s' }}>
            <ellipse cx="70" cy="55" rx="5" ry="15" fill="#ca8a04" />
            <path d="M70 40 L 72 30 M 74 45 L 78 35" stroke="#fde047" strokeWidth="1" />
        </g>
        <circle cx="40" cy="40" r="1.5" fill="#fff" className="ocean-bubble-rise" style={{ animationDuration: '4s' }} />
        <circle cx="60" cy="30" r="1" fill="#fff" className="ocean-bubble-rise" style={{ animationDuration: '5s', animationDelay: '1s' }} />
    </svg>
));
FoodGraphic.displayName = 'FoodGraphic';

/* --- ÉNERGIE (NOUVEAU LOOK TURBINE FUTURISTE) --- */
const EnergyGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="towerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#334155" />
            </linearGradient>
             <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <filter id="bladeGlow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* Tour détaillée */}
        <g className="house-base">
            <path d="M45 140 L 48 45 L 52 45 L 55 140 Z" fill="url(#towerGrad)" />
            {/* Détails de structure */}
            <line x1="46" y1="120" x2="54" y2="120" stroke="#1e293b" strokeWidth="0.5" />
            <line x1="47" y1="90" x2="53" y2="90" stroke="#1e293b" strokeWidth="0.5" />
            <line x1="47.5" y1="60" x2="52.5" y2="60" stroke="#1e293b" strokeWidth="0.5" />
        </g>

        {/* Nacelle lumineuse */}
        <circle cx="50" cy="45" r="5" fill="#0d9488" className="house-pop" style={{ animationDelay: '1.2s' }}>
             <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Rotor et Pales futuristes */}
        <g className="turbine-spin-fast" style={{transformOrigin: '50px 45px'}}>
            <circle cx="50" cy="45" r="3" fill="#cbd5e1" />
            {/* Pale 1 */}
            <path d="M50 45 L 46 15 Q 50 5 54 15 Z" fill="url(#bladeGrad)" stroke="#2dd4bf" strokeWidth="0.5" filter="url(#bladeGlow)" />
            {/* Pale 2 (rotation 120deg) */}
            <g transform="rotate(120, 50, 45)">
                <path d="M50 45 L 46 15 Q 50 5 54 15 Z" fill="url(#bladeGrad)" stroke="#2dd4bf" strokeWidth="0.5" filter="url(#bladeGlow)" />
            </g>
            {/* Pale 3 (rotation 240deg) */}
             <g transform="rotate(240, 50, 45)">
                <path d="M50 45 L 46 15 Q 50 5 54 15 Z" fill="url(#bladeGrad)" stroke="#2dd4bf" strokeWidth="0.5" filter="url(#bladeGlow)" />
            </g>
        </g>
        
        {/* Particules d'énergie */}
         <circle cx="50" cy="45" r="2" fill="#2dd4bf" className="ocean-bubble-rise" style={{ animationDelay: '2s', opacity: 0.6 }} />
    </svg>
));
EnergyGraphic.displayName = 'EnergyGraphic';


// ==========================================
// 2. COMPOSANT PRINCIPAL (Inchangé)
// ==========================================

export default function LivingAdSlot({ 
    pool, 
    initialDelay, 
    cycleDuration, 
    startIndex = 0 
}: { 
    pool: Ad[], 
    initialDelay: number, 
    cycleDuration: number,
    startIndex?: number 
}) {
    const [adIndex, setAdIndex] = useState(startIndex % pool.length);
    const [phase, setPhase] = useState('waiting');
    
    useEffect(() => {
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

    const graphicType = currentAd.type;
    const isGrown = phase === 'blooming' || phase === 'displayed' || phase === 'withering';
    const isGrowType = ['tree','house','school','food','energy','health','ocean'].includes(graphicType);

    return (
        <div className="relative pl-8 mb-8 min-h-[140px] flex items-end">
            <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-emerald-900/50 to-transparent"></div>

            <div className="absolute left-0 bottom-0 w-24 h-[160px] flex flex-col justify-end items-center pointer-events-none z-0">
                 {phase === 'seed' && isGrowType && (
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