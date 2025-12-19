import { ArrowRight, ScanLine } from "lucide-react";
import Badge from "./Badge";

const formatMoney = (amount: number) => {
    if (amount === 0) return '—';
    return amount >= 1000 ? `$${(amount / 1000).toFixed(1)}k` : `$${amount}`;
};

export default function BrandCard({ brand, onClick }: { brand: any, onClick: (b: any) => void }) {
  return (
    <div onClick={() => onClick(brand)} className="relative overflow-hidden glass-panel p-5 rounded-2xl min-w-[280px] transition-all duration-300 group cursor-pointer snap-start hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] border border-white/5 bg-white/5 backdrop-blur-md">
        
        {/* --- EFFET SCAN HOLOGRAPHIQUE --- */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0">
            {/* Barre de scan qui descend */}
            <div className="w-full h-[40%] bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent animate-scan absolute top-0 left-0 blur-md"></div>
            <div className="w-full h-[2px] bg-emerald-400/30 shadow-[0_0_10px_#34d399] animate-scan absolute top-0 left-0"></div>
        </div>
        {/* -------------------------------- */}

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-white mb-0.5 text-lg group-hover:text-emerald-400 transition-colors tracking-tight">{brand.name}</h3>
                    <p className="text-xs text-zinc-500 font-medium">{brand.category}</p>
                </div>
                <Badge status={brand.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/20 p-2 rounded-lg border border-white/5 group-hover:border-emerald-500/20 transition-colors">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1 font-bold">This Month</p>
                    <p className="text-sm font-mono text-white">{formatMoney(brand.month)}</p>
                </div>
                <div className="bg-black/20 p-2 rounded-lg border border-white/5 group-hover:border-emerald-500/20 transition-colors">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1 font-bold">All Time</p>
                    <p className="text-sm font-mono text-white">{formatMoney(brand.total)}</p>
                </div>
            </div>

            <div className="pt-4 border-t border-white/5 group-hover:border-emerald-500/20 transition-colors">
                <p className="text-xs text-zinc-400 italic mb-3 line-clamp-1 group-hover:text-zinc-300">"{brand.claim}"</p>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500 group-hover:text-emerald-400 transition-colors font-bold uppercase tracking-wider">
                    <ScanLine size={12} /> View Proof <ArrowRight size={12} />
                </div>
            </div>
        </div>
    </div>
  );
}