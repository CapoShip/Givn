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
  const safeClaim = brand.claim || "Transparent impact tracking enabled.";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // --- CONFIG SCORE ---
  const getScoreConfig = (score: number) => {
    if (score >= 80) return { 
      text: "text-emerald-400", 
      ring: "#10b981", 
      glow: "rgba(16, 185, 129, 0.4)",
      bg: "rgba(52, 211, 153, 0.3)"
    };
    if (score >= 50) return { 
      text: "text-yellow-400", 
      ring: "#eab308", 
      glow: "rgba(234, 179, 8, 0.4)",
      bg: "rgba(234, 179, 8, 0.3)"
    };
    return { 
      text: "text-red-500", 
      ring: "#ef4444", 
      glow: "rgba(239, 68, 68, 0.4)",
      bg: "rgba(239, 68, 68, 0.3)"
    };
  };

  const { text: scoreColor, ring: ringColor, glow: glowColor, bg: bgColor } = getScoreConfig(brand.trust_score);

  // Configuration SVG (taille réduite)
  const radius = 16; // Plus petit (était 24)
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (brand.trust_score / 100) * circumference;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      // CHANGEMENT ICI: Hauteur réduite à 280px (était 360px)
      className="perspective-card group relative h-[280px] w-full cursor-pointer select-none"
    >
      <div
        className="preserve-3d relative w-full h-full rounded-[20px] bg-[#0c0c0c] transition-transform duration-150 ease-out shadow-xl"
        style={{
          transform: isHovering 
            ? `rotateX(${(mousePos.y - 140) / 10}deg) rotateY(${(mousePos.x - 150) / -10}deg) scale3d(1.02, 1.02, 1.02)` 
            : 'rotateX(0) rotateY(0) scale3d(1, 1, 1)',
          boxShadow: isHovering 
            ? `0 20px 40px -10px rgba(0,0,0,0.9), 0 0 30px -10px ${glowColor}`
            : '0 10px 20px -10px rgba(0,0,0,0.6)'
        }}
      >
        {/* Glow externe */}
        <div 
          className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${bgColor}, transparent 40%)`,
            zIndex: 1,
            filter: 'blur(2px)'
          }}
        />
        
        <div className="absolute inset-[1px] rounded-[19px] bg-[#080808] z-[2]" />

        {/* CONTENU (Padding réduit à p-5) */}
        <div className="absolute inset-[1px] rounded-[19px] bg-gradient-to-br from-[#121212] via-[#090909] to-[#000000] z-[3] overflow-hidden flex flex-col p-5 preserve-3d">
          
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none mix-blend-color-dodge"
            style={{
              background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)`,
              transform: isHovering ? `translateX(${(150 - mousePos.x) / 2}px)` : 'translateX(0)'
            }}
          />

          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none mix-blend-soft-light"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent 80%)`
            }}
          />

          <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full group-hover:bg-emerald-500/10 transition-all duration-700 translate-z-10" />
          
          {/* HEADER (Logo + Badge) */}
          <div className="flex justify-between items-start mb-6 preserve-3d translate-z-20">
            <div 
              // CHANGEMENT ICI: Taille logo réduite (w-12 h-12)
              className="w-12 h-12 rounded-xl bg-[#0f0f0f] flex items-center justify-center border border-white/5 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:border-emerald-500/30 overflow-hidden"
              style={{ transform: 'translateZ(30px)' }}
            >
                {brand.logo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={brand.logo_url} 
                    alt={brand.name} 
                    className="w-full h-full object-contain p-1.5 opacity-90 group-hover:opacity-100 transition-opacity" 
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if(parent) parent.innerHTML = `<span class="text-xl font-black ${scoreColor}">${brand.name.charAt(0)}</span>`;
                    }}
                  />
                ) : (
                  <span className={`text-xl font-black ${scoreColor}`}>{brand.name.charAt(0)}</span>
                )}
            </div>
            <div className="translate-z-30 scale-90 origin-top-right">
              <Badge status={brand.status as any} />
            </div>
          </div>

          {/* BODY (Textes réduits) */}
          <div className="mb-auto space-y-2 preserve-3d translate-z-20">
            {/* Titre text-lg au lieu de 2xl */}
            <h3 className="text-lg font-black text-white tracking-tight group-hover:text-emerald-50 transition-colors truncate" style={{ transform: 'translateZ(25px)' }}>
              {brand.name}
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-600 group-hover:text-emerald-400/90 transition-colors" style={{ transform: 'translateZ(20px)' }}>
              {brand.category}
            </p>
            {/* Description text-xs */}
            <p className="text-xs text-zinc-400 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity line-clamp-2 h-8" style={{ transform: 'translateZ(15px)' }}>
              {safeClaim}
            </p>
          </div>

          {/* FOOTER (Compact) */}
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between group-hover:border-white/10 transition-colors preserve-3d translate-z-20">
            
            <div className="flex items-center gap-3">
               {/* Anneau réduit à 40px (w-10 h-10) */}
               <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="20" cy="20" r={radius} stroke="#1f1f22" strokeWidth="3" fill="transparent" />
                    <circle
                      cx="20"
                      cy="20"
                      r={radius}
                      stroke={ringColor}
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}
                    />
                  </svg>
                  <span className={`absolute text-[10px] font-black ${scoreColor}`} style={{ transform: 'translateZ(10px)' }}>
                    {brand.trust_score}
                  </span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-bold">Trust</span>
                 <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white">Index</span>
               </div>
            </div>

            <div className="text-right">
               <div className="flex items-center justify-end gap-1.5 text-zinc-500 group-hover:text-emerald-400 transition-colors">
                  <span className="text-lg font-bold font-mono tracking-tighter">{safeProofCount}</span>
                  <Activity size={12} className={safeProofCount > 0 ? "animate-pulse" : ""} />
               </div>
               <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-bold block">
                  Proofs
               </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}