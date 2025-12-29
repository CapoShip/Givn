"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, ArrowRight, X, Scan, ShieldCheck, Filter } from "lucide-react";

import { BrandCard } from "@/components/givn/BrandCard";
import LivingAdSlot, { Ad } from "@/components/givn/LivingAdSlot";
import BrandDetailModal from "@/components/givn/BrandDetailModal";
import Badge from "@/components/givn/Badge";
import ProofModal from "@/components/givn/ProofModal";
import SubmitBrandForm from "@/components/givn/SubmitBrandForm";
import { BrandsRealtimePulse } from "@/components/givn/BrandsRealtimePulse"; // ✅ IMPORT DU PULSE

// ✅ Living data (Server Action)
import { getLivingBrands } from "@/app/actions/brands";
import type { BrandTrustRow } from "@/lib/types/givn";

// --- DATA CONSTANTS (ADS) ---
const AD_POOL_LEFT: Ad[] = [
  { title: "Proof Drop", subtitle: "Evidence uploaded → badge updates.", type: "tree" },
  { title: "EcoTrack", subtitle: "Carbon offset verification.", type: "energy" },
  { title: "WaterLife", subtitle: "Clean water projects verified.", type: "water" },
  { title: "MediChain", subtitle: "Medical supply tracking on-chain.", type: "health" },
  { title: "AgroFund", subtitle: "Direct farmer support verified.", type: "food" },
];

const AD_POOL_RIGHT: Ad[] = [
  { title: "Blue Future", subtitle: "Protecting marine ecosystems.", type: "ocean" },
  { title: "Bright Minds", subtitle: "Funding rural schools directly.", type: "school" },
  { title: "HomeBase", subtitle: "Housing for everyone, verified.", type: "house" },
  { title: "WildLife", subtitle: "Preserving biodiversity habitats.", type: "tree" },
  { title: "SolarShare", subtitle: "Community solar grids funded.", type: "energy" },
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
        <div className="p-8 md:p-12">
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

/**
 * Interface UI mise à jour pour inclure description et total_donated
 */
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
    ? "Verified on-chain. Click to inspect proof trail."
    : b.latest_status === "rejected"
    ? "Rejected. Proof insufficient or invalid."
    : "Draft or no active proof yet.";

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
    // ✅ FIX CRITIQUE : Conversion en string ISO pour éviter l'erreur de build
    last_proof_at: b.last_proof_at ? new Date(b.last_proof_at).toISOString() : null,
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

    return () => {
      alive = false;
    };
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
  const displayedBrandsList = viewFullList ? sortedBrands : sortedBrands.slice(0, 6);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed top-0 w-full z-40 pointer-events-none h-24 bg-gradient-to-b from-black/50 to-transparent lg:hidden" />

      <main className="flex-1 pt-10 md:pt-24 w-full px-4 relative">
        {mounted && <ParticlesBackground />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative w-full z-10">
          {/* LEFT ADS */}
          <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-24 pt-0 h-fit space-y-8">
            <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={2000} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={0} />
            <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={1500} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={1} />
            <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={1000} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={2} />
            <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={500} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={3} />
            <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={0} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={4} />
          </div>

          {/* CENTER */}
          <div className="col-span-1 lg:col-span-8 flex flex-col items-center text-center pt-10 min-h-screen">
            {/* HERO */}
            <div className="mb-12 md:mb-20 w-full relative">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8 animate-[pop-in_0.7s_ease-out] glow-text">
                They say they donate.
                <br />
                <span className="text-zinc-600">Givn shows the proof.</span>
              </h1>

              <p className="text-zinc-400 max-w-lg mx-auto mb-8 text-base md:text-lg animate-[pop-in_0.9s_ease-out] leading-relaxed">
                Brands can claim anything. Givn only shows what is verifiable. Transparent tracking for corporate philanthropy.
              </p>

              {/* 🔥 PULSE TEMPS RÉEL INSÉRÉ ICI */}
              <div className="w-full mb-8 animate-[pop-in_1.0s_ease-out]">
                <BrandsRealtimePulse />
              </div>

              <div className="w-full max-w-lg mx-auto flex gap-3 mb-6 animate-[pop-in_1.1s_ease-out]">
                <div className="relative flex-1 group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search brands, categories..."
                    className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-600 shadow-xl"
                  />
                </div>

                <button
                  onClick={() => setIsBrandModalOpen(true)}
                  className="relative group overflow-hidden rounded-xl p-[2px] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]"
                >
                  <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#10b981_50%,#000000_100%)]" />
                  <div className="relative h-full bg-black rounded-[10px] px-8 flex items-center justify-center gap-2 transition-all group-hover:bg-zinc-900">
                    <Plus size={20} className="text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="font-bold text-white tracking-wide group-hover:text-emerald-400 transition-colors uppercase text-xs">
                      Add Brand
                    </span>
                  </div>
                </button>
              </div>

              {loadingBrands && <div className="mt-3 text-xs text-zinc-500">Syncing living database…</div>}
            </div>

            {/* MOBILE AD 1 */}
            <div className="w-full lg:hidden mb-16 px-4">
              <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={1000} cycleDuration={14000} startIndex={0} />
            </div>

            {/* CATEGORIES & FILTER */}
            <div id="categories" className="flex flex-col items-center mb-16 scroll-mt-24 w-full">
              <div className="flex items-center gap-2 mb-6">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Filter by trust</p>
                <div className="h-4 w-[1px] bg-zinc-800 mx-2" />
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                    verifiedOnly
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                      : "bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-700"
                  }`}
                >
                  {verifiedOnly ? <ShieldCheck size={12} /> : <Filter size={12} />}
                  Verified Only
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {["All", "Public Database"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                      activeCategory === cat
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] transform scale-105"
                        : "bg-transparent text-zinc-500 border-zinc-800 hover:border-emerald-500/30 hover:text-emerald-200 hover:bg-emerald-500/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* MOBILE AD 2 */}
            <div className="w-full lg:hidden mb-16 px-4">
              <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={2000} cycleDuration={16000} startIndex={1} />
            </div>

            {/* RECENTLY LISTED */}
            <div id="database" className="mb-24 scroll-mt-24 w-full text-left">
              <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">Recently listed</h2>
                  <p className="text-xs text-zinc-500">Live from public proofs</p>
                </div>
                <button
                  onClick={() => setViewFullList(!viewFullList)}
                  className="text-xs text-zinc-500 flex items-center gap-1 hover:text-white transition-colors bg-transparent border-0 font-medium cursor-pointer"
                >
                  {viewFullList ? "View less" : "View full"} <ArrowRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedBrandsList.map((brand, i) => (
                  <div
                    key={brand.id}
                    className="animate-enter min-w-0"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <BrandCard brand={brand as any} onClick={() => setSelectedBrand(brand)} />
                  </div>
                ))}

                {!loadingBrands && displayedBrandsList.length === 0 && (
                  <div className="col-span-full text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-white/5">
                    <p className="text-zinc-500 font-medium">No matching brands.</p>
                  </div>
                )}
              </div>
            </div>

            {/* LEADERBOARD */}
            <div id="leaderboard" className="mb-32 scroll-mt-24 w-full text-left">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold mb-1">Impact leaderboard</h2>
                  <p className="text-xs text-zinc-500">Ranked by living trust score (proof-derived)</p>
                </div>
              </div>

              <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0A0A0A] shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02] text-xs text-zinc-500 uppercase tracking-wider">
                      <th className="p-4 font-semibold w-16 text-center">#</th>
                      <th className="p-4 font-semibold">Brand</th>
                      <th className="p-4 font-semibold hidden sm:table-cell">Category</th>
                      <th className="p-4 font-semibold text-right">Trust</th>
                      <th className="p-4 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {sortedBrands.map((brand, index) => (
                      <tr
                        key={brand.id}
                        onClick={() => setSelectedBrand(brand)}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer h-16 animate-enter"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="p-4 text-zinc-500 font-mono text-xs text-center font-bold">
                          {index === 0 ? <span className="text-xl">👑</span> : index + 1}
                        </td>
                        <td className="p-4 font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {brand.name}
                          <div className="sm:hidden text-xs text-zinc-500 font-normal mt-1">{brand.category}</div>
                        </td>
                        <td className="p-4 text-zinc-400 hidden sm:table-cell">
                          <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/5">{brand.category}</span>
                        </td>
                        <td className="p-4 text-right font-mono text-white font-medium">{brand.trust_score}/100</td>
                        <td className="p-4 flex justify-end items-center h-full">
                          <Badge status={brand.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT ADS */}
          <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-24 pt-0 h-fit space-y-6">
            <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={2000} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={0} />
            <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={1500} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={1} />
            <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={1000} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={2} />
            <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={500} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={3} />
            <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={0} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={4} />

            <div className="flex justify-end pt-4 border-t border-white/5">
              <div
                className="flex items-center gap-2 cursor-pointer group opacity-70 hover:opacity-100 transition-all"
                onClick={() => setIsAdModalOpen(true)}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-emerald-400 transition-colors text-right whitespace-nowrap">
                  Advertise Here
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black py-20 px-6 mt-20">
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-16 text-sm max-w-7xl mx-auto">
          <div className="col-span-1 md:col-span-1">
            <span className="font-bold text-xl tracking-tight mb-6 block text-white">Givn</span>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">
              The global standard for verifying corporate philanthropy using blockchain transparency.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>
                <button onClick={() => scrollToSection("database")} className="hover:text-emerald-400 transition-colors">
                  Database
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("leaderboard")} className="hover:text-emerald-400 transition-colors">
                  Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => setIsBrandModalOpen(true)} className="hover:text-emerald-400 transition-colors">
                  Submit Brand
                </button>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-white mb-4">Legal & Trust</h4>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>
                <a href="/methodology" className="hover:text-emerald-400 transition-colors">
                  Methodology
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-1 text-right">
            <p className="text-zinc-600 text-xs">© 2025 Givn Inc.</p>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <BrandDetailModal
        brand={selectedBrand}
        onClose={() => setSelectedBrand(null)}
        onOpenProof={() => {
          setProofBrand(selectedBrand?.name ?? null);
        }}
      />

      <ProofModal isOpen={!!proofBrand} onClose={() => setProofBrand(null)} brandName={proofBrand || ""} />

      <Modal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)}>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-ping opacity-20" />
            <Scan size={32} className="text-emerald-400 relative z-10" />
          </div>
          <h2 className="text-2xl font-bold mb-1 tracking-tight text-white">INITIATE VERIFICATION</h2>
          <p className="text-xs text-zinc-500 mb-8 uppercase tracking-widest">Submit candidate for blockchain audit</p>

          <SubmitBrandForm
            onSuccess={() => {
              setIsBrandModalOpen(false);
              alert("Audit Request Queued. Check your email.");
            }}
          />
        </div>
      </Modal>

      <Modal isOpen={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)}>
        <div className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold">Request Access</h2>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Request sent!");
              setIsAccessModalOpen(false);
            }}
          >
            <input
              type="email"
              required
              placeholder="Email"
              className="w-full bg-black border border-white/20 p-4 rounded-lg text-white"
            />
            <button
              type="submit"
              className="w-full bg-white text-black py-4 rounded-lg font-bold hover:bg-emerald-400 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isAdModalOpen} onClose={() => setIsAdModalOpen(false)}>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">Advertise on Givn</h2>
          <p className="text-zinc-400 text-sm mb-8">
            Only verified brands can display "Living Ads".
            <br />
            Your ad grows as your impact is verified on-chain.
          </p>
          <button
            onClick={() => {
              setIsAdModalOpen(false);
              setIsAccessModalOpen(true);
            }}
            className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-emerald-400 transition-colors"
          >
            Get Verified First
          </button>
        </div>
      </Modal>
    </div>
  );
}