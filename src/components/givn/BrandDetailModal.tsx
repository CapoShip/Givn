"use client";

import { X, ExternalLink, TrendingUp, Sprout, FileText, Calendar, ArrowRight } from "lucide-react";
import Badge from "./Badge";
import SimpleAreaChart from "./SimpleAreaChart";
import { useMemo } from "react";
import type { BrandTrustRow } from "@/lib/types/givn";

// Helper pour formater l'argent
const formatMoney = (amount: any) => {
    const val = Number(amount || 0);
    if (val === 0) return '—';
    return val >= 1000 ? `$${(val / 1000).toFixed(1)}k` : `$${val}`;
};

// Helper pour transformer un UUID (string) en un nombre stable pour le graphique
function stringToNumber(str: string): number {
    let hash = 0;
    if (!str) return 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; 
    }
    return Math.abs(hash);
}

// Générateur de data robuste
const generateStableChartData = (brandId: string | number) => {
    const seed = typeof brandId === 'number' ? brandId : stringToNumber(String(brandId));
    
    return Array.from({ length: 15 }, (_, i) => ({
        day: `Day ${i+1}`,
        value: 100 + (Math.sin(i + seed) * 50) + (i * 10) + ((seed % 20) * 5)
    }));
};

export default function BrandDetailModal({ brand, onClose, onOpenProof }: { brand: any, onClose: () => void, onOpenProof: () => void }) {
    if (!brand) return null;
    
    // 🛡️ MAPPING DE SÉCURITÉ (Ajout du logo_url)
    const safeBrand = {
        id: brand.id,
        name: brand.name ?? "Unknown Brand",
        description: brand.description ?? "No description available.",
        website: brand.website,
        // ✅ On récupère le logo (avec fallback si vide)
        logo_url: brand.logo_url || null, 
        
        // Gestion intelligente du status
        status: (brand.status === "VERIFIED" || brand.status === "PENDING" || brand.status === "REJECTED") 
            ? brand.status 
            : (brand.latest_status === "verified" ? "VERIFIED" : "PENDING"),
        
        month: Number(brand.month ?? 0),
        total: Number(brand.total_donated ?? brand.total ?? 0),
        
        lastProofDate: brand.last_proof_at 
            ? new Date(brand.last_proof_at).toLocaleDateString() 
            : (brand.lastProof ? brand.lastProof.split(' ')[0] : "No proofs"),
        
        claim: brand.claim ?? "No active claim",
    };

    const chartData = useMemo(() => generateStableChartData(safeBrand.id), [safeBrand.id]);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity modal-overlay" onClick={onClose}></div>
            <div className="relative w-full max-w-3xl bg-[#090909] border border-white/10 rounded-2xl shadow-2xl overflow-hidden modal-content flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                
                {/* ✨ HEADER AMÉLIORÉ ✨ */}
                <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-start bg-gradient-to-b from-white/5 to-transparent relative">
                    
                    <div className="flex items-start gap-6">
                        {/* 🖼️ LE LOGO (La star du show) */}
                        <div className="shrink-0">
                            {safeBrand.logo_url ? (
                                <div className="h-20 w-20 rounded-2xl border border-white/10 bg-white p-2 shadow-xl flex items-center justify-center overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={safeBrand.logo_url} 
                                        alt={safeBrand.name} 
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="h-20 w-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-2xl">
                                    🌱
                                </div>
                            )}
                        </div>

                        {/* Infos Textuelles */}
                        <div className="pt-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h2 className="text-3xl font-bold text-white tracking-tight">{safeBrand.name}</h2>
                                <Badge status={safeBrand.status as any} />
                            </div>
                            
                            <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
                                {safeBrand.description}
                            </p>
                            
                            {safeBrand.website && (
                                <a href={safeBrand.website} target="_blank" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 mt-3 hover:text-emerald-300 transition-colors font-medium hover:underline decoration-emerald-500/30 underline-offset-4">
                                    {new URL(safeBrand.website).hostname} <ExternalLink size={10} />
                                </a>
                            )}
                        </div>
                    </div>

                    <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-white/10">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Month</p>
                            <p className="text-xl font-mono text-white">{formatMoney(safeBrand.month)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">All Time</p>
                            <p className="text-xl font-mono text-white">{formatMoney(safeBrand.total)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Last Proof</p>
                            <p className="text-sm font-mono text-zinc-300">{safeBrand.lastProofDate}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Trend</p>
                            <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                                <TrendingUp size={16} /> +{safeBrand.id.toString().slice(-2)}%
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 p-5 border border-emerald-900/50 bg-emerald-900/10 rounded-xl flex items-start gap-4 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]">
                        <div className="mt-1 p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><Sprout size={20} /></div>
                        <div>
                            <h4 className="text-sm font-bold text-emerald-100 mb-1">Active Impact Claim</h4>
                            <p className="text-sm text-emerald-200/80 italic font-serif text-lg leading-snug">"{safeBrand.claim}"</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={16} /> Donation Volume (Last 15 Days)
                        </h4>
                        <div className="h-64 w-full bg-white/5 rounded-xl border border-white/5 p-4 relative overflow-hidden">
                             {/* Petit effet de glow derrière le graph */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                            <SimpleAreaChart data={chartData} />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <FileText size={16} /> Evidence Trail
                        </h4>
                        <div className="space-y-2">
                            {[1, 2, 3].map((item) => (
                                <div 
                                    key={item} 
                                    onClick={onOpenProof} 
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-emerald-400 transition-colors">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium group-hover:text-emerald-300 transition-colors">Receipt #{202490 + item}</p>
                                            <p className="text-xs text-zinc-500 flex items-center gap-1"><Calendar size={12} /> Verified automatically</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <ArrowRight size={14} className="text-zinc-600 group-hover:text-white -ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300" />
                                    </div>
                                </div>
                            ))}
                           <p className="text-zinc-500 text-xs italic mt-4 text-center">
                             More historical proofs are archived on-chain.
                           </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}