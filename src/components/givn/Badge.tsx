import React from 'react';
import { ShieldCheck, Clock, AlertCircle } from 'lucide-react';

export default function Badge({ status }: { status: string }) {
    if (status === 'VERIFIED') {
        return (
            <div className="relative overflow-hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {/* Animation de reflet (Shimmer) */}
                <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                
                <ShieldCheck size={12} className="relative z-10" />
                <span className="text-[10px] font-bold tracking-widest uppercase relative z-10">Verified</span>
            </div>
        );
    }
    
    if (status === 'PENDING') {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Clock size={12} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Pending</span>
            </div>
        );
    }

    return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle size={12} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Rejected</span>
        </div>
    );
}