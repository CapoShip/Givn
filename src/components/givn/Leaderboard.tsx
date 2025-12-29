"use client";

import { Trophy, TrendingUp, ShieldCheck, MoreHorizontal } from "lucide-react";
import Link from "next/link";

// Formatage Monétaire
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

type BrandData = {
  id: string;
  name: string;
  category: string;
  trust_score: number;
  total_donated: number;
  // Ajoute d'autres champs si ta DB en a (logo_url, etc.)
};

export default function Leaderboard({ data }: { data: BrandData[] }) {
  
  if (data.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
        <Trophy className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
        <h3 className="text-zinc-400 font-bold">No Data Yet</h3>
        <p className="text-zinc-600 text-sm mt-2">Waiting for the first verified proof to be minted.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* EN-TÊTES DE COLONNES (Visible sur Desktop) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
        <div className="col-span-1">Rank</div>
        <div className="col-span-4">Brand Entity</div>
        <div className="col-span-2">Trust Score</div>
        <div className="col-span-3 text-right">Total Volume</div>
        <div className="col-span-2 text-right">Action</div>
      </div>

      {/* LISTE DES MARQUES */}
      <div className="space-y-2">
        {data.map((brand, index) => (
          <div 
            key={brand.id}
            className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 md:p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-emerald-500/20 hover:bg-white/[0.02] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* 1. RANK */}
            <div className="col-span-1 flex items-center gap-4 md:gap-0">
              <span className={`
                flex items-center justify-center w-8 h-8 rounded-lg font-mono font-bold text-sm
                ${index === 0 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                  index === 1 ? 'bg-zinc-400/10 text-zinc-300 border border-zinc-500/20' : 
                  index === 2 ? 'bg-orange-700/10 text-orange-400 border border-orange-700/20' : 
                  'text-zinc-600 bg-zinc-900 border border-white/5'}
              `}>
                {index + 1}
              </span>
            </div>

            {/* 2. NAME & INFO */}
            <div className="col-span-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-400">
                {brand.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {brand.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="uppercase tracking-wider text-[10px]">{brand.category}</span>
                </div>
              </div>
            </div>

            {/* 3. TRUST SCORE */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={14} className={brand.trust_score > 80 ? "text-emerald-500" : "text-zinc-500"} />
                <span className="font-mono text-sm font-bold text-zinc-300">{brand.trust_score}/100</span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${brand.trust_score > 80 ? 'bg-emerald-500' : 'bg-zinc-600'}`} 
                  style={{ width: `${brand.trust_score}%` }} 
                />
              </div>
            </div>

            {/* 4. TOTAL DONATED (Le Chiffre Important) */}
            <div className="col-span-3 text-right">
              <div className="font-mono text-xl md:text-2xl font-bold text-white tracking-tight">
                {formatMoney(brand.total_donated)}
              </div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-wider flex items-center justify-end gap-1">
                <TrendingUp size={10} /> Verified Volume
              </div>
            </div>

            {/* 5. ACTIONS */}
            <div className="col-span-2 flex justify-end">
              <Link 
                href={`/brand/${brand.id}`}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                View Proofs
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}