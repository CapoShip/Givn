import { ArrowRight } from "lucide-react";
import Badge from "./Badge";

const formatMoney = (amount: number) => {
    if (amount === 0) return '—';
    return amount >= 1000 ? `$${(amount / 1000).toFixed(1)}k` : `$${amount}`;
};

export default function BrandCard({ brand, onClick }: { brand: any, onClick: (b: any) => void }) {
  return (
    <div onClick={() => onClick(brand)} className="glass-panel p-5 rounded-2xl min-w-[280px] transition-all duration-300 group cursor-pointer snap-start hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)] border border-white/5 bg-white/5 backdrop-blur-md">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="font-bold text-white mb-0.5 text-lg group-hover:text-emerald-400 transition-colors">{brand.name}</h3>
                <p className="text-xs text-zinc-500 font-medium">{brand.category}</p>
            </div>
            <Badge status={brand.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-semibold">This Month</p>
                <p className="text-sm font-mono text-white">{formatMoney(brand.month)}</p>
            </div>
            <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-semibold">All Time</p>
                <p className="text-sm font-mono text-white">{formatMoney(brand.total)}</p>
            </div>
        </div>

        <div className="pt-4 border-t border-white/5">
            <p className="text-xs text-zinc-400 italic mb-3 line-clamp-1">"{brand.claim}"</p>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 group-hover:text-emerald-400 transition-colors font-medium">
                View brand details <ArrowRight size={12} />
            </div>
        </div>
    </div>
  );
}