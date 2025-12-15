"use client";
import { useState, useEffect } from 'react';

interface Ad {
    title: string;
    subtitle: string;
}

// --- GRAPHICS ---

const TreeGraphic = ({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="treeGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="40%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <path d="M50 140 C50 110 45 90 50 60 C52 45 48 30 50 10" stroke="url(#treeGradient)" strokeWidth="4" fill="none" strokeLinecap="round" className="tree-path" />
        <path d="M50 100 Q30 90 20 80" stroke="url(#treeGradient)" strokeWidth="3" fill="none" className="tree-path" style={{ animationDelay: '0.2s' }} strokeLinecap="round" />
        <path d="M50 90 Q70 80 80 70" stroke="url(#treeGradient)" strokeWidth="3" fill="none" className="tree-path" style={{ animationDelay: '0.3s' }} strokeLinecap="round" />
        <path d="M48 60 Q30 50 25 40" stroke="url(#treeGradient)" strokeWidth="2.5" fill="none" className="tree-path" style={{ animationDelay: '0.4s' }} strokeLinecap="round" />
        <path d="M52 50 Q70 40 75 30" stroke="url(#treeGradient)" strokeWidth="2.5" fill="none" className="tree-path" style={{ animationDelay: '0.5s' }} strokeLinecap="round" />
        <g filter="url(#glow)">
            <circle cx="20" cy="80" r="4" fill="#34d399" className="leaf" style={{ animationDelay: '0.8s' }} />
            <circle cx="15" cy="75" r="3" fill="#10b981" className="leaf" style={{ animationDelay: '0.9s' }} />
            <circle cx="25" cy="40" r="3.5" fill="#059669" className="leaf" style={{ animationDelay: '1s' }} />
            <circle cx="80" cy="70" r="4" fill="#34d399" className="leaf" style={{ animationDelay: '0.9s' }} />
            <circle cx="85" cy="65" r="3" fill="#10b981" className="leaf" style={{ animationDelay: '1s' }} />
            <circle cx="50" cy="10" r="5" fill="#34d399" className="leaf" style={{ animationDelay: '1.3s' }} />
        </g>
    </svg>
);

const HouseGraphic = ({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="houseGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
        </defs>
        
        {/* Walls - Scale up */}
        <g className="house-base">
            <path d="M25 80 H75 V130 H25 Z" stroke="url(#houseGradient)" strokeWidth="2" fill="#064e3b" className="house-fill" />
        </g>
        
        {/* Roof - Drop in */}
        <g className="house-roof">
            <path d="M20 80 L50 50 L80 80 Z" stroke="url(#houseGradient)" strokeWidth="2" fill="#10b981" strokeLinejoin="round" className="house-fill" />
        </g>
        
        {/* Door - Color fill */}
        <rect x="42" y="105" width="16" height="25" rx="1" fill="#042f2e" className="house-fill" style={{ animationDelay: '1s' }} />
        
        {/* Window - Color fill */}
        <rect x="35" y="90" width="10" height="10" rx="1" fill="#34d399" className="house-fill" style={{ animationDelay: '1.2s' }} />
        <rect x="55" y="90" width="10" height="10" rx="1" fill="#34d399" className="house-fill" style={{ animationDelay: '1.3s' }} />
    </svg>
);

const WaterPumpGraphic = ({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 ad-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
        <defs>
            <linearGradient id="metalGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <filter id="glowBlue" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        
        {/* Pump Body */}
        <g className="pump-body">
            <path d="M70 140 V 60" stroke="url(#metalGradient)" strokeWidth="6" strokeLinecap="round" />
            <path d="M60 60 Q 60 40 40 50 L 35 55" fill="none" stroke="url(#metalGradient)" strokeWidth="6" strokeLinecap="round" />
            <path d="M70 60 L 85 40" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" /> {/* Handle */}
            <circle cx="85" cy="40" r="3" fill="#ef4444" />
        </g>
        
        {/* Falling Drop */}
        <g filter="url(#glowBlue)">
            <circle cx="35" cy="60" r="4" fill="#3b82f6" className="water-drop" />
        </g>
        
        {/* Splashes/Ripples */}
        <ellipse cx="35" cy="125" rx="15" ry="4" stroke="#3b82f6" strokeWidth="1" fill="none" className="water-ripple" style={{ animationDelay: '1s' }} />
        <ellipse cx="35" cy="125" rx="25" ry="6" stroke="#3b82f6" strokeWidth="1" fill="none" className="water-ripple" style={{ animationDelay: '1.4s' }} />
    </svg>
);

// --- MAIN COMPONENT ---

export default function LivingAdSlot({ pool, initialDelay, cycleDuration = 9000, variantOffset = 0 }: { pool: Ad[], initialDelay: number, cycleDuration?: number, variantOffset?: number }) {
    const [adIndex, setAdIndex] = useState(0);
    const [phase, setPhase] = useState('waiting');
    
    useEffect(() => {
        setAdIndex(Math.floor(Math.random() * pool.length));
        const startTimeout = setTimeout(() => setPhase('seed'), initialDelay);
        return () => clearTimeout(startTimeout);
    }, [initialDelay, pool.length]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (phase === 'seed') {
            timer = setTimeout(() => setPhase('growing'), 1000);
        } else if (phase === 'growing') {
            timer = setTimeout(() => setPhase('blooming'), 1500); 
        } else if (phase === 'blooming') {
            timer = setTimeout(() => setPhase('displayed'), 800);
        } else if (phase === 'displayed') {
            timer = setTimeout(() => setPhase('withering'), cycleDuration);
        } else if (phase === 'withering') {
            timer = setTimeout(() => {
                setAdIndex((prev) => (prev + 1) % pool.length);
                setPhase('seed');
            }, 600);
        }
        return () => clearTimeout(timer);
    }, [phase, cycleDuration, pool.length]);

    const currentAd = pool[adIndex];
    if (phase === 'waiting' || !currentAd) return <div className="h-[140px] mb-6"></div>;

    // Logic to select graphic based on ad index + offset to ensure variety
    const GraphicComponent = () => {
        const type = (adIndex + variantOffset) % 3;
        const isGrown = phase !== 'seed' && phase !== 'waiting';
        
        if (type === 0) return <TreeGraphic grown={isGrown} />;
        if (type === 1) return <HouseGraphic grown={isGrown} />;
        return <WaterPumpGraphic grown={isGrown} />;
    };

    return (
        <div className="relative pl-8 mb-8 min-h-[140px] flex items-end">
            <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-emerald-900/50 to-transparent"></div>

            <div className="absolute left-0 bottom-0 w-24 h-[160px] flex flex-col justify-end items-center pointer-events-none z-0">
                 {phase === 'seed' && (
                     <div className="w-2 h-2 bg-emerald-200 rounded-full glow-dot-green absolute bottom-0 animate-seed-fall"></div>
                 )}
                 <GraphicComponent />
            </div>

            {(phase === 'blooming' || phase === 'displayed' || phase === 'withering') && (
                <div className={`glass-panel rounded-xl p-4 relative overflow-hidden group hover:bg-emerald-500/5 transition-all cursor-pointer w-full ml-10 z-10 origin-bottom-left
                                ${phase === 'blooming' ? 'animate-ad-grow' : ''}
                                ${phase === 'withering' ? 'animate-wither' : ''}
                                `}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-white">
                            <span className="text-xs font-semibold tracking-wide text-emerald-50">{currentAd.title}</span>
                        </div>
                        <span className="text-[9px] text-emerald-500/50 uppercase tracking-widest border border-emerald-500/20 px-1.5 py-0.5 rounded">Ad</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-light">{currentAd.subtitle}</p>
                </div>
            )}
        </div>
    );
}