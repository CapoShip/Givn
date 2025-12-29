"use client";

import { useFormState, useFormStatus } from "react-dom";
import { uploadProof } from "@/app/actions/proofs";
import { UploadCloud, CheckCircle, AlertCircle, FileText } from "lucide-react";

const initialState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6"
    >
      {pending ? (
        <>
          <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          Minting on-chain...
        </>
      ) : (
        <>
          <UploadCloud size={20} />
          MINT PROOF RECORD
        </>
      )}
    </button>
  );
}

export default function SubmitProofForm({ brands }: { brands: any[] }) {
  // On connecte le formulaire à l'action serveur 'uploadProof'
  const [state, formAction] = useFormState(uploadProof, initialState);

  return (
    <form action={formAction} className="space-y-5">
      
      {/* 1. SÉLECTION DE LA MARQUE */}
      <div>
        <label className="block text-xs uppercase text-zinc-500 mb-2 font-bold tracking-wider">
          Brand Entity
        </label>
        <div className="relative">
          <select
            name="brandId"
            required
            className="w-full bg-black/50 border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:border-emerald-500 appearance-none"
          >
            <option value="" className="text-zinc-500">Select a brand...</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
            ▼
          </div>
        </div>
      </div>

      {/* 2. ✅ NOUVEAU CHAMP : DESCRIPTION / CONTEXTE */}
      <div>
        <label className="block text-xs uppercase text-zinc-500 mb-2 font-bold tracking-wider flex items-center gap-2">
          <FileText size={12} /> Context / Description
        </label>
        <input
          type="text"
          name="title"
          placeholder="Ex: Google 2024 Environmental Report (Page 36)"
          required
          className="w-full bg-black/50 border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:border-emerald-500 placeholder:text-zinc-700"
        />
        <p className="text-[10px] text-zinc-600 mt-1">
          Appears on the public proof detail page.
        </p>
      </div>

      {/* 3. MONTANT & DEVISE */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-xs uppercase text-zinc-500 mb-2 font-bold tracking-wider">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            step="0.01"
            placeholder="0.00"
            required
            className="w-full bg-black/50 border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-lg"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-xs uppercase text-zinc-500 mb-2 font-bold tracking-wider">
            Currency
          </label>
          <div className="relative">
            <select
              name="currency"
              className="w-full bg-black/50 border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:border-emerald-500 appearance-none font-mono"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="ETH">ETH</option>
              <option value="BTC">BTC</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* 4. FICHIER PREUVE */}
      <div>
        <label className="block text-xs uppercase text-zinc-500 mb-2 font-bold tracking-wider">
          Evidence Document
        </label>
        <div className="relative border border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
          <input
            type="file"
            name="file"
            required
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="p-8 flex flex-col items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
            <UploadCloud size={24} className="mb-2" />
            <span className="text-xs font-bold uppercase">Click to upload proof</span>
            <span className="text-[10px] opacity-50 mt-1">PDF, PNG, JPG (Max 5MB)</span>
          </div>
        </div>
      </div>

      {/* 5. MESSAGE DE RETOUR */}
      {state.message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
            state.success
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {state.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {state.message}
        </div>
      )}

      {/* 6. BOUTON SUBMIT */}
      <SubmitButton />
    </form>
  );
}