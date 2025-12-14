"use client";
import { useState, useEffect } from 'react';

interface Ad {
    title: string;
    subtitle: string;
}

const TreeGraphic = ({ grown }: { grown: boolean }) => (
    <svg viewBox="0 0 100 140" className={`w-full h-full absolute bottom-0 left-0 pointer-events-none transition-opacity duration-300 ${grown ? 'opacity-100 tree-grown' : 'opacity-0'}`} preserveAspectRatio="xMidYBottom slice">
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

        {/* Main Trunk */}
        <path d="M50 140 C50 110 45 90 50 60 C52 45 48 30 50 10" stroke="url(#treeGradient)" strokeWidth="4" fill="none" strokeLinecap="round" className="tree-path" />
        
        {/* Lower Branches */}
        <path d="M50 100 Q30 90 20 80" stroke="url(#treeGradient)" strokeWidth="3" fill="none" className="tree-path" style={{ transitionDelay: '0.2s' }} strokeLinecap="round" />
        <path d="M50 90 Q70 80 80 70" stroke="url(#treeGradient)" strokeWidth="3" fill="none" className="tree-path" style={{ transitionDelay: '0.3s' }} strokeLinecap="round" />
        
        {/* Mid Branches */}
        <path d="M48 60 Q30 50 25 40" stroke="url(#treeGradient)" strokeWidth="2.5" fill="none" className="tree-path" style={{ transitionDelay: '0.4s' }} strokeLinecap="round" />
        <path d="M52 50 Q70 40 75 30" stroke="url(#treeGradient)" strokeWidth="2.5" fill="none" className="tree-path" style={{ transitionDelay: '0.5s' }} strokeLinecap="round" />

        {/* Top Branches */}
        <path d="M50 30 Q40 20 35 10" stroke="url(#treeGradient)" strokeWidth="2" fill="none" className="tree-path" style={{ transitionDelay: '0.6s' }} strokeLinecap="round" />
        <path d="M50 30 Q60 20 65 10" stroke="url(#treeGradient)" strokeWidth="2" fill="none" className="tree-path" style={{ transitionDelay: '0.6s' }} strokeLinecap="round" />

        {/* Lush Canopy (Leaves) */}
        <g filter="url(#glow)">
            <circle cx="20" cy="80" r="4" fill="#34d399" className="leaf" style={{ transitionDelay: '0.8s' }} />
            <circle cx="15" cy="75" r="3" fill="#10b981" className="leaf" style={{ transitionDelay: '0.9s' }} />
            <circle cx="25" cy="40" r="3.5" fill="#059669" className="leaf" style={{ transitionDelay: '1s' }} />
            <circle cx="20" cy="35" r="2.5" fill="#34d399" className="leaf" style={{ transitionDelay: '1.1s' }} />
            <circle cx="35" cy="10" r="3" fill="#10b981" className="leaf" style={{ transitionDelay: '1.2s' }} />
            <circle cx="80" cy="70" r="4" fill="#34d399" className="leaf" style={{ transitionDelay: '0.9s' }} />
            <circle cx="85" cy="65" r="3" fill="#10b981" className="leaf" style={{ transitionDelay: '1s' }} />
            <circle cx="75" cy="30" r="3.5" fill="#059669" className="leaf" style={{ transitionDelay: '1.1s' }} />
            <circle cx="80" cy="25" r="2.5" fill="#34d399" className="leaf" style={{ transitionDelay: '1.2s' }} />
            <circle cx="65" cy="10" r="3" fill="#10b981" className="leaf" style={{ transitionDelay: '1.2s' }} />
            <circle cx="50" cy="10" r="5" fill="#34d399" className="leaf" style={{ transitionDelay: '1.3s' }} />
            <circle cx="45" cy="5" r="3" fill="#10b981" className="leaf" style={{ transitionDelay: '1.4s' }} />
            <circle cx="55" cy="5" r="3" fill="#059669" className="leaf" style={{ transitionDelay: '1.4s' }} />
        </g>
    </svg>
);

export default function LivingAdSlot({ pool, initialDelay, cycleDuration = 9000 }: { pool: Ad[], initialDelay: number, cycleDuration?: number }) {
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

    return (
        <div className="relative pl-8 mb-8 min-h-[140px] flex items-end">
            <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-emerald-900/50 to-transparent"></div>

            <div className="absolute left-0 bottom-0 w-24 h-[160px] flex flex-col justify-end items-center pointer-events-none z-0">
                 {phase === 'seed' && (
                     <div className="w-2 h-2 bg-emerald-200 rounded-full glow-dot-green absolute bottom-0 animate-seed-fall"></div>
                 )}
                 <TreeGraphic grown={phase !== 'seed' && phase !== 'waiting'} />
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