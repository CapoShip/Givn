import { X, ExternalLink, TrendingUp, Sprout, FileText, Calendar, ArrowRight } from "lucide-react";
import Badge from "./Badge";
import SimpleAreaChart from "./SimpleAreaChart";
import { useMemo } from "react";

const formatMoney = (amount: number) => {
    if (amount === 0) return '—';
    return amount >= 1000 ? `$${(amount / 1000).toFixed(1)}k` : `$${amount}`;
};

// Fonction déterministe pour générer des données "stables" basées sur l'ID de la marque
const generateStableChartData = (brandId: number) => {
    return Array.from({ length: 15 }, (_, i) => ({
        day: `Day ${i+1}`,
        // Formule pseudo-aléatoire basée sur l'ID pour que la courbe soit unique mais fixe par marque
        value: 100 + (Math.sin(i + brandId) * 50) + (i * 10) + (brandId * 20)
    }));
};

export default function BrandDetailModal({ brand, onClose, onOpenProof }: { brand: any, onClose: () => void, onOpenProof: () => void }) {
    if (!brand) return null;
    
    // Utilisation de useMemo pour ne pas régénérer les données au re-render
    const chartData = useMemo(() => generateStableChartData(brand.id), [brand.id]);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity modal-overlay" onClick={onClose}></div>
            <div className="relative w-full max-w-3xl bg-[#090909] border border-white/10 rounded-2xl shadow-2xl overflow-hidden modal-content flex flex-col max-h-[90vh]">
                <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-start bg-gradient-to-b from-white/5 to-transparent">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">{brand.name}</h2>
                            <Badge status={brand.status} />
                        </div>
                        <p className="text-zinc-400 text-sm max-w-lg">{brand.description}</p>
                        <a href={brand.website} target="_blank" className="flex items-center gap-1 text-xs text-emerald-400 mt-2 hover:underline">
                            Visit Website <ExternalLink size={12} />
                        </a>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                    {/* ... (Stats Grid inchangée - reprendre le code original) ... */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Month</p>
                            <p className="text-xl font-mono text-white">{formatMoney(brand.month)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">All Time</p>
                            <p className="text-xl font-mono text-white">{formatMoney(brand.total)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Last Proof</p>
                            <p className="text-sm font-mono text-zinc-300">{brand.lastProof.split(' ')[0]}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Trend</p>
                            <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                                <TrendingUp size={16} /> +{brand.id * 2}%
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 p-4 border border-emerald-900/50 bg-emerald-900/10 rounded-xl flex items-start gap-3">
                        <div className="mt-1 text-emerald-500"><Sprout size={20} /></div>
                        <div>
                            <h4 className="text-sm font-bold text-emerald-100 mb-1">Active Claim</h4>
                            <p className="text-sm text-emerald-200/80 italic">"{brand.claim}"</p>
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

                    <div>
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <FileText size={16} /> Evidence Trail
                        </h4>
                        <div className="space-y-2">
                            {[1, 2, 3].map((item) => (
                                <div 
                                    key={item} 
                                    onClick={onOpenProof} // Ouvre la preuve
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium">Receipt #{202490 + item + brand.id}</p>
                                            <p className="text-xs text-zinc-500 flex items-center gap-1"><Calendar size={12} /> Dec {12-item}, 2025</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <div>
                                            <span className="text-xs font-mono text-emerald-400 block">${450.00 * item}</span>
                                            <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Verified</span>
                                        </div>
                                        <ArrowRight size={14} className="text-zinc-600 group-hover:text-white -ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}