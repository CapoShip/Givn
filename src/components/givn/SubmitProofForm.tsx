"use client";

import { useActionState, useEffect, useState } from "react";
import { UploadCloud, DollarSign, Check, Loader2, FileText, Building } from "lucide-react";
// ✅ IMPORT UNIQUEMENT LA FONCTION (Pas d'objets)
import { uploadProof } from "@/app/actions/proofs";

type BrandSimple = {
  id: string;
  name: string;
};

type Props = {
  brands: BrandSimple[]; 
  onSuccess?: () => void;
};

// ✅ L'ÉTAT INITIAL DOIT ÊTRE DÉFINI ICI (Côté Client)
const initialProofState = {
  message: "",
  success: false,
};

export default function SubmitProofForm({ brands, onSuccess }: Props) {
  // Hook pour gérer l'envoi du formulaire
  const [state, formAction, isPending] = useActionState(uploadProof, initialProofState);
  const [fileName, setFileName] = useState<string | null>(null);

  // Reset visuel après succès
  useEffect(() => {
    if (state.success) {
      const t = setTimeout(() => {
        setFileName(null);
        if (onSuccess) onSuccess();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [state.success, onSuccess]);

  // ÉCRAN DE SUCCÈS
  if (state.success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 relative">
           <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20"></div>
           <Check className="w-10 h-10 text-emerald-400 relative z-10" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Proof Verified!</h3>
        <p className="text-zinc-400 text-center max-w-xs text-sm">
          La preuve est on-chain.<br/>
          <span className="text-emerald-400">Le Global Pulse a été mis à jour.</span>
        </p>
      </div>
    );
  }

  // FORMULAIRE
  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-4">
        
        {/* SÉLECTEUR DE MARQUE */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Brand Entity</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <select
              name="brandId"
              required
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 appearance-none transition-all cursor-pointer text-sm"
              defaultValue=""
            >
              <option value="" disabled>Select a brand...</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MONTANT ET DEVISE */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Currency</label>
            <select
              name="currency"
              className="w-full h-12 px-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="BTC">BTC</option>
            </select>
          </div>
        </div>

        {/* UPLOAD FICHIER */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Evidence File</label>
          <div className="relative group">
            <input
              type="file"
              name="file"
              id="file-upload"
              accept=".pdf,.png,.jpg,.jpeg"
              required
              onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div className="w-full h-28 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] group-hover:bg-white/[0.05] group-hover:border-emerald-500/30 transition-all flex flex-col items-center justify-center text-zinc-500 group-hover:text-emerald-400">
              {fileName ? (
                <>
                  <FileText className="w-6 h-6 mb-2 text-emerald-500" />
                  <span className="text-xs font-medium text-white break-all px-4 text-center max-w-full overflow-hidden text-ellipsis">{fileName}</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 mb-2" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-center">Drop Receipt<br/>PDF / Image</span>
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ERROR MESSAGE */}
      {state.message && !state.success && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-mono">
          {state.message}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full h-14 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xl flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying...</span>
          </>
        ) : (
          "MINT PROOF RECORD"
        )}
      </button>
    </form>
  );
}