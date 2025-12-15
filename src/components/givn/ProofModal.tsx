import { X, FileText, ExternalLink, CheckCircle } from "lucide-react";

export default function ProofModal({ isOpen, onClose, brandName }: { isOpen: boolean, onClose: () => void, brandName: string }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-[#090909] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[pop-in_0.3s_ease-out]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <CheckCircle size={18} className="text-emerald-400" />
                        Verified Proof
                    </h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-zinc-900 rounded-xl flex items-center justify-center mb-4 border border-zinc-800">
                        <FileText size={32} className="text-zinc-400" />
                    </div>
                    <p className="text-sm text-zinc-400 mb-6">
                        This is a verifiable donation receipt for <span className="text-white font-bold">{brandName}</span>.
                        <br/>Stored immutably on-chain.
                    </p>

                    <div className="w-full bg-zinc-900/50 p-4 rounded-lg border border-white/5 text-left mb-6 font-mono text-xs text-zinc-500 break-all">
                        <p className="mb-1 uppercase font-bold text-[10px] text-zinc-600">Transaction Hash</p>
                        0x8f3c...9a2b1c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
                    </div>

                    <a 
                        href="#" 
                        className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
                    >
                        View on Etherscan <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
}