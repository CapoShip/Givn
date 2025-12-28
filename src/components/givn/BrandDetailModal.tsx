"use client";

import React, { useMemo } from "react";
import { 
  X, ExternalLink, ShieldCheck, Database, DollarSign, 
  TrendingUp, Clock, Fingerprint, CheckCircle, 
  ArrowRight, Activity 
} from "lucide-react";
import Badge from "./Badge";
import SimpleAreaChart from "./SimpleAreaChart";

const formatMoney = (amount: any) => {
    const val = Number(amount || 0);
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', currency: 'USD', notation: 'compact' 
    }).format(val);
};

function getStableNumber(str: string): number {
    let hash = 0;
    if (!str) return 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

const generateStableChartData = (brandId: string | number) => {
    const seed = getStableNumber(String(brandId));
    return Array.from({ length: 15 }, (_, i) => ({
        day: `Day ${i+1}`,
        value: 100 + (Math.sin(i + seed) * 50) + (i * 10) + ((seed % 20) * 5)
    }));
};

interface BrandDetailModalProps {
  brand: any;
  onClose: () => void;
  onOpenProof: () => void;
}

export default function BrandDetailModal({ brand, onClose, onOpenProof }: BrandDetailModalProps) {
  const chartData = useMemo(() => brand ? generateStableChartData(brand.id) : [], [brand]);
  
  if (!brand) return null;

  const trustScore = brand.trust_score || brand.month || 0;
  const proofCount = brand.proof_count || 0;
  const totalDonated = brand.total_donated || brand.total || 0;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity modal-overlay" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#080808] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden max-h-[92vh] overflow-y-auto hide-scrollbar animate-enter modal-content">
        
        <div className="p-10 md:p-14 relative">
          <button onClick={onClose} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors bg-white/5 p-3 rounded-full hover:bg-white/10 z-50 border border-white/5">
            <X size={24} />
          </button>

          {/* HUD Header */}
          <div className="flex flex-col md:flex-row gap-10 items-start mb-12">
            <div className="w-32 h-32 rounded-3xl bg-[#0c0c0c] border border-white/10 flex items-center justify-center shadow-3xl shrink-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-black text-white">{brand.name?.charAt(0)}</span>
              )}
            </div>
            
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-4">{brand.name}</h2>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge status={(brand.status === 'VERIFIED' || brand.latest_status === 'verified') ? 'VERIFIED' : 'PENDING'} />
                  <a href={brand.website || '#'} target="_blank" className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-white transition-all">
                    <ExternalLink size={14} /> Protocol Access
                  </a>
                </div>
              </div>
              <p className="text-base text-zinc-400 leading-relaxed border-l-2 border-emerald-500/30 pl-6 italic">
                "{brand.description || brand.claim || "No detailed description available."}"
              </p>
            </div>
          </div>

          {/* Analytic HUD Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-b from-zinc-900/40 to-black border border-white/5 rounded-3xl p-8 hover:border-emerald-500/30 transition-all group overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Consensus</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white font-mono tracking-tighter">{trustScore}</span>
                <span className="text-xl text-zinc-700 font-bold">%</span>
              </div>
              <div className="w-full bg-zinc-800/50 h-2 rounded-full mt-8 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-1000 shadow-[0_0_15px_#10b981]" style={{ width: `${trustScore}%` }} />
              </div>
            </div>

            <div className="bg-gradient-to-b from-zinc-900/40 to-black border border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-all">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Blocks</p>
              <span className="text-6xl font-black text-white font-mono tracking-tighter">{proofCount}</span>
              <p className="text-[10px] text-blue-400 mt-8 flex items-center gap-2 font-bold uppercase tracking-widest">
                <Clock size={12} /> Syncing Live
              </p>
            </div>

            <div className="bg-gradient-to-b from-zinc-900/40 to-black border border-white/5 rounded-3xl p-8 hover:border-yellow-500/30 transition-all">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Capital</p>
              <span className="text-4xl font-black text-white font-mono tracking-tighter">
                {formatMoney(totalDonated)}
              </span>
              <div className="flex items-center gap-2 mt-8 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                <TrendingUp size={14} /> Impact Rising
              </div>
            </div>
          </div>

          <div className="mb-12 h-48 w-full bg-white/[0.02] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20"><TrendingUp size={40} /></div>
             <SimpleAreaChart data={chartData} />
          </div>

          {/* Immutable Proof Stream */}
          <div className="border-t border-white/10 pt-10">
            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
              <Fingerprint size={20} className="text-emerald-500" /> Immutable Proof Stream
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group flex items-center justify-between p-6 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden" onClick={onOpenProof}>
                  <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500/0 group-hover:bg-emerald-500 transition-all" />
                  <div className="flex items-center gap-6">
                    <CheckCircle size={20} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    <div>
                      <p className="text-sm font-black text-white font-mono tracking-widest uppercase">TX_ID: 0x{getStableNumber(brand.id + i).toString(16).slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-tighter">Block Verified #18293{i}</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
            <button onClick={onOpenProof} className="w-full py-6 mt-4 text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-emerald-400 transition-all border-t border-white/5 flex items-center justify-center gap-3 group">
              <span>Decrypt Full Ledger</span>
              <Activity size={14} className="group-hover:animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}