import React from 'react';
import { ArrowUpRight, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import Badge from './Badge';

interface BrandCardProps {
    brand: any;
    onClick: (brand: any) => void;
}

const formatMoney = (amount: number) => {
    if (amount === 0) return '—';
    return amount >= 1000 ? `$${(amount / 1000).toFixed(1)}k` : `$${amount}`;
};

export default function BrandCard({ brand, onClick }: BrandCardProps) {
    return (
        <div 
            onClick={() => onClick(brand)}
            className="group relative rounded-2xl p-5 cursor-pointer border border-white/5 bg-[#0F0F10] hover:bg-[#141415] transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] hover:-translate-y-1 overflow-hidden"
        >
            {/* Effet de dégradé subtil en arrière-plan au survol */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-all duration-500"></div>

            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                
                {/* Header Carte */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        {/* Avatar / Initiale */}
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-white/5 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-colors">
                            {brand.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg leading-tight group-hover:text-emerald-400 transition-colors">
                                {brand.name}
                            </h3>
                            <span className="text-xs text-zinc-500">{brand.category}</span>
                        </div>
                    </div>
                    <Badge status={brand.status} />
                </div>

                {/* Claim Text */}
                <div className="pl-[52px]">
                    <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed font-light">
                        {brand.claim}
                    </p>
                </div>

                {/* Footer Carte (Données) */}
                <div className="mt-2 pt-4 border-t border-white/5 flex items-end justify-between pl-[52px]">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-semibold">This Month</span>
                        <span className="text-xl font-mono text-white font-medium tracking-tight">
                            {formatMoney(brand.month)}
                        </span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300 transform group-hover:rotate-45">
                        <ArrowUpRight size={16} strokeWidth={2.5} />
                    </div>
                </div>
            </div>
        </div>
    );
}