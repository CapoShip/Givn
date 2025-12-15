"use client";

import { useActionState, useEffect } from "react";
import { Globe, Building2, AlertCircle, Loader2, Check, Mail } from "lucide-react";
// ✅ CORRECTION DE L'IMPORT : Chemin relatif vers src/actions.ts
import { addBrand } from "@/app/actions"; 

// Type pour l'état du formulaire
const initialState = {
  message: '',
  success: false, 
};

type ActionState = typeof initialState;

export default function SubmitBrandForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(addBrand, initialState);

  // Pour gérer la fermeture de la modale après succès
  useEffect(() => {
    if (state.success) {
      setTimeout(() => onSuccess(), 2000);
    }
  }, [state.success, onSuccess]);


  // Si succès, on affiche l'écran de confirmation
  if (state.success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Demande Soumise !</h3>
        <p className="text-zinc-400 text-center">
          Notre équipe va maintenant vérifier la demande de <span className="text-emerald-400">certification.</span>
        </p>
      </div>
    );
  }

  // Si pas de succès, on affiche le formulaire avec du HTML basique (sans Input/Button)
  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-4">
        {/* Nom de la Marque */}
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            id="name"
            name="name"
            placeholder="Nom de la marque (ex: Nike, L'Oréal)"
            // ✅ Classes Tailwinds pour simuler le style du composant Input
            className="pl-10 w-full h-10 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all"
            required
            disabled={isPending}
          />
        </div>

        {/* Site Web */}
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            id="website"
            name="website"
            placeholder="Site web (ex: https://marque.com)"
            className="pl-10 w-full h-10 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all"
            required
            type="url"
            disabled={isPending}
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            id="email"
            name="email"
            placeholder="Email de contact"
            className="pl-10 w-full h-10 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all"
            required
            type="email"
            disabled={isPending}
          />
        </div>
      </div>

      {/* Message d'Erreur */}
      {state.message && !state.success && (
        <div className="flex items-center space-x-2 text-sm text-red-400 bg-red-900/20 p-3 rounded-xl border border-red-700/50 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      {/* Bouton de soumission */}
      <button
        type="submit"
        // ✅ Classes Tailwinds pour simuler le style du composant Button
        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all uppercase tracking-widest text-xs rounded-xl flex items-center justify-center"
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Soumission...</span>
          </div>
        ) : (
          "Soumettre pour vérification"
        )}
      </button>
    </form>
  );
}