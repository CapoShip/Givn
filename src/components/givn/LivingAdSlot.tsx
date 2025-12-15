"use client";
import React, { useState, useEffect, memo } from 'react';

export type AdType = 'tree' | 'house' | 'water' | 'school' | 'ocean' | 'health' | 'food' | 'energy';

export interface Ad {
    title: string;
    subtitle: string;
    type: AdType;
}

// ==========================================
// COMPOSANTS GRAPHIQUES "ULTRA WOW"
// ==========================================

/* --- ARBRE DE VIE (Feuilles qui tombent, Lueur mystique) --- */
const TreeGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 160" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-all duration-700 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="trunkGrad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#022c22" />
                <stop offset="50%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#022c22" />
            </linearGradient>
            
            <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <filter id="innerGlow">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k2="1.2" k3="-0.8" result="edge"/>
                 <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="edge" /></feMerge>
            </filter>
        </defs>

        {/* 1. Tronc solide */}
        <path d="M46 160 L 48 110 Q 50 100 52 110 L 54 160 Q 50 165 46 160 Z" fill="url(#trunkGrad)" className="tree-trunk-grow" />
        
        {/* Conteneur feuillage animé */}
        <g className="tree-crown-sway">
             {/* 2. Branches */}
            <g fill="none" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round">
                <path d="M50 110 Q 40 100 30 105" className="tree-branch" style={{animationDelay: '0.8s'}} />
                <path d="M50 110 Q 60 100 70 105" className="tree-branch" style={{animationDelay: '0.9s'}} />
                <path d="M50 110 Q 50 90 50 70" className="tree-branch" style={{animationDelay: '1.0s'}} />
            </g>

            {/* 3. Nuages de feuilles */}
            <g fill="url(#leafGrad)" filter="url(#innerGlow)">
                 <ellipse cx="30" cy="100" rx="15" ry="12" className="leaf-cloud" style={{animationDelay: '1.2s'}} />
                 <ellipse cx="70" cy="100" rx="15" ry="12" className="leaf-cloud" style={{animationDelay: '1.4s'}} />
                 <ellipse cx="50" cy="70" rx="20" ry="18" className="leaf-cloud" style={{animationDelay: '1.6s'}} />
                 <circle cx="50" cy="55" r="10" className="leaf-cloud" style={{animationDelay: '1.8s'}} />
            </g>
        </g>

        {/* 4. Feuilles qui tombent (Ajout V3) */}
        <g className={grown ? 'opacity-100' : 'opacity-0'}>
             <path d="M40 90 Q 45 95 40 100" stroke="#34d399" strokeWidth="1" fill="none" className="falling-leaf" style={{animationDelay: '3s'}} />
             <path d="M60 80 Q 55 85 60 90" stroke="#10b981" strokeWidth="1" fill="none" className="falling-leaf" style={{animationDelay: '5s', animationDuration: '7s'}} />
        </g>

        {/* 5. Lucioles */}
        <g className={grown ? 'opacity-100' : 'opacity-0'}>
             <circle r="1" fill="#34d399" className="firefly" style={{animationDelay: '2s', cx: '40', cy: '80'}} />
             <circle r="1.5" fill="#10b981" className="firefly" style={{animationDelay: '3s', cx: '60', cy: '60'}} />
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

/* --- ROBINET (Inchangé) --- */
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

/* --- OCÉAN ABYSSAL (Bio-luminescence & Caustiques) --- */
const OceanGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-500 ${grown ? 'opacity-100' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="deepSeaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#020617" /> 
                <stop offset="50%" stopColor="#082f49" /> 
                <stop offset="100%" stopColor="#0c4a6e" /> 
            </linearGradient>
            <linearGradient id="jellyBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ccfbf1" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.4"/>
            </linearGradient>
             <filter id="bioGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>

        <rect x="0" y="0" width="100" height="160" fill="url(#deepSeaGrad)" />

        {/* 1. Banc de poissons (Arrière-plan) */}
        <g className="fish-school" opacity="0.3">
            <path d="M0 0 L5 2 L0 4 Z" fill="#7dd3fc" transform="translate(0, 40)" />
            <path d="M0 0 L4 1.5 L0 3 Z" fill="#7dd3fc" transform="translate(10, 45)" />
            <path d="M0 0 L6 2.5 L0 5 Z" fill="#7dd3fc" transform="translate(-5, 35)" />
        </g>

        {/* 2. Rayons de lumière (Caustiques) */}
        <g className="ocean-light-rays" opacity="0.3">
            <path d="M-10 -20 L 30 160 L 50 160 L 10 -20 Z" fill="#fff" opacity="0.1" />
            <path d="M20 -20 L 70 160 L 90 160 L 40 -20 Z" fill="#fff" opacity="0.1" style={{animationDelay:'1s'}} />
        </g>
        
        {/* 3. Méduse Bio-luminescente */}
        <g className="jellyfish-swim">
            <g className="jellyfish-bell-pulse">
                <path d="M 30 90 Q 50 60 70 90 L 68 95 Q 50 85 32 95 Z" fill="url(#jellyBody)" filter="url(#bioGlow)" />
                {/* Organes internes qui clignotent (Bio-luminescence) */}
                <ellipse cx="50" cy="85" rx="10" ry="5" fill="#5eead4" opacity="0.6" filter="url(#bioGlow)" className="bio-electric" />
            </g>
            {/* Tentacules électriques */}
            <g className="jellyfish-tentacles bio-electric" fill="none" stroke="#5eead4" strokeWidth="1.5" strokeLinecap="round" filter="url(#bioGlow)">
                <path d="M 38 95 Q 35 110 40 125" className="tentacle-1" />
                <path d="M 46 95 Q 46 115 48 135" className="tentacle-2" />
                <path d="M 54 95 Q 54 115 52 135" className="tentacle-3" />
                <path d="M 62 95 Q 65 110 60 125" className="tentacle-4" />
            </g>
        </g>

        {/* 4. Bulles */}
        <g>
            <circle cx="20" cy="140" r="1.5" fill="#a5f3fc" className="bubble" style={{animationDelay: '0s'}} />
            <circle cx="60" cy="140" r="1" fill="#a5f3fc" className="bubble" style={{animationDelay: '1.5s'}} />
            <circle cx="85" cy="140" r="2" fill="#a5f3fc" className="bubble" style={{animationDelay: '2.8s'}} />
        </g>
    </svg>
));
OceanGraphic.displayName = 'OceanGraphic';

/* --- SANTÉ (Inchangé) --- */
const HealthGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="ecgRedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
             <filter id="ecgRedGlow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <pattern id="gridRed" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ef4444" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
        </defs>
        <rect x="5" y="40" width="90" height="60" rx="4" fill="url(#gridRed)" className="house-base" opacity="0.5" />
        <rect x="5" y="40" width="90" height="60" rx="4" stroke="url(#ecgRedGrad)" strokeWidth="1" fill="none" opacity="0.3" />
        <g filter="url(#ecgRedGlow)">
             <path d="M10 70 H 30 L 35 50 L 45 90 L 50 70 H 70 L 75 60 L 85 80 L 90 70 H 100" stroke="url(#ecgRedGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="ecg-line" />
        </g>
        <circle r="3" fill="#fda4af" className="ecg-blip" filter="url(#ecgRedGlow)">
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

/* --- ÉNERGIE "SOLAR PUNK" (Atmosphère, Flux d'énergie) --- */
const EnergyGraphic = memo(({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0" />
                <stop offset="100%" stopColor="#1e293b" stopOpacity="0.8" />
            </linearGradient>
        </defs>
        
        {/* Fond Ciel */}
        <rect x="0" y="0" width="100" height="140" fill="url(#skyGrad)" />

        {/* 1. Nuages dérivants */}
        <g className="cloud" style={{opacity: 0.4}}>
            <path d="M10 20 Q 20 10 30 20 T 50 20 T 60 30 L 10 30 Z" fill="#94a3b8" />
        </g>
        <g className="cloud" style={{opacity: 0.3, animationDelay: '-10s', transform: 'scale(0.8) translateY(10px)'}}>
            <path d="M-20 40 Q -10 30 0 40 T 20 40 L -20 50 Z" fill="#64748b" />
        </g>

        {/* Tour centrée */}
        <rect x="48" y="45" width="4" height="95" fill="#94a3b8" className="house-base" />
        
        {/* Cœur énergétique */}
        <circle cx="50" cy="45" r="5" fill="#fcd34d" className="house-pop" style={{ animationDelay: '1.2s' }} />
        
        {/* 2. Flux d'énergie (Particules qui s'échappent) - Ajout V3 */}
        <g className={grown ? 'opacity-100' : 'opacity-0'}>
            <circle r="1" fill="#fbbf24" cx="50" cy="45" className="energy-particle" />
            <circle r="1.5" fill="#fbbf24" cx="50" cy="45" className="energy-particle" style={{animationDelay: '0.3s', transformOrigin: '50px 45px', transform: 'rotate(45deg)'}} />
            <circle r="1" fill="#fff" cx="50" cy="45" className="energy-particle" style={{animationDelay: '0.6s', transformOrigin: '50px 45px', transform: 'rotate(-45deg)'}} />
        </g>

        {/* 3. Turbine */}
        <g className="turbine-spin-fast">
            <circle cx="50" cy="45" r="3" fill="#64748b" />
            <path d="M50 45 L 50 5 Q 60 5 50 45" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            <path d="M50 45 L 85 65 Q 80 75 50 45" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            <path d="M50 45 L 15 65 Q 20 75 50 45" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        </g>

        {/* Effet vent */}
        <g className="opacity-30">
            <line x1="0" y1="30" x2="20" y2="30" stroke="#fff" strokeWidth="0.5" className="bird" style={{animationDuration: '1s'}} />
            <line x1="80" y1="60" x2="100" y2="60" stroke="#fff" strokeWidth="0.5" className="bird" style={{animationDuration: '1.5s', animationDelay: '0.5s'}} />
        </g>

        {/* 4. Oiseaux */}
        <path d="M0 0 Q 3 -3 6 0" stroke="#fff" fill="none" strokeWidth="1" className="bird" style={{opacity: 0.8}} />
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