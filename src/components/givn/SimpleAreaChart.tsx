"use client";

import React from "react";

// Fonction pour formater en "16B", "200M"
const formatCompact = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

export default function SimpleAreaChart({ data }: { data: { label: string; value: number }[] }) {
  // 1. Protection : Pas assez de données
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
        <p className="text-xs text-zinc-500 font-mono font-bold">NO DATA YET</p>
      </div>
    );
  }

  // 2. Gestion point unique (Ligne de départ)
  let pointsToRender = data;
  if (data.length === 1) {
    pointsToRender = [
      { label: 'Start', value: 0 }, 
      data[0]
    ];
  }

  // 3. Calculs Min/Max (Échelle)
  const values = pointsToRender.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // On ajoute un peu de "padding" en haut pour que le texte ne soit pas coupé
  const padding = (max - min) * 0.2 || 100; 
  const safeMin = min; 
  const safeMax = max + padding;
  const range = safeMax - safeMin || 1;

  // 4. Calcul des Coordonnées (x, y) + Valeur associée
  const chartPoints = pointsToRender.map((d, i) => {
    const x = (i / (pointsToRender.length - 1)) * 100;
    // Y inversé (0 en haut) + Marge pour le texte
    const y = 50 - ((d.value - safeMin) / range) * 40 - 5; 
    return { x, y, value: d.value, label: d.label };
  });

  // Construction des chemins SVG
  const linePath = `M${chartPoints.map(p => `${p.x},${p.y}`).join(" L")}`;
  const areaPath = `${linePath} L100,50 L0,50 Z`;

  return (
    <div className="w-full h-full relative select-none">
      <svg
        viewBox="0 0 100 50" 
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Zone remplie */}
        <path d={areaPath} fill="url(#gradientGreen)" />

        {/* Ligne principale */}
        <path
          d={linePath}
          fill="none"
          stroke="#34d399" 
          strokeWidth="1.5" 
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* POINTS ET ÉTIQUETTES */}
        {chartPoints.map((p, i) => (
           <g key={i} className="group cursor-pointer">
             {/* Zone tactile invisible (plus large pour faciliter le survol) */}
             <circle cx={p.x} cy={p.y} r="4" fill="transparent" stroke="none" vectorEffect="non-scaling-stroke" />

             {/* Le Point Visible */}
             <circle 
               cx={p.x} 
               cy={p.y} 
               r="2" 
               fill="#09090b" // bg-zinc-950
               stroke="#34d399" // emerald-400
               strokeWidth="1"
               vectorEffect="non-scaling-stroke"
               className="transition-all duration-300 group-hover:r-[3] group-hover:fill-emerald-400"
             />

             {/* L'Étiquette (Nombre) - Apparaît au survol */}
             <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {/* Fond du texte (petit rectangle noir pour lisibilité) */}
                <rect 
                    x={p.x - 12} 
                    y={p.y - 12} 
                    width="24" 
                    height="8" 
                    rx="2"
                    fill="#10b981"
                    className="opacity-90"
                />
                
                {/* Le Texte */}
                <text 
                    x={p.x} 
                    y={p.y - 7} 
                    textAnchor="middle" 
                    fill="white" 
                    fontSize="4" 
                    fontWeight="bold"
                    className="drop-shadow-md font-mono"
                >
                    {formatCompact(p.value)}
                </text>
             </g>
           </g>
        ))}
      </svg>
      
      {/* Indicateur global (Total actuel) */}
      <div className="absolute top-0 right-0 pointer-events-none">
          <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-950/50 px-2 py-1 rounded border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
             Current: {formatCompact(data[data.length - 1].value)}
          </span>
      </div>
    </div>
  );
}