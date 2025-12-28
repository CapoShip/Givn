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
    if (score >= 80)
      return { text: "text-emerald-400", ring: "#10b981", glow: "rgba(16,185,129,0.45)", bg: "rgba(52,211,153,0.2)" };
    if (score >= 50)
      return { text: "text-yellow-400", ring: "#eab308", glow: "rgba(234,179,8,0.45)", bg: "rgba(234,179,8,0.2)" };
    return { text: "text-red-500", ring: "#ef4444", glow: "rgba(239,68,68,0.45)", bg: "rgba(239,68,68,0.3)" };
  };

  const { text: scoreColor, ring: ringColor, glow: glowColor, bg: bgColor } = getScoreConfig(brand.trust_score);

  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (brand.trust_score / 100) * circumference;

  // --- 3D TILT (comme avant) ---
  // IMPORTANT: applique seulement au "bg layer", pas au texte.
  const rectCenter = { x: 100, y: 100 }; // approximation pour garder ton feeling "avant"
  const tiltX = isHovering ? (mousePos.y - rectCenter.y) / 10 : 0;
  const tiltY = isHovering ? (mousePos.x - rectCenter.x) / -10 : 0;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      className="perspective-card group relative aspect-square w-full cursor-pointer select-none"
    >
      {/* ✅ Container (NE PAS transformer ce wrapper) */}
      <div className="relative w-full h-full rounded-2xl">
        {/* =========================
            1) BG LAYER (3D TRANSFORM)
           ========================= */}
        <div
          className="
            absolute inset-0 rounded-2xl
            shadow-2xl border border-white/5 group-hover:border-white/10
            bg-[#090909]
            transition-transform duration-200 ease-out
            transform-gpu
            [backface-visibility:hidden]
            [transform-style:preserve-3d]
            will-change-transform
          "
          style={{
            transform: isHovering
              ? `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`
              : "rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
          }}
        >
          {/* Glow radial (sans blur) */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, ${bgColor}, transparent 65%)`,
            }}
          />

          {/* Inner shells */}
          <div className="absolute inset-[1.5px] rounded-[15px] bg-[#070707]" />
          <div className="absolute inset-[1.5px] rounded-[15px] bg-gradient-to-br from-[#121212] via-[#090909] to-[#030303]" />
        </div>

        {/* =========================
            2) CONTENT LAYER (FLAT)
            -> jamais transformé => texte net
           ========================= */}
        <div
          className="
            absolute inset-[1.5px] rounded-[15px]
            z-10 overflow-hidden flex flex-col p-4
            antialiased
            [text-rendering:geometricPrecision]
            [webkit-font-smoothing:antialiased]
            [moz-osx-font-smoothing:grayscale]
          "
        >
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#0f0f0f] flex items-center justify-center border border-white/10 shadow-md group-hover:scale-110 transition-transform duration-500 overflow-hidden">
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="w-full h-full object-contain p-1 opacity-90 group-hover:opacity-100"
                  draggable={false}
                />
              ) : (
                <span className={`text-sm font-black ${scoreColor}`}>{brand.name.charAt(0)}</span>
              )}
            </div>

            <div className="scale-75 origin-top-right">
              <Badge status={brand.status as any} />
            </div>
          </div>

          <div className="mb-auto space-y-1.5">
            <h3 className="text-sm font-black text-white truncate leading-tight group-hover:text-emerald-50 transition-colors">
              {brand.name}
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
              {brand.category}
            </p>
            <p className="text-[10px] text-zinc-400 leading-tight line-clamp-2 italic opacity-60 group-hover:opacity-100 transition-opacity">
              "{safeClaim}"
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-end justify-between">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 relative z-10">
                <circle cx="16" cy="16" r={radius} stroke="#1a1a1c" strokeWidth="2.5" fill="transparent" />
                <circle
                  cx="16"
                  cy="16"
                  r={radius}
                  stroke={ringColor}
                  strokeWidth="2.5"
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
        {/* END CONTENT LAYER */}
      </div>
    </div>
  );
}
