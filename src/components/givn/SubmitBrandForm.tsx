"use client";

import { useActionState } from "react";
import { Globe, Building2, AlertCircle, Loader2, Check, Mail } from "lucide-react";
import { submitBrandAction } from "@/app/actions"; // Import de l'action créée ci-dessus

const initialState = {
  message: '',
  success: false
};

export default function SubmitBrandForm({ onSuccess }: { onSuccess: () => void }) {
  // Hook magique qui gère le loading et la réponse du serveur
  const [state, formAction, isPending] = useActionState(submitBrandAction, initialState);

  // Si succès, on déclenche le callback (fermeture modale) après un court délai
  if (state.success) {
    setTimeout(() => onSuccess(), 2000);
    return (
        <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Check className="text-black" size={24} strokeWidth={3} />
            </div>
            <p className="text-emerald-400 font-bold">Submission Received</p>
            <p className="text-zinc-500 text-xs mt-2">Our auditors will contact you shortly.</p>
        </div>
    );
  }

  return (
    <form action={formAction} className="w-full space-y-5">
      {/* Brand Name */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Brand Name</label>
        <div className="relative group">
            <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            <input name="name" type="text" placeholder="Ex: Patagonia" className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700" />
        </div>
        {state.errors?.name && <p className="text-red-400 text-[10px] ml-1 flex items-center gap-1"><AlertCircle size={10}/> {state.errors.name[0]}</p>}
      </div>

      {/* Website */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Website</label>
        <div className="relative group">
            <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            <input name="website" type="text" placeholder="Ex: https://patagonia.com" className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700" />
        </div>
        {state.errors?.website && <p className="text-red-400 text-[10px] ml-1 flex items-center gap-1"><AlertCircle size={10}/> {state.errors.website[0]}</p>}
      </div>

      {/* Sector */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Sector</label>
        <select name="sector" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-zinc-400 focus:text-white focus:border-emerald-500/50 appearance-none cursor-pointer">
            <option value="Tech">Tech</option>
            <option value="Fashion">Fashion</option>
            <option value="Finance">Finance</option>
            <option value="Food">Food</option>
            <option value="Energy">Energy</option>
            <option value="Other">Other</option>
        </select>
      </div>

      {/* Contact Email */}
      <div className="space-y-1.5 pt-2">
        <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Contact Email</label>
        <div className="relative group">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            <input name="contact" type="email" placeholder="audit@company.com" className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700 text-sm" />
        </div>
        {state.errors?.contact && <p className="text-red-400 text-[10px] ml-1 flex items-center gap-1"><AlertCircle size={10}/> {state.errors.contact[0]}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 rounded-xl font-bold mt-4 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? <Loader2 className="animate-spin" size={16} /> : null}
        {isPending ? 'Verifying...' : 'Submit for Audit'}
      </button>
    </form>
  );
}