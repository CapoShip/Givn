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
    // Nouveaux champs utilisés par cette version
    claim?: string | null;
    proof_count?: number; 
  };
  onClick: () => void;
}

export function BrandCard({ brand, onClick }: BrandCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Valeurs par défaut si les données sont incomplètes
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

  // --- CONFIGURATION DES COULEURS SELON LE SCORE ---
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

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (brand.trust_score / 100) * circumference;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="perspective-card group relative h-[360px] w-full cursor-pointer select-none"
    >
      <div
        className="preserve-3d relative w-full h-full rounded-[24px] bg-[#0c0c0c] transition-transform duration-150 ease-out shadow-2xl"
        style={{
          transform: isHovering 
            ? `rotateX(${(mousePos.y - 180) / 12}deg) rotateY(${(mousePos.x - 160) / -12}deg) scale3d(1.02, 1.02, 1.02)` 
            : 'rotateX(0) rotateY(0) scale3d(1, 1, 1)',
          boxShadow: isHovering 
            ? `0 30px 60px -10px rgba(0,0,0,0.9), 0 0 40px -10px ${glowColor}`
            : '0 10px 30px -10px rgba(0,0,0,0.6)'
        }}
      >
        {/* --- 1. BORDURE LUMINEUSE DYNAMIQUE (Glow externe) --- */}
        <div 
          className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, ${bgColor}, transparent 40%)`,
            zIndex: 1,
            filter: 'blur(2px)'
          }}
        />
        
        {/* --- 2. CADRE DU CHASSIS --- */}
        <div className="absolute inset-[1px] rounded-[23px] bg-[#080808] z-[2]" />

        {/* --- 3. CONTENEUR DE CONTENU INTERNE --- */}
        <div className="absolute inset-[1px] rounded-[23px] bg-gradient-to-br from-[#121212] via-[#090909] to-[#000000] z-[3] overflow-hidden flex flex-col p-8 preserve-3d">
          
          {/* REFLET : Brillance anisotrope */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none mix-blend-color-dodge"
            style={{
              background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)`,
              transform: isHovering ? `translateX(${(160 - mousePos.x) / 2}px)` : 'translateX(0)'
            }}
          />

          {/* SPOTLIGHT : Suit la souris */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none mix-blend-soft-light"
            style={{
              background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent 80%)`
            }}
          />

          {/* ATMOSPHÈRE FLOTTANTE : Particules de profondeur */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full group-hover:bg-emerald-500/10 transition-all duration-700 translate-z-10" />
          
          {/* --- COUCHES DE CONTENU (Flottantes) --- */}
          
          {/* EN-TÊTE */}
          <div className="flex justify-between items-start mb-10 preserve-3d translate-z-20">
            <div 
              className="w-16 h-16 rounded-2xl bg-[#0f0f0f] flex items-center justify-center border border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300 group-hover:border-emerald-500/30 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden"
              style={{ transform: 'translateZ(40px)' }}
            >
                {brand.logo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={brand.logo_url} 
                    alt={brand.name} 
                    className="w-full h-full object-contain p-2 opacity-90 group-hover:opacity-100 transition-opacity" 
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if(parent) parent.innerHTML = `<span class="text-2xl font-black ${scoreColor}">${brand.name.charAt(0)}</span>`;
                    }}
                  />
                ) : (
                  <span className={`text-2xl font-black ${scoreColor}`}>{brand.name.charAt(0)}</span>
                )}
            </div>
            <div className="translate-z-30">
              <Badge status={brand.status as any} />
            </div>
          </div>

          {/* INFORMATIONS CORPS */}
          <div className="mb-auto space-y-3 preserve-3d translate-z-20">
            <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-emerald-50 transition-colors" style={{ transform: 'translateZ(30px)' }}>
              {brand.name}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 group-hover:text-emerald-400/90 transition-colors" style={{ transform: 'translateZ(25px)' }}>
              {brand.category}
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity line-clamp-2" style={{ transform: 'translateZ(20px)' }}>
              {safeClaim}
            </p>
          </div>

          {/* STATS PIED DE PAGE */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between group-hover:border-white/10 transition-colors preserve-3d translate-z-20">
            
            {/* Anneau de Confiance (Trust Ring) */}
            <div className="flex items-center gap-4">
               <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r={radius} stroke="#1f1f22" strokeWidth="4" fill="transparent" />
                    <circle
                      cx="24"
                      cy="24"
                      r={radius}
                      stroke={ringColor}
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
                    />
                  </svg>
                  <span className={`absolute text-xs font-black ${scoreColor}`} style={{ transform: 'translateZ(10px)' }}>
                    {brand.trust_score}
                  </span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Trust</span>
                 <span className="text-xs font-bold text-zinc-300 group-hover:text-white">Index</span>
               </div>
            </div>

            {/* Compteur de Preuves */}
            <div className="text-right">
               <div className="flex items-center justify-end gap-2 text-zinc-500 group-hover:text-emerald-400 transition-colors">
                  <span className="text-2xl font-bold font-mono tracking-tighter">{safeProofCount}</span>
                  <Activity size={16} className={safeProofCount > 0 ? "animate-pulse" : ""} />
               </div>
               <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold block">
                  Proofs
               </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}