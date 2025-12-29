import { getBrands } from "@/app/actions/getBrands";
import SubmitProofForm from "@/components/givn/SubmitProofForm";
import { ShieldCheck, Activity, DollarSign, Server, AlertCircle, UploadCloud, Building, Lock } from "lucide-react";
// 👇 ON CHANGE L'IMPORT ICI
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// --- PAGE ADMIN (SÉCURISÉE PAR CLERK) ---

export default async function AdminPage() {
  // 1. On demande à Clerk qui est là
  const user = await currentUser();
  
  // 2. Configuration Admin
  const ADMIN_EMAILS = ["shippingdrop76@gmail.com"];
  
  // 3. Vérification
  // Clerk stocke les emails dans un tableau 'emailAddresses'
  const primaryEmail = user?.emailAddresses[0]?.emailAddress;
  const cleanEmail = primaryEmail?.toLowerCase().trim();
  const isAuthorized = cleanEmail && ADMIN_EMAILS.includes(cleanEmail);

  // 🛑 DEBUG / SÉCURITÉ
  if (!isAuthorized) {
    // Si tu veux voir le diagnostic (comme avant), garde ce bloc.
    // Sinon, décommente la ligne 'redirect' pour renvoyer à l'accueil direct.
    
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-mono">
        <div className="max-w-xl w-full bg-zinc-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="text-red-500" /> ACCÈS REFUSÉ (Clerk)
          </h1>
          <p className="text-zinc-500 mb-6">Votre compte Clerk n'est pas autorisé.</p>
          
          <div className="space-y-4 text-sm">
            <div className="bg-black p-4 rounded border border-white/10">
              <span className="text-zinc-500 block text-xs uppercase mb-1">Email Attendu</span>
              <span className="text-emerald-400 font-bold">{ADMIN_EMAILS[0]}</span>
            </div>
            <div className="bg-black p-4 rounded border border-white/10">
              <span className="text-zinc-500 block text-xs uppercase mb-1">Email Reçu (Clerk)</span>
              <span className={cleanEmail ? "text-yellow-400 font-bold" : "text-red-500 font-bold"}>
                {cleanEmail || "Aucun utilisateur connecté"}
              </span>
            </div>
          </div>
          <div className="mt-8 text-center">
             <a href="/sign-in" className="text-white underline">Se connecter avec le bon compte</a>
          </div>
        </div>
      </div>
    );
    // redirect("/"); 
  }

  // --- ACCÈS VALIDÉ ---
  const brands = await getBrands();
  const totalBrands = brands.length;
  const totalVolume = brands.reduce((acc, b) => acc + (Number(b.total_donated) || 0), 0);
  const formattedVolume = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalVolume);

  return (
    <div className="min-h-screen bg-[#020403] text-white font-sans selection:bg-emerald-500/30">
      
      {/* BACKGROUND PARTICLES */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1600px] mx-auto p-6 md:p-12">
        {/* HEADER */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
             <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">System Operational</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
              Givn <span className="text-zinc-600">Command</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-2 max-w-md">
              Secure validation node. Mint proofs, monitor network health.
            </p>
          </div>
          <div className="text-right">
             <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Logged as</div>
             <div className="text-emerald-400 font-mono text-sm">{cleanEmail}</div>
          </div>
        </header>

        {/* CONTENU PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* GAUCHE : LISTE */}
          <div className="lg:col-span-7 flex flex-col gap-6">
             <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 min-h-[500px]">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Activity size={18}/> Living Database
                </h2>
                <div className="space-y-2">
                  {brands.map((b) => (
                    <div key={b.id} className="flex justify-between p-3 bg-black/40 rounded border border-white/5 text-sm">
                      <span>{b.name}</span>
                      <span className="text-emerald-500 font-mono">{b.trust_score}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* DROITE : UPLOAD FORM */}
          <div className="lg:col-span-5">
             <div className="p-8 rounded-3xl bg-[#080808] border border-white/10 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-3xl pointer-events-none"/>
                <h2 className="text-xl font-bold mb-6 relative z-10">Mint New Proof</h2>
                <SubmitProofForm brands={brands} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}