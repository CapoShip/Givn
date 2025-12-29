"use client";

import { Activity, Clock } from "lucide-react";
import { useEffect, useState } from "react";

// Formatage de l'argent (ex: $1,234,567)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Fonction utilitaire pour le temps écoulé
const timeAgo = (dateString: string) => {
  if (!dateString) return "";
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

type Props = {
  totalVolume: number;
  recentActivity: any[];
};

export default function GlobalPulse({ totalVolume, recentActivity }: Props) {
  // Petit hack 'mounted' pour éviter les erreurs d'hydratation avec les dates
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="w-full bg-[#050505] border-b border-white/5 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[100px] bg-emerald-500/5 blur-[80px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 py-8 md:py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* GAUCHE: LE CHIFFRE MASSIF */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">
                Global Donation Volume
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-500 tracking-tighter font-mono animate-in fade-in slide-in-from-bottom-4 duration-700">
              {formatCurrency(totalVolume)}
            </h1>
          </div>

          {/* DROITE: TICKER D'ACTIVITÉ (Derniers dons) */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-3">
             <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-widest mb-1">
                <Activity size={14} className="text-emerald-500" />
                Live Transactions
             </div>
             
             <div className="flex flex-col gap-2 w-full md:w-[320px]">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, i) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5 text-sm animate-in slide-in-from-right fade-in duration-500 hover:bg-white/[0.05] transition-colors"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                       <div className="flex flex-col text-left">
                         <span className="font-bold text-white">{item.brand}</span>
                         
                         {/* 👇 AFFICHAGE DU TEMPS ÉCOULÉ */}
                         {mounted && item.timestamp && (
                           <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                             <Clock size={10} /> {timeAgo(item.timestamp)}
                           </span>
                         )}
                       </div>
                       
                       <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded text-xs border border-emerald-500/20">
                         +{formatCurrency(item.amount)}
                       </span>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-600 text-xs italic text-right py-2">
                    Waiting for new blocks...
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}