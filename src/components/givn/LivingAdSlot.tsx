"use client";
import React, { useState, useEffect, memo, useId } from 'react';

export type AdType = 'tree' | 'house' | 'water' | 'school' | 'ocean' | 'health' | 'food' | 'energy';

export interface Ad {
    title: string;
    subtitle: string;
    type: AdType;
}

// ==========================================
// COMPOSANTS GRAPHIQUES "BUG-FREE & REALISTIC"
// ==========================================

/* --- ARBRE RÉALISTE (Structure organique, écorce, feuillage détaillé) --- */
const TreeGraphic = memo(({ grown }: { grown: boolean }) => {
    const uid = useId(); // ID unique pour éviter les conflits de dégradés
    
    return (
        <svg viewBox="0 0 100 160" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-all duration-700 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
            <defs>
                <linearGradient id={`bark-${uid}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#3f2e22" />
                    <stop offset="40%" stopColor="#5d4037" />
                    <stop offset="100%" stopColor="#271c19" />
                </linearGradient>
                <linearGradient id={`leaf-${uid}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#065f46" />
                </linearGradient>
                <filter id={`softGlow-${uid}`}>
                    <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>

            {/* Tronc noueux et racines */}
            <path 
                d="M46 160 L 44 150 Q 30 155 35 160 M 44 150 L 48 110 Q 45 90 30 80 M 48 110 L 52 110 Q 55 90 70 85 M 52 110 L 56 150 Q 70 155 65 160 M 56 150 L 54 160" 
                fill={`url(#bark-${uid})`} 
                className="tree-trunk-grow"
            />

            {/* Feuillage organique (pas de simples ronds) */}
            <g className="tree-sway" style={{ transformOrigin: '50px 110px' }}>
                {/* Branches */}
                <path d="M50 110 L 30 80" stroke="#5d4037" strokeWidth="2" strokeLinecap="round" className="tree-branch" style={{animationDelay: '0.8s'}} />
                <path d="M50 110 L 70 85" stroke="#5d4037" strokeWidth="2" strokeLinecap="round" className="tree-branch" style={{animationDelay: '0.9s'}} />
                <path d="M50 110 L 50 60" stroke="#5d4037" strokeWidth="2" strokeLinecap="round" className="tree-branch" style={{animationDelay: '1.0s'}} />

                {/* Amas de feuilles (Clusters) */}
                <g fill={`url(#leaf-${uid})`} filter={`url(#softGlow-${uid})`}>
                    {/* Cluster Gauche */}
                    <path d="M30 80 Q 15 80 20 65 Q 25 50 40 60 Q 45 75 30 80 Z" className="leaf-cluster" style={{animationDelay: '1.2s'}} />
                    {/* Cluster Droit */}
                    <path d="M70 85 Q 85 85 80 70 Q 75 55 60 65 Q 55 80 70 85 Z" className="leaf-cluster" style={{animationDelay: '1.4s'}} />
                    {/* Cluster Haut */}
                    <path d="M50 60 Q 35 50 45 35 Q 55 20 65 35 Q 75 50 50 60 Z" className="leaf-cluster" style={{animationDelay: '1.6s'}} />
                    {/* Cluster Central */}
                    <path d="M50 90 Q 35 90 40 75 Q 50 65 60 75 Q 65 90 50 90 Z" className="leaf-cluster" style={{animationDelay: '1.8s'}} />
                </g>
            </g>

            {/* Lucioles/Particules */}
            <g className={grown ? 'opacity-100' : 'opacity-0'}>
                <circle r="1" fill="#fbbf24" cx="40" cy="70" className="firefly" style={{animationDuration: '4s'}} />
                <circle r="1.5" fill="#fbbf24" cx="60" cy="50" className="firefly" style={{animationDuration: '6s', animationDelay: '1s'}} />
            </g>
        </svg>
    );
});
TreeGraphic.displayName = 'TreeGraphic';

/* --- ROBINET RÉPARÉ (IDs uniques, Physique de l'eau corrigée) --- */
const PumpGraphic = memo(({ grown }: { grown: boolean }) => {
    const uid = useId();

    return (
        <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
            <defs>
                <linearGradient id={`metal-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <linearGradient id={`water-${uid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.4" />
                </linearGradient>
            </defs>

            {/* Corps du robinet */}
            <g className="pump-body">
                {/* Tuyau vertical */}
                <rect x="42" y="50" width="16" height="90" fill={`url(#metal-${uid})`} rx="2" />
                {/* Bec verseur */}
                <path d="M42 65 H 25 Q 15 65 15 80" stroke={`url(#metal-${uid})`} strokeWidth="10" fill="none" strokeLinecap="round" />
                {/* Manivelle */}
                <g className="pump-handle-anim">
                    <path d="M42 50 L 65 35" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="65" cy="35" r="4" fill="#b91c1c" />
                </g>
            </g>

            {/* L'EAU (Doit sortir exactement de 15,80) */}
            <g className={grown ? 'opacity-100' : 'opacity-0 transition-opacity delay-300'}>
                {/* Flux continu */}
                <line x1="15" y1="80" x2="15" y2="135" stroke={`url(#water-${uid})`} strokeWidth="6" className="water-stream-flow" strokeLinecap="round" />
                
                {/* Éclaboussure sol */}
                <ellipse cx="15" cy="135" rx="8" ry="2" fill="#60a5fa" className="splash-core" />
                
                {/* Gouttelettes */}
                <circle cx="10" cy="130" r="1.5" fill="#93c5fd" className="droplet-particle" style={{'--tx': '-8px'} as any} />
                <circle cx="20" cy="130" r="1" fill="#93c5fd" className="droplet-particle" style={{'--tx': '8px', animationDelay: '0.2s'} as any} />
            </g>
        </svg>
    );
});
PumpGraphic.displayName = 'PumpGraphic';

/* --- OCÉAN (IDs corrigés + Animation) --- */
const OceanGraphic = memo(({ grown }: { grown: boolean }) => {
    const uid = useId();
    return (
        <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-500 ${grown ? 'opacity-100' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
            <defs>
                <linearGradient id={`sea-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0f172a" /> 
                    <stop offset="100%" stopColor="#082f49" /> 
                </linearGradient>
                <filter id={`glow-${uid}`}>
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>

            <rect x="0" y="0" width="100" height="160" fill={`url(#sea-${uid})`} />

            {/* Méduse */}
            <g className="jelly-move">
                <path d="M 30 80 Q 50 50 70 80 L 68 85 Q 50 75 32 85 Z" fill="#2dd4bf" filter={`url(#glow-${uid})`} opacity="0.8" />
                {/* Tentacules */}
                <path d="M 35 85 L 35 120" stroke="#2dd4bf" strokeWidth="1" className="tentacle-sway" style={{animationDelay: '0s'}} />
                <path d="M 45 85 L 45 130" stroke="#2dd4bf" strokeWidth="1" className="tentacle-sway" style={{animationDelay: '0.5s'}} />
                <path d="M 55 85 L 55 130" stroke="#2dd4bf" strokeWidth="1" className="tentacle-sway" style={{animationDelay: '1s'}} />
                <path d="M 65 85 L 65 120" stroke="#2dd4bf" strokeWidth="1" className="tentacle-sway" style={{animationDelay: '1.5s'}} />
            </g>

            {/* Bulles */}
            <circle cx="20" cy="140" r="1" fill="#ffffff" opacity="0.3" className="bubble" style={{animationDelay: '0s'}} />
            <circle cx="80" cy="120" r="2" fill="#ffffff" opacity="0.2" className="bubble" style={{animationDelay: '2s'}} />
        </svg>
    );
});
OceanGraphic.displayName = 'OceanGraphic';

/* --- ÉNERGIE (IDs corrigés) --- */
const EnergyGraphic = memo(({ grown }: { grown: boolean }) => {
    const uid = useId();
    return (
        <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
            <defs>
                <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e1b4b" />
                    <stop offset="100%" stopColor="#312e81" />
                </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="140" fill={`url(#sky-${uid})`} />
            
            {/* Particules d'énergie */}
            <g className={grown ? 'opacity-100' : 'opacity-0'}>
                <circle r="1" fill="#fbbf24" cx="50" cy="45" className="energy-particle" />
                <circle r="1" fill="#fbbf24" cx="50" cy="45" className="energy-particle" style={{animationDelay: '0.5s', transform: 'rotate(60deg)'}} />
                <circle r="1" fill="#fbbf24" cx="50" cy="45" className="energy-particle" style={{animationDelay: '1s', transform: 'rotate(-60deg)'}} />
            </g>

            {/* Éolienne */}
            <rect x="48" y="45" width="4" height="95" fill="#94a3b8" className="house-base" />
            <circle cx="50" cy="45" r="4" fill="#fcd34d" />
            <g className="turbine-spin-fast">
                <path d="M50 45 L 50 5 Q 60 5 50 45" fill="#cbd5e1" />
                <path d="M50 45 L 85 65 Q 80 75 50 45" fill="#cbd5e1" />
                <path d="M50 45 L 15 65 Q 20 75 50 45" fill="#cbd5e1" />
            </g>
        </svg>
    );
});
EnergyGraphic.displayName = 'EnergyGraphic';

/* --- MAISON (IDs corrigés - Simple) --- */
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

/* --- SANTÉ / ÉCOLE / NOURRITURE (Placeholder corrigé avec simple ID si besoin, ici simplifiés) --- */
/* Pour ces graphiques plus simples, les IDs ne sont pas critiques s'ils n'utilisent pas de defs, 
   mais par sécurité, on laisse tel quel car ils n'utilisaient pas de dégradés complexes dans la V1/V2 
   qui entraient en conflit. Si vous voulez les complexifier, ajoutez useId() comme ci-dessus. */
const SchoolGraphic = HouseGraphic; // Réutilisation pour démo
const HealthGraphic = HouseGraphic; 
const FoodGraphic = HouseGraphic; 

// ==========================================
// 2. COMPOSANT PRINCIPAL
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