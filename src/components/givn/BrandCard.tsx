"use client";

import { ArrowRight, TrendingUp, ShieldCheck, Activity } from "lucide-react";
import Badge from "./Badge";

// --- GENERATEUR DE DEGRADÉ RICHE (Pour les sans-logo) ---
const getBrandGradient = (name: string) => {
  const gradients = [
    "from-violet-600 via-indigo-600 to-purple-800", // Deep Purple
    "from-emerald-500 via-teal-600 to-green-800",   // Cyber Nature
    "from-orange-500 via-amber-600 to-red-800",     // Solar Flare
    "from-pink-500 via-rose-600 to-fuchsia-800",    // Neon City
    "from-blue-500 via-cyan-600 to-azure-800",      // Ocean Tech
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
};

interface BrandCardProps {
  brand: {
    id: string;
    name: string;
    category: string;
    logo_url?: string | null;
    trust_score: number;
    status: "VERIFIED" | "PENDING";
  };
  onClick: () => void;
}

export function BrandCard({ brand, onClick }: BrandCardProps) {
  const gradient = getBrandGradient(brand.name);
  // Calcul de la "couleur" dominante pour les ombres (basé sur le nom pour la stabilité)
  const glowColor = brand.trust_score > 80 ? "rgba(16, 185, 129," : "rgba(255, 255, 255,";

  return (
    <div
      onClick={onClick}
      className="group relative h-full min-h-[240px] w-full cursor-pointer perspective-1000"
    >
      {/* 1. L'AURA (Glow externe au survol) */}
      <div 
        className="absolute -inset-[2px] rounded-[20px] bg-gradient-to-r from-emerald-500/0 via-white/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md" 
      />

      {/* 2. LA CARTE (Structure principale) */}
      <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-2xl bg-[#080808] p-6 shadow-2xl transition-all duration-500 group-hover:transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] border border-white/5 group-hover:border-white/10">
        
        {/* TEXTURE DE FOND (Grid subtile) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />
        
        {/* DEGRADÉ D'AMBIANCE (Haut de carte) */}
        <div className={`absolute top-0 right-0 w-[80%] h-[80%] bg-gradient-to-br ${gradient} opacity-[0.05] group-hover:opacity-[0.12] blur-[80px] transition-opacity duration-700 pointer-events-none rounded-full translate-x-1/4 -translate-y-1/4`} />

        {/* --- PARTIE HAUTE --- */}
        <div className="relative z-10 flex justify-between items-start">
          
          {/* LOGO (Avec effet de verre et lueur) */}
          <div className="relative">
             {/* Lueur derrière le logo */}
             <div className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
             
             <div className="relative h-16 w-16 rounded-xl bg-[#111] border border-white/10 p-2 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 overflow-hidden">
                {/* Fond blanc cassé pour le logo pour contraste max */}
                <div className="absolute inset-0 bg-white opacity-[0.02] group-hover:opacity-[0.05]" />
                
                {brand.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="h-full w-full object-contain relative z-10 drop-shadow-md"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      // Fallback instantané
                      const parent = e.currentTarget.parentElement;
                      if(parent) {
                         parent.innerHTML = `<div class="absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center"><span class="text-white font-bold text-3xl shadow-lg">${brand.name.charAt(0)}</span></div>`;
                      }
                    }}
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <span className="text-white font-bold text-3xl shadow-lg">{brand.name.charAt(0)}</span>
                  </div>
                )}
             </div>
          </div>

          <div className="flex flex-col items-end gap-2">
             <Badge status={brand.status as any} />
             {brand.status === 'VERIFIED' && (
                 <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400/80 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    <ShieldCheck size={10} /> ON-CHAIN
                 </span>
             )}
          </div>
        </div>

        {/* --- PARTIE BASSE --- */}
        <div className="relative z-10 mt-8">
           {/* Nom et Catégorie */}
           <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                 <div className="h-[1px] w-4 bg-white/20 group-hover:w-8 group-hover:bg-emerald-500 transition-all duration-500" />
                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    {brand.category}
                 </p>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-emerald-300 transition-all duration-300">
                {brand.name}
              </h3>
           </div>

           {/* Score & Action */}
           <div className="flex items-end justify-between border-t border-white/5 pt-4 group-hover:border-white/10 transition-colors">
              
              {/* Trust Score Visualizer */}
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Trust Score</span>
                 <div className="flex items-baseline gap-1.5">
                    <span className={`text-3xl font-mono font-bold tracking-tighter ${brand.trust_score >= 80 ? 'text-white' : 'text-zinc-400'} group-hover:text-emerald-400 transition-colors`}>
                        {brand.trust_score}
                    </span>
                    
                    {/* Mini barre de progression */}
                    <div className="flex flex-col gap-[2px] mb-1.5">
                       <div className={`h-1 w-1 rounded-full ${brand.trust_score > 20 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                       <div className={`h-1 w-1 rounded-full ${brand.trust_score > 50 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                       <div className={`h-1 w-1 rounded-full ${brand.trust_score > 80 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                    </div>
                 </div>
              </div>

              {/* Bouton d'action magnétique */}
              <div className="relative h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all duration-500 group-hover:scale-110">
                 <ArrowRight size={18} className="text-zinc-400 group-hover:text-emerald-400 transition-all duration-500 group-hover:-rotate-45" />
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}