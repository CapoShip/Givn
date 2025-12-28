"use client";

import { ArrowRight } from "lucide-react";
import Badge from "./Badge";

// Interface locale pour garantir que le composant sait quoi afficher
interface BrandCardProps {
  brand: {
    id: string;
    name: string;
    category: string;
    // ✅ On gère l'URL du logo (peut être null ou undefined)
    logo_url?: string | null; 
    trust_score: number;
    status: "VERIFIED" | "PENDING";
  };
  onClick: () => void;
}

export function BrandCard({ brand, onClick }: BrandCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col justify-between p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10 h-full min-h-[200px]"
    >
      {/* HEADER : Logo + Badge */}
      <div className="flex justify-between items-start mb-6">
        {/* LOGO CONTAINER (Fond blanc pour visibilité parfaite) */}
        <div className="h-12 w-12 rounded-lg bg-white border border-white/10 p-1.5 flex items-center justify-center shadow-sm overflow-hidden">
          {brand.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={brand.logo_url} 
              alt={brand.name} 
              className="w-full h-full object-contain"
            />
          ) : (
            // Fallback si pas de logo : Première lettre en noir
            <span className="text-black font-bold text-lg">
              {brand.name.charAt(0)}
            </span>
          )}
        </div>

        <Badge status={brand.status as any} />
      </div>

      {/* INFO : Nom + Score */}
      <div>
        <p className="text-xs text-zinc-500 font-mono mb-1 uppercase tracking-wider">{brand.category}</p>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">
          {brand.name}
        </h3>
        
        <div className="flex items-end justify-between mt-4">
          <div>
            <span className="text-2xl font-mono font-bold text-white">{brand.trust_score}</span>
            <span className="text-zinc-600 text-xs ml-1">/100 TRUST</span>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
             <ArrowRight size={14} className="-ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}