"use client";

import { ArrowRight, TrendingUp } from "lucide-react";
import Badge from "./Badge";

// --- UTILS : Générateur de dégradé unique par marque ---
// Ça évite d'avoir des cartes "blanches" ou "vides" quand il n'y a pas de logo.
const getBrandGradient = (name: string) => {
  const gradients = [
    "from-blue-600 to-violet-600",
    "from-emerald-500 to-teal-900",
    "from-orange-500 to-red-900",
    "from-pink-500 to-rose-900",
    "from-cyan-500 to-blue-900",
    "from-purple-500 to-indigo-900",
  ];
  // On choisit une couleur stable basée sur le nom
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

  return (
    <div
      onClick={onClick}
      className="group relative h-full min-h-[220px] w-full cursor-pointer transition-all duration-500 hover:-translate-y-2"
    >
      {/* 1. LUEUR D'AMBIANCE (Glow Effect) */}
      {/* Invisible par défaut, s'allume en vert au survol */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 rounded-3xl blur opacity-0 group-hover:opacity-100 group-hover:from-emerald-500/30 group-hover:via-teal-500/30 group-hover:to-emerald-600/30 transition duration-500" />

      {/* 2. LA CARTE (Glassmorphism) */}
      <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 shadow-2xl transition-all duration-300 group-hover:border-emerald-500/30 group-hover:bg-[#0f0f0f]">
        
        {/* Dégradé de fond subtil en haut de la carte */}
        <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${gradient} opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none`} />

        {/* --- HEADER : Logo & Status --- */}
        <div className="relative flex justify-between items-start mb-8 z-10">
          {/* LOGO CONTAINER : Design "Squircle" élégant */}
          <div className="relative h-16 w-16 shrink-0 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-white/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
            {brand.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logo_url}
                alt={brand.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  // Fallback automatique si l'image charge mal
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', gradient.split(' ')[0], gradient.split(' ')[1]);
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-white font-bold text-2xl">${brand.name.charAt(0)}</span>`;
                }}
              />
            ) : (
              // Pas de logo ? On met la première lettre avec le dégradé de la marque
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <span className="text-white font-bold text-2xl drop-shadow-md">
                  {brand.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <Badge status={brand.status as any} />
        </div>

        {/* --- BODY : Infos --- */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border border-white/10 px-2 py-0.5 rounded-full bg-white/5">
              {brand.category}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-emerald-200 transition-all">
            {brand.name}
          </h3>

          <div className="flex items-end justify-between pt-4 border-t border-white/5 group-hover:border-emerald-500/20 transition-colors">
            {/* Score */}
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Trust Score</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-mono font-bold ${brand.trust_score > 50 ? 'text-white' : 'text-zinc-400'}`}>
                  {brand.trust_score}
                </span>
                <span className="text-xs text-zinc-600 font-medium">/100</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-400 group-hover:scale-110 group-hover:rotate-[-45deg] transition-all duration-300 shadow-sm">
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}