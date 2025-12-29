"use client";

import { Activity, Globe, Zap } from "lucide-react";

// Formatage de l'argent (ex: $1,234,567)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

type Props = {
  totalVolume: number;
  recentActivity: any[];
};

export default function GlobalPulse({ totalVolume, recentActivity }: Props) {
  return (
    <div className="w-full bg-[#050505] border-b border-white/5 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[100px] bg-emerald-500/5 blur-[80px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 py-8 md:py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* GAUCHE: LE CHIFFRE MASSIV */}
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
            
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-500 tracking-tighter font-mono">
              {formatCurrency(totalVolume)}
            </h1>
          </div>

          {/* DROITE: TICKER D'ACTIVITÉ (Derniers dons) */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-3">
             <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-widest mb-1">
                <Activity size={14} />
                Live Transactions
             </div>
             
             <div className="flex flex-col gap-2 w-full md:w-[300px]">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, i) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5 text-sm animate-in slide-in-from-right fade-in duration-500"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                       <span className="font-bold text-white">{item.brand}</span>
                       <span className="font-mono text-emerald-400">
                         +{formatCurrency(item.amount)}
                       </span>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-600 text-xs italic text-right">No recent activity</div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}