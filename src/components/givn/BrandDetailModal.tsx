"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js"; 
import { 
  X, ExternalLink, TrendingUp, Clock, Fingerprint, 
  CheckCircle, ArrowRight 
} from "lucide-react";
import Badge from "./Badge";
import SimpleAreaChart from "./SimpleAreaChart";

// 1. Initialisation du Client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- HELPERS ---
const formatMoney = (amount: any) => {
    const val = Number(amount || 0);
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', currency: 'USD', notation: 'compact' 
    }).format(val);
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return "Pending";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
    });
};

interface BrandDetailModalProps {
  brand: any;
  onClose: () => void;
}

export default function BrandDetailModal({ brand, onClose }: BrandDetailModalProps) {
  const [proofs, setProofs] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  // --- 2. FETCH DATA & CALCUL DU GRAPHIQUE ---
  useEffect(() => {
    async function fetchData() {
        if (!brand?.id) return;
        setLoading(true);
        
        // A. On récupère les preuves (Triées par date croissante pour le calcul cumulatif)
        const { data } = await supabase
            .from('proofs')
            .select('*')
            .eq('brand_id', brand.id)
            .eq('status', 'verified')
            .order('verified_at', { ascending: true }); 
        
        if (data && data.length > 0) {
            // 1. Calcul des données du GRAPHIQUE (Cumulatif)
            let runningTotal = 0;
            const realChartData = data.map((p) => {
                runningTotal += Number(p.amount);
                return {
                    label: new Date(p.verified_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    value: runningTotal
                };
            });
            
            // ✅ IMPORTANT : On ajoute TOUJOURS un point de départ à 0 au début.
            // Cela assure que la courbe part du bas et monte vers le montant actuel.
            realChartData.unshift({ label: 'Start', value: 0 });
            
            setChartData(realChartData);

            // 2. Mise à jour de la liste (Inversée pour afficher le plus récent en haut de la liste)
            setProofs([...data].reverse());
        } else {
            // Pas de données : tableau vide
            setProofs([]);
            setChartData([]);
        }
        
        setLoading(false);
    }
    fetchData();
  }, [brand]);

  if (!brand) return null;

  // Calculs totaux pour l'affichage (Fallback sur les données de la marque si pas de preuves chargées)
  const trustScore = brand.trust_score || 0;
  // Si on a chargé les preuves, on calcule le vrai total, sinon on prend le cache
  const realTotal = proofs.reduce((acc, p) => acc + Number(p.amount), 0);
  const displayTotal = realTotal > 0 ? realTotal : (brand.total_donated || 0);
  const proofCount = proofs.length > 0 ? proofs.length : (brand.proof_count || 0);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity modal-overlay" onClick={onClose} />
      
      {/* Contenu Modal */}
      <div className="relative w-full max-w-2xl bg-[#080808] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden max-h-[92vh] overflow-y-auto hide-scrollbar animate-enter modal-content">
        
        <div className="p-8 md:p-12 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors bg-white/5 p-3 rounded-full hover:bg-white/10 z-50 border border-white/5">
            <X size={24} />
          </button>

          {/* HEADER : Identité */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
            <div className="w-28 h-28 rounded-3xl bg-[#0c0c0c] border border-white/10 flex items-center justify-center shadow-3xl shrink-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-white">{brand.name?.charAt(0)}</span>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3">{brand.name}</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge status={'VERIFIED'} />
                  <a href={brand.website || '#'} target="_blank" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-white transition-all bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                    <ExternalLink size={12} /> Protocol Access
                  </a>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed border-l-2 border-emerald-500/30 pl-4 italic">
                "{brand.description || "Verifying corporate impact data on-chain..."}"
              </p>
            </div>
          </div>

          {/* GRID : Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {/* Trust Score */}
            <div className="bg-gradient-to-b from-zinc-900/40 to-black border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all group overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4">Consensus</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white font-mono tracking-tighter">{trustScore}</span>
                <span className="text-lg text-zinc-700 font-bold">%</span>
              </div>
              <div className="w-full bg-zinc-800/50 h-1.5 rounded-full mt-6 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-1000 shadow-[0_0_15px_#10b981]" style={{ width: `${trustScore}%` }} />
              </div>
            </div>

            {/* Block Count */}
            <div className="bg-gradient-to-b from-zinc-900/40 to-black border border-white/5 rounded-3xl p-6 hover:border-blue-500/30 transition-all">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4">Blocks</p>
              <span className="text-5xl font-black text-white font-mono tracking-tighter">{proofCount}</span>
              <p className="text-[10px] text-blue-400 mt-6 flex items-center gap-2 font-bold uppercase tracking-widest">
                <Clock size={12} /> Syncing Live
              </p>
            </div>

            {/* Total Money */}
            <div className="bg-gradient-to-b from-zinc-900/40 to-black border border-white/5 rounded-3xl p-6 hover:border-yellow-500/30 transition-all">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4">Capital</p>
              <span className="text-3xl font-black text-white font-mono tracking-tighter break-all">
                {formatMoney(displayTotal)}
              </span>
              <div className="flex items-center gap-2 mt-6 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                <TrendingUp size={14} /> Impact Rising
              </div>
            </div>
          </div>

          {/* GRAPHIQUE : Impact Velocity */}
          <div className="mb-12 w-full bg-[#050505] rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col shadow-inner min-h-[300px]">
             {/* Header du Graph */}
             <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Impact Velocity</p>
                  <h4 className="text-white font-bold text-sm">Donation Accumulation</h4>
                </div>
                <div className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                  <TrendingUp size={20} />
                </div>
             </div>
             
             {/* Container Graphique */}
             <div className="flex-1 w-full relative h-48 md:h-64">
                <SimpleAreaChart data={chartData} />
             </div>
          </div>

          {/* LISTE : Immutable Proof Stream */}
          <div className="border-t border-white/10 pt-10">
            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
              <Fingerprint size={20} className="text-emerald-500" /> Immutable Proof Stream
            </h3>
            
            <div className="space-y-4">
              {loading ? (
                  <div className="text-zinc-600 animate-pulse text-xs uppercase tracking-widest text-center py-4">Decrypting ledger data...</div>
              ) : proofs.length > 0 ? (
                  proofs.map((proof) => (
                    <div 
                        key={proof.id} 
                        className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden" 
                        onClick={() => proof.proof_url && window.open(proof.proof_url, '_blank')}
                    >
                      <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500/0 group-hover:bg-emerald-500 transition-all" />
                      
                      <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <CheckCircle size={24} className="text-zinc-600 group-hover:text-emerald-400 transition-colors mt-1" />
                        <div>
                          <p className="text-sm font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                              {proof.title || "Verified Donation Record"}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                              <span>{formatDate(proof.verified_at)}</span>
                              <span className="text-zinc-700">|</span>
                              <span className="uppercase tracking-widest">ID: {proof.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                           <span className="font-mono font-bold text-white text-lg bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                               {formatMoney(proof.amount)}
                           </span>
                           <ArrowRight size={18} className="text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))
              ) : (
                  <div className="p-8 border border-dashed border-zinc-800 rounded-3xl text-center text-zinc-600 text-sm bg-white/[0.02]">
                      No verified proofs found on the ledger yet.
                  </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}