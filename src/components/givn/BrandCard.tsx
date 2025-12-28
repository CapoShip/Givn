"use client";

import React, { useRef, useState } from "react";
import { Activity } from "lucide-react";
import Badge from "./Badge";

interface BrandCardProps {
  brand: {
    id: string;
    name: string;
    category: string;
    logo_url?: string | null;
    trust_score: number;
    status: "VERIFIED" | "PENDING";
    claim?: string | null;
    proof_count?: number; 
  };
  onClick: () => void;
}

export function BrandCard({ brand, onClick }: BrandCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const safeProofCount = brand.proof_count || 0;
  const safeClaim = brand.claim || "Impact verified on-chain.";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const getScoreConfig = (score: number) => {
    if (score >= 80) return { 
      text: "text-emerald-400", ring: "#10b981", glow: "rgba(16, 185, 129, 0.45)", bg: "rgba(52, 211, 153, 0.2)"
    };
    if (score >= 50) return { 
      text: "text-yellow-400", ring: "#eab308", glow: "rgba(234, 179, 8, 0.45)", bg: "rgba(234, 179, 8, 0.2)"
    };
    return { 
      text: "text-red-500", ring: "#ef4444", glow: "rgba(239, 68, 68, 0.45)", bg: "rgba(239, 68, 68, 0.2)"
    };
  };

  const { text: scoreColor, ring: ringColor, glow: glowColor, bg: bgColor } = getScoreConfig(brand.trust_score);
  
  const radius = 14; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (brand.trust_score / 100) * circumference;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      className="perspective-card group relative aspect-square w-full cursor-pointer select-none"
    >
      <div
        className="preserve-3d relative w-full h-full rounded-2xl bg-[#090909] transition-transform duration-200 ease-out shadow-2xl border border-white/5 group-hover:border-white/10"
        style={{
          transform: isHovering 
            ? `rotateX(${(mousePos.y - 100) / 10}deg) rotateY(${(mousePos.x - 100) / -10}deg) scale3d(1.02, 1.02, 1.02)` 
            : 'rotateX(0) rotateY(0) scale3d(1, 1, 1)',
        }}
      >
        {/* Dynamic Halo Glow */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${bgColor}, transparent 65%)`,
            zIndex: 1,
            filter: 'blur(2px)'
          }}
        />
        
        <div className="absolute inset-[1.5px] rounded-[15px] bg-[#070707] z-[2]" />

        <div className="absolute inset-[1.5px] rounded-[15px] bg-gradient-to-br from-[#121212] via-[#090909] to-[#030303] z-[3] overflow-hidden flex flex-col p-4 preserve-3d">
          
          {/* Header Layers */}
          <div className="flex justify-between items-start mb-2 preserve-3d translate-z-40">
            <div className="w-10 h-10 rounded-lg bg-[#0f0f0f] flex items-center justify-center border border-white/10 shadow-md group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain p-1 opacity-90 group-hover:opacity-100" />
                ) : (
                  <span className={`text-sm font-black ${scoreColor}`}>{brand.name.charAt(0)}</span>
                )}
            </div>
            <div className="scale-75 origin-top-right translate-z-30">
              <Badge status={brand.status as any} />
            </div>
          </div>

          {/* Info & Claim Layers */}
          <div className="mb-auto space-y-1.5 preserve-3d translate-z-30">
            <h3 className="text-sm font-black text-white truncate leading-tight group-hover:text-emerald-50 transition-colors" style={{ transform: 'translateZ(20px)' }}>
              {brand.name}
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600" style={{ transform: 'translateZ(15px)' }}>
              {brand.category}
            </p>
            <p className="text-[10px] text-zinc-400 leading-tight line-clamp-2 italic opacity-60 group-hover:opacity-100 transition-opacity" style={{ transform: 'translateZ(25px)' }}>
              "{safeClaim}"
            </p>
          </div>

          {/* Footer Layers */}
          <div className="mt-2 pt-2 border-t border-white/10 flex items-end justify-between preserve-3d translate-z-20">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 relative z-10">
                <circle cx="16" cy="16" r={radius} stroke="#1a1a1c" strokeWidth="2.5" fill="transparent" />
                <circle 
                  cx="16" cy="16" r={radius} 
                  stroke={ringColor} strokeWidth="2.5" 
                  fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round" 
                  style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }} 
                />
              </svg>
              <span className={`absolute text-[9px] font-black ${scoreColor} z-20`}>{brand.trust_score}</span>
            </div>

            <div className="text-right">
               <div className="flex items-center justify-end gap-1 text-zinc-600 group-hover:text-emerald-400 transition-colors">
                  <span className="text-sm font-black font-mono">{safeProofCount}</span>
                  <Activity size={10} className={safeProofCount > 0 ? "animate-pulse" : ""} />
               </div>
               <span className="text-[7px] text-zinc-700 uppercase tracking-widest block font-black">Blocks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}