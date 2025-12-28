"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, ArrowRight, X, Scan, ShieldCheck, Filter } from "lucide-react";

import { BrandCard } from "@/components/givn/BrandCard";
import LivingAdSlot, { Ad } from "@/components/givn/LivingAdSlot";
import BrandDetailModal from "@/components/givn/BrandDetailModal";
import Badge from "@/components/givn/Badge";
import ProofModal from "@/components/givn/ProofModal";
import SubmitBrandForm from "@/components/givn/SubmitBrandForm";

// ✅ Living data (Server Action)
import { getLivingBrands } from "@/app/actions/brands";
import type { BrandTrustRow } from "@/lib/types/givn";


// --- DATA CONSTANTS (ADS) ---
const AD_POOL_LEFT: Ad[] = [
  { title: "Proof Drop", subtitle: "Evidence uploaded.", type: "tree" },
  { title: "EcoTrack", subtitle: "Carbon offset verified.", type: "energy" },
  { title: "WaterLife", subtitle: "Clean water verified.", type: "water" },
  { title: "MediChain", subtitle: "Supplies tracking.", type: "health" },
  { title: "AgroFund", subtitle: "Farmer support.", type: "food" },
];

const AD_POOL_RIGHT: Ad[] = [
  { title: "Blue Future", subtitle: "Marine ecosystems.", type: "ocean" },
  { title: "Bright Minds", subtitle: "Funding schools.", type: "school" },
  { title: "HomeBase", subtitle: "Housing verified.", type: "house" },
  { title: "WildLife", subtitle: "Biodiversity.", type: "tree" },
  { title: "SolarShare", subtitle: "Solar grids funded.", type: "energy" },
];

// --- UTILITIES ---
const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity modal-overlay"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-[#090909] border border-white/10 rounded-2xl shadow-2xl overflow-hidden modal-content">
        <div className="p-8 md:p-12 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10 z-50"
          >
            <X size={20} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT PARTICULES ---
const ParticlesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-emerald-500/20 rounded-full animate-float"
          style={{
            width: Math.random() * 4 + 1 + "px",
            height: Math.random() * 4 + 1 + "px",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            animationDuration: Math.random() * 10 + 10 + "s",
            animationDelay: Math.random() * 5 + "s",
          }}
        />
      ))}
    </div>
  );
};

type BrandUI = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  category: string;
  claim: string;
  description?: string | null;
  total_donated?: number | null;
  month: number;
  status: "VERIFIED" | "PENDING";
  trust_score: number;
  proof_count: number;
  last_proof_at: string | null;
};

function mapTrustToUI(b: BrandTrustRow): BrandUI {
  const isVerified = b.latest_status === "verified";
  const fallbackClaim = isVerified
      ? "Verified on-chain."
      : b.latest_status === "rejected"
      ? "Rejected."
      : "Draft.";

  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo_url: b.logo_url,
    website: b.website,
    category: b.category || "Public Database",
    claim: b.claim || fallbackClaim,
    description: b.description, 
    total_donated: b.total_donated,
    month: b.trust_score ?? 0,
    status: isVerified ? "VERIFIED" : "PENDING",
    trust_score: b.trust_score ?? 0,
    proof_count: b.proof_count ?? 0,
    last_proof_at: b.last_proof_at,
  };
}

// --- PAGE PRINCIPALE ---
export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [proofBrand, setProofBrand] = useState<string | null>(null);
  const [viewFullList, setViewFullList] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [brands, setBrands] = useState<BrandUI[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  const UNIFIED_CYCLE_DURATION = 10000;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingBrands(true);
        const rows = await getLivingBrands();
        if (!alive) return;
        setBrands((rows ?? []).map(mapTrustToUI));
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setBrands([]);
      } finally {
        if (!alive) return;
        setLoadingBrands(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const matchesCategory = activeCategory === "All" || brand.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        brand.name.toLowerCase().includes(q) ||
        (brand.claim ?? "").toLowerCase().includes(q);
      const matchesVerified = verifiedOnly ? brand.status === "VERIFIED" : true;
      return matchesCategory && matchesSearch && matchesVerified;
    });
  }, [brands, activeCategory, searchQuery, verifiedOnly]);

  const sortedBrands = [...filteredBrands].sort((a, b) => b.month - a.month);
  
  // LOGIQUE SIMPLIFIÉE : Si "View full", on montre tout, sinon les 8 premiers (2 lignes de 4)
  const displayedBrandsList = viewFullList ? sortedBrands : sortedBrands.slice(0, 8);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed top-0 w-full z-40 pointer-events-none h-24 bg-gradient-to-b from-black/50 to-transparent lg:hidden" />

      <main className="flex-1 pt-10 md:pt-24 w-full px-4 relative max-w-[1800px] mx-auto">
        {mounted && <ParticlesBackground />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative w-full z-10">
          
          {/* GAUCHE : ADS */}
          <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-24 pt-0 h-fit space-y-8">
            {AD_POOL_LEFT.map((_, i) => (
                <LivingAdSlot key={i} pool={AD_POOL_LEFT} initialDelay={2000 - (i*400)} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={i} />
            ))}
          </div>

          {/* CENTRE : CONTENU */}
          <div className="col-span-1 lg:col-span-8 flex flex-col items-center text-center pt-10 min-h-screen">
            
            {/* HERO */}
            <div className="mb-12 md:mb-16 w-full relative">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.9] mb-6 animate-[pop-in_0.7s_ease-out] glow-text">
                They say they donate.
                <br />
                <span className="text-zinc-600">Givn shows the proof.</span>
              </h1>

              <p className="text-zinc-400 max-w-lg mx-auto mb-10 text-sm md:text-base animate-[pop-in_0.9s_ease-out] leading-relaxed">
                Brands can claim anything. Givn only shows what is verifiable. Transparent tracking for corporate philanthropy.
              </p>

              <div className="w-full max-w-lg mx-auto flex gap-3 mb-6 animate-[pop-in_1.1s_ease-out]">
                <div className="relative flex-1 group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search brands..."
                    className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 shadow-xl"
                  />
                </div>

                <button
                  onClick={() => setIsBrandModalOpen(true)}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 rounded-xl px-4 flex items-center gap-2 transition-all"
                >
                  <Plus size={18} />
                  <span className="font-bold uppercase text-xs hidden sm:inline">Add</span>
                </button>
              </div>
            </div>

            {/* MOBILE AD */}
            <div className="w-full lg:hidden mb-12 px-2">
              <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={1000} cycleDuration={14000} startIndex={0} />
            </div>

            {/* FILTRES */}
            <div id="categories" className="flex flex-col items-center mb-12 w-full">
              <div className="flex flex-wrap justify-center gap-2">
                {["All", "Public Database"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                      activeCategory === cat
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                        : "bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${
                    verifiedOnly
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                      : "bg-transparent border-zinc-800 text-zinc-600"
                  }`}
                >
                   {verifiedOnly ? <ShieldCheck size={12} /> : <Filter size={12} />}
                   Verified
                </button>
              </div>
            </div>

            {/* --- SECTION DATABASE (LA GRILLE CORRIGÉE) --- */}
            <div id="database" className="mb-24 w-full text-left">
              <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-lg font-bold mb-1 text-white">Live Database</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Real-time verification</p>
                </div>
                <button
                  onClick={() => setViewFullList(!viewFullList)}
                  className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  {viewFullList ? "Show less" : "View all"} <ArrowRight size={12} />
                </button>
              </div>

              {/* ✅ GRILLE STRICTE : 2 colonnes (mobile) -> 4 colonnes (desktop) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {displayedBrandsList.map((brand, i) => (
                  <div
                    key={brand.id}
                    className="animate-enter"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <BrandCard brand={brand as any} onClick={() => setSelectedBrand(brand)} />
                  </div>
                ))}

                {!loadingBrands && displayedBrandsList.length === 0 && (
                  <div className="col-span-full py-20 border border-dashed border-zinc-800 rounded-xl bg-white/5 text-center">
                    <p className="text-zinc-500 text-sm">No matching brands found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* LEADERBOARD (Version compacte) */}
            <div id="leaderboard" className="mb-32 w-full text-left">
               <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold mb-1 text-white">Impact Leaderboard</h2>
                </div>
              </div>
              <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0A0A]">
                <table className="w-full text-left border-collapse">
                  <tbody className="text-xs md:text-sm">
                    {sortedBrands.slice(0, 5).map((brand, index) => (
                      <tr
                        key={brand.id}
                        onClick={() => setSelectedBrand(brand)}
                        className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer h-12"
                      >
                        <td className="p-4 text-zinc-500 font-mono w-12 text-center">{index + 1}</td>
                        <td className="p-4 font-bold text-white">{brand.name}</td>
                        <td className="p-4 text-right font-mono text-emerald-400">{brand.trust_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* DROITE : ADS */}
          <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-24 pt-0 h-fit space-y-6">
             {AD_POOL_RIGHT.map((_, i) => (
                <LivingAdSlot key={i} pool={AD_POOL_RIGHT} initialDelay={2000 - (i*400)} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={i} />
            ))}
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black py-12 px-6 mt-12 text-center text-xs text-zinc-600">
         <p>© 2025 Givn Inc. Verified on-chain.</p>
      </footer>

      {/* --- MODALS --- */}
      <BrandDetailModal
        brand={selectedBrand}
        onClose={() => setSelectedBrand(null)}
        onOpenProof={() => setProofBrand(selectedBrand?.name ?? null)}
      />
      <ProofModal isOpen={!!proofBrand} onClose={() => setProofBrand(null)} brandName={proofBrand || ""} />
      
      <Modal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)}>
        <div className="text-center">
           <h2 className="text-xl font-bold text-white mb-6">Submit Brand</h2>
           <SubmitBrandForm onSuccess={() => setIsBrandModalOpen(false)} />
        </div>
      </Modal>

      <Modal isOpen={isAdModalOpen} onClose={() => setIsAdModalOpen(false)}>
         <div className="text-center p-4">
            <h2 className="text-white font-bold mb-2">Advertise</h2>
            <p className="text-zinc-400 text-sm">Coming soon for verified brands.</p>
         </div>
      </Modal>

    </div>
  );
}