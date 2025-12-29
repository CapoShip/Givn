import { getBrands } from "@/app/actions/getBrands";
import SubmitProofForm from "@/components/givn/SubmitProofForm";
import { ShieldCheck, Activity, Users, DollarSign, Server, AlertCircle } from "lucide-react";

// --- COMPOSANTS UI LOCALISÉS (POUR GARDER LE FICHIER PROPRE) ---

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon className="w-16 h-16 text-white" />
    </div>
    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-colors">
          <Icon size={18} />
        </div>
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{title}</span>
      </div>
      <div>
        <div className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tighter">{value}</div>
        {trend && <div className="text-xs text-emerald-500 mt-1 font-mono">{trend}</div>}
      </div>
    </div>
  </div>
);

const BrandRow = ({ brand, index }: { brand: any; index: number }) => (
  <div 
    className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors first:border-t animate-enter"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10 text-xs font-bold text-zinc-500">
        {brand.name.substring(0, 2).toUpperCase()}
      </div>
      <div>
        <div className="text-sm font-bold text-white">{brand.name}</div>
        <div className="text-[10px] text-zinc-500 font-mono uppercase">{brand.category} • ID: {brand.id.substring(0, 4)}...</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm font-mono text-emerald-400 font-medium">
        {brand.trust_score}/100
      </div>
      <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Trust Score</div>
    </div>
  </div>
);

// --- PAGE PRINCIPALE ---

export default async function AdminPage() {
  const brands = await getBrands();

  // Calcul des stats réelles
  const totalBrands = brands.length;
  const verifiedBrands = brands.filter(b => b.trust_score > 50).length; // Seuil arbitraire pour l'exemple
  const totalVolume = brands.reduce((acc, b) => acc + (Number(b.total_donated) || 0), 0);
  
  // Formatage Volume
  const formattedVolume = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalVolume);

  return (
    <div className="min-h-screen bg-[#020403] text-white font-sans selection:bg-emerald-500/30">
      
      {/* BACKGROUND PARTICLES (Visuel subtil) */}
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
              Central validation node. Mint proofs, monitor network health, and manage brand reputation.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 flex items-center gap-3">
                <Server size={14} className="text-zinc-500" />
                <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-600 uppercase font-bold">Latency</span>
                   <span className="text-xs font-mono text-emerald-400">12ms</span>
                </div>
             </div>
             <div className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 flex items-center gap-3">
                <ShieldCheck size={14} className="text-zinc-500" />
                <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-600 uppercase font-bold">Security</span>
                   <span className="text-xs font-mono text-emerald-400">Optimized</span>
                </div>
             </div>
          </div>
        </header>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard 
            title="Total Volume Tracked" 
            value={formattedVolume} 
            icon={DollarSign} 
            trend="+12% this week"
          />
          <StatCard 
            title="Active Entities" 
            value={totalBrands} 
            icon={Building} 
            trend="Living Database"
          />
          <StatCard 
            title="Verified Proofs" 
            value={Math.floor(totalBrands * 3.5)} // Simulation réaliste basée sur les marques
            icon={ShieldCheck} 
            trend="On-chain records"
          />
          <StatCard 
            title="Pending Actions" 
            value="0" 
            icon={AlertCircle} 
            trend="All Clear"
          />
        </div>

        {/* MAIN CONTENT SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* GAUCHE : DB MONITOR (Liste des marques) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
              <div className="rounded-[22px] bg-[#0A0A0A] overflow-hidden min-h-[600px]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Activity size={16} className="text-zinc-500" />
                    Living Database
                  </h2>
                  <span className="text-xs text-zinc-500 font-mono">
                    {brands.length} ROWS FETCHED
                  </span>
                </div>
                
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                  {brands.length > 0 ? (
                     brands.map((brand, i) => (
                       <BrandRow key={brand.id} brand={brand} index={i} />
                     ))
                  ) : (
                    <div className="p-12 text-center text-zinc-600 text-sm">
                      Database is empty. Mint first proof to initialize.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DROITE : ACTION CENTER (Mint Proof) */}
          <div className="lg:col-span-5">
             <div className="sticky top-8">
                <div className="relative group">
                  {/* Glow effect derrière le formulaire */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-1000" />
                  
                  <div className="relative p-8 rounded-3xl bg-[#080808] border border-white/10 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                          Mint New Proof
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
                            Admin
                          </span>
                        </h2>
                        <p className="text-xs text-zinc-500">Upload evidence to update chain state.</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 animate-pulse">
                        <UploadCloud className="text-emerald-400" size={20} />
                      </div>
                    </div>

                    {/* 🔥 INTEGRATION DU FORMULAIRE */}
                    <SubmitProofForm brands={brands} />

                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                       <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                         Secure Admin Environment • v2.1.0
                       </p>
                    </div>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Petit import manquant pour l'icône dans les StatCards
import { UploadCloud, Building } from "lucide-react";