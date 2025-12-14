import { Check, XCircle } from "lucide-react";

export default function Badge({ status }: { status: string }) {
  const isVerified = status === 'VERIFIED';
  
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border transition-all duration-300 ${
      isVerified 
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
      : 'border-red-500/30 bg-red-500/10 text-red-400'
    }`}>
      {isVerified ? (
        <div className="bg-emerald-500 rounded-full p-0.5 text-black"><Check size={10} strokeWidth={3} /></div>
      ) : (
        <XCircle size={12} />
      )}
      {status}
    </div>
  );
}