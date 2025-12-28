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
      <div className="relative w-full max-w-2xl bg-[#090909] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="p-10 md:p-14 relative">
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors bg-white/5 p-3 rounded-full hover:bg-white/10 z-50 border border-white/5"
          >
            <X size={24} />
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
      {[...Array(20)].map((_, i) => (
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
      ? "Verified on-chain. Inspect the ledger."
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
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [proofBrand, setProofBrand] = useState<string | null>(null);
  const [viewFullList, setViewFullList] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [brands, setBrands] = useState<BrandUI[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  const UNIFIED_CYCLE_DURATION = 10000;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingBrands(true);
        const rows = await getLivingBrands();
        if (!alive) return;
        setBrands((rows ?? []).map(mapTrustToUI));
      } catch (e) {
        if (alive) setBrands([]);
      } finally {
        if (alive) setLoadingBrands(false);
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

  const sortedBrands = [...filteredBrands].sort((a, b) => b.trust_score - a.trust_score);
  
  const displayedBrandsList = viewFullList ? sortedBrands : sortedBrands.slice(0, 8);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-black">
      <main className="flex-1 pt-10 md:pt-24 w-full px-6 relative max-w-[1800px] mx-auto pb-40">
        {mounted && <ParticlesBackground />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative w-full z-10">
          
          {/* GAUCHE : ADS */}
          <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-32 pt-0 h-fit space-y-8">
            {AD_POOL_LEFT.map((_, i) => (
                <LivingAdSlot key={i} pool={AD_POOL_LEFT} initialDelay={2000 - (i*400)} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={i} />
            ))}
          </div>

          {/* CENTRE : CONTENU */}
          <div className="col-span-1 lg:col-span-8 flex flex-col items-center text-center pt-10 min-h-screen">
            
            {/* HERO */}
            <div className="mb-20 md:mb-32 w-full relative max-w-4xl">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 animate-enter glow-text text-white">
                THEY CLAIM. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-700">WE VERIFY.</span>
              </h1>
              <p className="text-zinc-500 max-w-lg mx-auto mb-10 text-base md:text-lg animate-enter font-bold">
                Institutional-grade proof of impact. Don't trust. <span className="text-emerald-500">Inspect.</span>
              </p>

              <div className="w-full max-w-2xl mx-auto flex gap-0 mb-6 animate-enter bg-zinc-950 p-1 border border-white/5 rounded-3xl shadow-2xl">
                <div className="flex-1 flex items-center px-6">
                  <Search size={18} className="text-zinc-700 mr-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="SCAN ENTITY PROTOCOL..."
                    className="w-full bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-zinc-800 font-black tracking-widest h-12"
                  />
                </div>
                <button
                  onClick={() => setIsBrandModalOpen(true)}
                  className="bg-white text-black px-8 rounded-2xl font-black text-[10px] hover:bg-emerald-400 transition-all uppercase tracking-widest"
                >
                  Add
                </button>
              </div>
            </div>

            {/* FILTRES */}
            <div className="flex flex-wrap justify-center gap-2 mb-16">
              {["All", "Environment", "Health", "Technology", "Public Database"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                    activeCategory === cat
                      ? "bg-white text-black border-white scale-110 shadow-xl"
                      : "text-zinc-600 border-zinc-800 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* --- SECTION DATABASE --- */}
            <div id="database" className="mb-40 w-full text-left">
              <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Immutable Database</h2>
                <button
                  onClick={() => setViewFullList(!viewFullList)}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  {viewFullList ? "Minimize Ledger" : "Access Full Ledger"}
                </button>
              </div>

              {/* GRILLE WOW : 2 colonnes Mobile -> 4 colonnes Desktop */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {displayedBrandsList.map((brand, i) => (
                  <div
                    key={brand.id}
                    className="animate-enter"
                    style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                  >
                    <BrandCard brand={brand as any} onClick={() => setSelectedBrand(brand)} />
                  </div>
                ))}
              </div>
            </div>

            {/* LEADERBOARD (Version compacte) */}
            <div id="leaderboard" className="mb-32 w-full text-left max-w-5xl mx-auto">
               <div className="flex items-center gap-6 mb-12">
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">Impact Consensus</h2>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
               </div>
              <div className="space-y-2">
                {sortedBrands.slice(0, 5).map((brand, index) => (
                  <div
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand)}
                    className="group flex items-center justify-between p-6 hover:bg-white/[0.03] rounded-3xl cursor-pointer transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center gap-10">
                      <span className="font-black text-zinc-800 text-3xl tracking-tighter group-hover:text-zinc-500 transition-colors italic">0{index + 1}</span>
                      <div>
                        <span className="block font-black text-zinc-400 group-hover:text-white transition-colors text-lg">{brand.name}</span>
                        <span className="block text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{brand.category}</span>
                      </div>
                    </div>
                    <div className="text-right w-24">
                      <span className="block text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1">Score</span>
                      <span className="font-black text-3xl text-white tracking-tighter">{brand.trust_score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* DROITE : ADS */}
          <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-32 pt-0 h-fit space-y-6">
             {AD_POOL_RIGHT.map((_, i) => (
                <LivingAdSlot key={i} pool={AD_POOL_RIGHT} initialDelay={2000 - (i*400)} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={i} />
            ))}
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#050505] py-24 px-10 text-center text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800">
         <p>© 2025 Givn Inc. Verified on-chain.</p>
      </footer>

      {/* MODALS */}
      <BrandDetailModal
        brand={selectedBrand}
        onClose={() => setSelectedBrand(null)}
        onOpenProof={() => setProofBrand(selectedBrand?.name ?? null)}
      />
      <ProofModal isOpen={!!proofBrand} onClose={() => setProofBrand(null)} brandName={proofBrand || ""} />
      
      <Modal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)}>
        <div className="text-center">
           <div className="w-20 h-20 bg-zinc-950 rounded-[30px] flex items-center justify-center mb-8 border border-white/5 mx-auto">
              <Scan size={40} className="text-emerald-500 animate-pulse" />
           </div>
           <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Protocol Onboarding</h2>
           <p className="text-[10px] text-zinc-600 mb-12 uppercase tracking-[0.4em] font-black">Submit entity for cryptographic audit</p>
           <SubmitBrandForm onSuccess={() => setIsBrandModalOpen(false)} />
        </div>
      </Modal>
    </div>
  );
}