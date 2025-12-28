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
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Générateur de data robuste
const generateStableChartData = (brandId: string | number) => {
    // Si c'est un UUID, on le convertit en nombre stable
    const seed = typeof brandId === 'number' ? brandId : stringToNumber(String(brandId));
    
    return Array.from({ length: 15 }, (_, i) => ({
        day: `Day ${i+1}`,
        value: 100 + (Math.sin(i + seed) * 50) + (i * 10) + ((seed % 20) * 5)
    }));
};

// Types permissifs pour accepter soit le DB row, soit l'ancien mock
type BrandData = Partial<BrandTrustRow> & {
    // Champs legacy potentiels
    month?: number;
    total?: number;
    lastProof?: string;
    claim?: string;
    description?: string;
    // status géré via latest_status ou status direct
    status?: string; 
};

export default function BrandDetailModal({ brand, onClose, onOpenProof }: { brand: any, onClose: () => void, onOpenProof: () => void }) {
    if (!brand) return null;
    
    // 🛡️ MAPPING DE SÉCURITÉ (Le Pare-feu du Front)
    // On s'assure d'avoir des valeurs utilisables qu'importe la source (DB ou Mock)
    const safeBrand = {
        id: brand.id,
        name: brand.name ?? "Unknown Brand",
        description: brand.description ?? "No description available.",
        website: brand.website,
        // Gestion intelligente du status
        status: (brand.status === "VERIFIED" || brand.status === "PENDING" || brand.status === "REJECTED") 
            ? brand.status 
            : (brand.latest_status === "verified" ? "VERIFIED" : "PENDING"),
        
        // Mapping snake_case (DB) -> camelCase (UI)
        month: Number(brand.month ?? 0), // Pas encore calculé en DB, par défaut 0
        total: Number(brand.total_donated ?? brand.total ?? 0),
        
        // Date safe
        lastProofDate: brand.last_proof_at 
            ? new Date(brand.last_proof_at).toLocaleDateString() 
            : (brand.lastProof ? brand.lastProof.split(' ')[0] : "No proofs"),
        
        claim: brand.claim ?? "No active claim",
    };

    // Utilisation de l'ID string/number sans crash
    const chartData = useMemo(() => generateStableChartData(safeBrand.id), [safeBrand.id]);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity modal-overlay" onClick={onClose}></div>
            <div className="relative w-full max-w-3xl bg-[#090909] border border-white/10 rounded-2xl shadow-2xl overflow-hidden modal-content flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-start bg-gradient-to-b from-white/5 to-transparent">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">{safeBrand.name}</h2>
                            <Badge status={safeBrand.status as any} />
                        </div>
                        <p className="text-zinc-400 text-sm max-w-lg">{safeBrand.description}</p>
                        {safeBrand.website && (
                            <a href={safeBrand.website} target="_blank" className="flex items-center gap-1 text-xs text-emerald-400 mt-2 hover:underline">
                                Visit Website <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Month</p>
                            <p className="text-xl font-mono text-white">{formatMoney(safeBrand.month)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">All Time</p>
                            <p className="text-xl font-mono text-white">{formatMoney(safeBrand.total)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Last Proof</p>
                            <p className="text-sm font-mono text-zinc-300">{safeBrand.lastProofDate}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Trend</p>
                            <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                                <TrendingUp size={16} /> +24%
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 p-4 border border-emerald-900/50 bg-emerald-900/10 rounded-xl flex items-start gap-3">
                        <div className="mt-1 text-emerald-500"><Sprout size={20} /></div>
                        <div>
                            <h4 className="text-sm font-bold text-emerald-100 mb-1">Active Claim</h4>
                            <p className="text-sm text-emerald-200/80 italic">"{safeBrand.claim}"</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={16} /> Donation Volume (Last 15 Days)
                        </h4>
                        <div className="h-64 w-full bg-white/5 rounded-xl border border-white/5 p-4">
                            <SimpleAreaChart data={chartData} />
                        </div>
                    </div>

                    {/* Placeholder pour les preuves (à connecter plus tard à la DB) */}
                    <div>
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <FileText size={16} /> Evidence Trail
                        </h4>
                        <div className="space-y-2">
                           <p className="text-zinc-500 text-xs italic">
                             Live proof feed coming in v2.
                           </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}