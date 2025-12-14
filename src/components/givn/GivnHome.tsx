"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Search,
  Plus,
  ShieldCheck,
  Sparkles,
  Megaphone,
  Newspaper,
  Crown,
} from "lucide-react";

/**
 * GIVN — Home
 * Objectif:
 * - Page qui "fit" sur écran (pas de scroll horizontal global)
 * - Centre large et lisible
 * - Rails pubs seulement en très grand écran (2xl)
 * - Sur écran normal: pubs deviennent "spotlights" intégrées dans le flux
 * - Pubs animées: rotation automatique
 */

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

type ProofStatus = "verified" | "missing";

type Category =
  | "E-commerce"
  | "Fashion"
  | "Food"
  | "Health"
  | "Education"
  | "Marketplace"
  | "Other";

type ImpactCard = {
  id: string;
  brand: string;
  category: Category;
  verifiedThisMonth: number; // dollars
  verifiedAllTime: number; // dollars
  lastProof: string; // ISO-ish
  claim: string;
  proofStatus: ProofStatus;
};

type AdTone = "blue" | "slate" | "violet" | "green" | "amber" | "indigo";
type Ad = { title: string; desc: string; tone: AdTone };

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function money(n: number) {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${Math.round(n)}`;
}

function matches(q: string, hay: string) {
  const a = q.trim().toLowerCase();
  if (!a) return true;
  return hay.toLowerCase().includes(a);
}

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function cx(...v: Array<string | false | undefined | null>) {
  return v.filter(Boolean).join(" ");
}

function fmtStamp(s: string) {
  // tolérant aux formats "2025-11-01T—"
  if (!s) return "—";
  return s.replace("T", " ");
}

// ────────────────────────────────────────────────────────────
// Demo data
// ────────────────────────────────────────────────────────────

const IMPACT: ImpactCard[] = [
  {
    id: "b1",
    brand: "Lumen Goods",
    category: "E-commerce",
    verifiedThisMonth: 1250,
    verifiedAllTime: 8420,
    lastProof: "2025-12-08T09:11Z",
    claim: "1% of revenue donated",
    proofStatus: "verified",
  },
  {
    id: "b2",
    brand: "VantaWear",
    category: "Fashion",
    verifiedThisMonth: 620,
    verifiedAllTime: 3190,
    lastProof: "2025-12-05T14:22Z",
    claim: "A portion donated",
    proofStatus: "verified",
  },
  {
    id: "b3",
    brand: "Nori Market",
    category: "Food",
    verifiedThisMonth: 0,
    verifiedAllTime: 0,
    lastProof: "2025-11-01T—",
    claim: "We give back monthly",
    proofStatus: "missing",
  },
  {
    id: "b4",
    brand: "Pulse Bloom",
    category: "Health",
    verifiedThisMonth: 310,
    verifiedAllTime: 1440,
    lastProof: "2025-12-10T08:03Z",
    claim: "$1 per order donated",
    proofStatus: "verified",
  },
  {
    id: "b5",
    brand: "Cedar Kids",
    category: "Education",
    verifiedThisMonth: 980,
    verifiedAllTime: 6110,
    lastProof: "2025-12-09T16:40Z",
    claim: "Supplies funded",
    proofStatus: "verified",
  },
  {
    id: "b6",
    brand: "Echo Cart",
    category: "Marketplace",
    verifiedThisMonth: 210,
    verifiedAllTime: 980,
    lastProof: "2025-12-07T11:02Z",
    claim: "Carbon removal funded",
    proofStatus: "verified",
  },
];

const SIDE_ADS_LEFT: Ad[] = [
  { title: "Proof Vault", desc: "Store and timestamp your donation proofs", tone: "blue" },
  { title: "Receipts Hub", desc: "Monthly donation statements, clean and public", tone: "slate" },
  { title: "Impact Widget", desc: "Embed a badge that updates automatically", tone: "violet" },
  { title: "Audit Ready", desc: "Make verification frictionless for customers", tone: "slate" },
  { title: "Partner NGOs", desc: "Connect to verified orgs (soon)", tone: "green" },
];

const SIDE_ADS_RIGHT: Ad[] = [
  { title: "Verified Spotlight", desc: "Top placement for verified brands", tone: "amber" },
  { title: "Category Takeover", desc: "Own a category for a week", tone: "indigo" },
  { title: "Homepage Banner", desc: "Get seen by shoppers who care", tone: "slate" },
  { title: "Proof Story", desc: "Short narrative card beside your proof", tone: "violet" },
  { title: "Trust Boost", desc: "Turn claims into conversion", tone: "blue" },
];

// ────────────────────────────────────────────────────────────
// UI atoms
// ────────────────────────────────────────────────────────────

function Pill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition",
        active
          ? "border-white/30 bg-white/10 text-white"
          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
      )}
    >
      {children}
    </button>
  );
}

function AdCard({ ad }: { ad: Ad }) {
  const toneClass: Record<AdTone, string> = {
    blue: "bg-sky-500/10 border-sky-500/20",
    slate: "bg-white/5 border-white/10",
    violet: "bg-violet-500/10 border-violet-500/20",
    green: "bg-emerald-500/10 border-emerald-500/20",
    amber: "bg-amber-500/10 border-amber-500/20",
    indigo: "bg-indigo-500/10 border-indigo-500/20",
  };

  return (
    <div className={cx("rounded-2xl border p-5", toneClass[ad.tone])}>
      <div className="text-xs text-white/85 font-semibold">{ad.title}</div>
      <div className="mt-2 text-[11px] text-white/50 leading-relaxed">{ad.desc}</div>
      <div className="mt-4 text-[10px] text-white/35">Sponsored</div>
    </div>
  );
}

function ImpactTile({ item }: { item: ImpactCard }) {
  const verified = item.proofStatus === "verified";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white/90">{item.brand}</div>
          <div className="mt-1 text-[11px] text-white/50">{item.category}</div>
        </div>

        <span
          className={cx(
            "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] tracking-widest",
            verified ? "border-white/15 text-white/70" : "border-red-500/30 text-red-200"
          )}
        >
          {verified ? (
            <>
              <BadgeCheck className="h-3.5 w-3.5" /> VERIFIED
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5" /> MISSING
            </>
          )}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-[11px]">
        <div>
          <div className="text-white/40">THIS MONTH</div>
          <div className="mt-1 text-white">{money(item.verifiedThisMonth)}</div>
        </div>
        <div>
          <div className="text-white/40">ALL TIME</div>
          <div className="mt-1 text-white">{money(item.verifiedAllTime)}</div>
        </div>
        <div>
          <div className="text-white/40">LAST PROOF</div>
          <div className="mt-1 text-white">{fmtStamp(item.lastProof)}</div>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-white/55">Claim: {item.claim}</div>

      <div className="mt-4">
        {/* Mets ton vrai lien plus tard: /brand/[slug] */}
        <a
          href="#"
          className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition"
        >
          View proof page <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────

export default function GivnHome() {
  // rotation pubs (wow simple)
  const [adLeftIndex, setAdLeftIndex] = useState(0);
  const [adRightIndex, setAdRightIndex] = useState(0);

  useEffect(() => {
    const i = window.setInterval(() => {
      setAdLeftIndex((v) => (v + 1) % SIDE_ADS_LEFT.length);
    }, 3200);
    return () => window.clearInterval(i);
  }, []);

  useEffect(() => {
    const i = window.setInterval(() => {
      setAdRightIndex((v) => (v + 1) % SIDE_ADS_RIGHT.length);
    }, 3600);
    return () => window.clearInterval(i);
  }, []);

  const categories = useMemo(() => {
    const cats = unique(IMPACT.map((x) => x.category));
    return ["All" as const, ...cats];
  }, []);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    return IMPACT.filter((x) => {
      const okQ = matches(q, `${x.brand} ${x.category} ${x.claim} ${x.proofStatus}`);
      const okC = cat === "All" ? true : x.category === cat;
      return okQ && okC;
    });
  }, [q, cat]);

  const totalThisMonth = useMemo(() => {
    return IMPACT.filter((x) => x.proofStatus === "verified").reduce((s, x) => s + x.verifiedThisMonth, 0);
  }, []);

  return (
    <>
      {/* Anti scroll horizontal global */}
      <style jsx global>{`
        html,
        body {
          background: #000;
          margin: 0;
          overflow-x: hidden;
        }
      `}</style>

      <div className="min-h-screen w-full bg-black text-white">
        {/* Top bar */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
          <div className="mx-auto w-full max-w-[1480px] px-6 h-14 flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/70" />
              <span className="text-sm font-semibold text-white/85">Givn</span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-xs text-white/60">
              <a className="hover:text-white transition" href="#database">
                Database
              </a>
              <a className="hover:text-white transition" href="#leaderboard">
                Leaderboard
              </a>
              <a className="hover:text-white transition" href="#categories">
                Categories
              </a>
              <a className="hover:text-white transition" href="#ads">
                Ads
              </a>
            </nav>

            <a
              href="/(marketing)/request-access"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white text-black px-3 py-2 text-xs font-semibold hover:opacity-90 transition"
            >
              Request access <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </header>

        {/* Layout */}
        <main className="mx-auto w-full max-w-[1480px] px-6 py-10">
          {/* 2xl seulement = rails (sinon ça compresse) */}
          <div className="grid grid-cols-1 2xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-8">
            {/* Left rail (2xl only) */}
            <aside className="hidden 2xl:flex flex-col gap-4">
              <div className="transition-opacity duration-500">
                <AdCard ad={SIDE_ADS_LEFT[adLeftIndex]} />
              </div>
              {/* petit stack statique */}
              {SIDE_ADS_LEFT.filter((_, i) => i !== adLeftIndex)
                .slice(0, 3)
                .map((ad) => (
                  <AdCard key={ad.title} ad={ad} />
                ))}
            </aside>

            {/* Center (protégé, stable) */}
            <section className="mx-auto w-full max-w-[1100px] 2xl:max-w-none">
              {/* HERO */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-white/70 text-sm">
                  <BadgeCheck className="h-4 w-4" />
                  <span className="font-semibold">Givn</span>
                </div>

                {/* Slogan demandé: proche du meilleur d’avant */}
                <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
                  They say they donate.
                  <br />
                  <span className="text-white/55">Givn shows the proof.</span>
                </h1>

                <p className="mt-4 text-white/60 max-w-2xl mx-auto">
                  Verified donation claims, visible to anyone. No vague promises. Just evidence.
                </p>

                {/* Search */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="flex items-center gap-2 w-full max-w-[520px] rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <Search className="h-4 w-4 text-white/50" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search brands, categories, claims..."
                      className="w-full bg-transparent outline-none text-sm text-white/80 placeholder:text-white/35"
                    />
                  </div>

                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
                  >
                    <Plus className="h-4 w-4" /> Add brand
                  </button>
                </div>

                <div className="mt-4 text-xs text-white/40">
                  Verified this month across the database:{" "}
                  <span className="text-white/70 font-semibold">{money(totalThisMonth)}</span>
                </div>
              </div>

              {/* On screens < 2xl : pubs “spotlight” intégrées au flux (ne compressent jamais) */}
              <div className="mt-10 2xl:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdCard ad={SIDE_ADS_LEFT[adLeftIndex]} />
                  <AdCard ad={SIDE_ADS_RIGHT[adRightIndex]} />
                </div>
              </div>

              {/* Categories */}
              <div id="categories" className="mt-12 border-t border-white/10 pt-10">
                <div className="text-center text-sm font-semibold text-white/85">
                  Browse by category
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {categories.map((c) => (
                    <Pill key={c} active={c === cat} onClick={() => setCat(c)}>
                      {c}
                    </Pill>
                  ))}
                </div>
              </div>

              {/* DATABASE: grid (pas de scroll horizontal) */}
              <div id="database" className="mt-12">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white/85">Recently verified</div>
                  <a href="#" className="text-xs text-white/50 hover:text-white transition">
                    View all <ArrowRight className="inline h-4 w-4" />
                  </a>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.slice(0, 6).map((x) => (
                    <ImpactTile key={x.id} item={x} />
                  ))}
                </div>
              </div>

              {/* Featured */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white/85">Featured</div>
                  <a href="#" className="text-xs text-white/50 hover:text-white transition">
                    View all <ArrowRight className="inline h-4 w-4" />
                  </a>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered
                    .slice()
                    .reverse()
                    .slice(0, 6)
                    .map((x) => (
                      <ImpactTile key={x.id} item={x} />
                    ))}
                </div>
              </div>

              {/* Leaderboard (cohérent donations) */}
              <div
                id="leaderboard"
                className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white/85">Impact leaderboard</div>
                  <div className="text-xs text-white/45">Ranked by verified donations</div>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-white/45">
                        <th className="text-left font-medium py-2">#</th>
                        <th className="text-left font-medium py-2">Brand</th>
                        <th className="text-left font-medium py-2">Category</th>
                        <th className="text-right font-medium py-2">This month</th>
                        <th className="text-right font-medium py-2">All time</th>
                        <th className="text-right font-medium py-2">Last proof</th>
                        <th className="text-right font-medium py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {IMPACT.slice()
                        .filter((x) => x.proofStatus === "verified")
                        .sort((a, b) => b.verifiedThisMonth - a.verifiedThisMonth)
                        .slice(0, 7)
                        .map((r, idx) => (
                          <tr key={r.id} className="border-t border-white/10">
                            <td className="py-3 pr-3 text-white/70">
                              {idx === 0 ? <Crown className="inline h-4 w-4 mr-2" /> : null}
                              {idx + 1}
                            </td>
                            <td className="py-3 text-white/85">{r.brand}</td>
                            <td className="py-3 text-white/60">{r.category}</td>
                            <td className="py-3 text-right text-white">{money(r.verifiedThisMonth)}</td>
                            <td className="py-3 text-right text-white/85">{money(r.verifiedAllTime)}</td>
                            <td className="py-3 text-right text-white/70">{fmtStamp(r.lastProof)}</td>
                            <td className="py-3 text-right">
                              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-1 text-[11px] text-white/70">
                                <BadgeCheck className="h-4 w-4" /> verified
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div
                id="ads"
                className="mt-14 border-t border-white/10 pt-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-xs text-white/50"
              >
                <div>
                  <div className="text-white/70 font-semibold mb-3">Navigation</div>
                  <div className="space-y-2">
                    <a className="block hover:text-white" href="#database">
                      Search
                    </a>
                    <a className="block hover:text-white" href="#leaderboard">
                      Leaderboard
                    </a>
                    <a className="block hover:text-white" href="#categories">
                      Categories
                    </a>
                    <a className="block hover:text-white" href="#ads">
                      Advertise
                    </a>
                    <a className="block hover:text-white" href="#">
                      Terms
                    </a>
                  </div>
                </div>

                <div>
                  <div className="text-white/70 font-semibold mb-3">Browse</div>
                  <div className="space-y-2">
                    {categories
                      .filter((c): c is Category => c !== "All")
                      .slice(0, 10)
                      .map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCat(c)}
                          className="block text-left hover:text-white"
                        >
                          {c}
                        </button>
                      ))}
                  </div>
                </div>

                <div>
                  <div className="text-white/70 font-semibold mb-3">Placements</div>
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2">
                      <Newspaper className="h-4 w-4" /> Verified Spotlight
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <Megaphone className="h-4 w-4" /> Partner Placement
                    </div>
                    <div className="text-white/45 leading-relaxed">
                      Ads are allowed only when the underlying claims are verifiable.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-xs text-white/35 flex items-center justify-between">
                <div>© {new Date().getFullYear()} Givn</div>
                <div className="text-white/45">Proof is the product</div>
              </div>
            </section>

            {/* Right rail (2xl only) */}
            <aside className="hidden 2xl:flex flex-col gap-4">
              <div className="transition-opacity duration-500">
                <AdCard ad={SIDE_ADS_RIGHT[adRightIndex]} />
              </div>

              {SIDE_ADS_RIGHT.filter((_, i) => i !== adRightIndex)
                .slice(0, 3)
                .map((ad) => (
                  <AdCard key={ad.title} ad={ad} />
                ))}

              <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs text-white/70 font-semibold">Advertise</div>
                <div className="mt-2 text-[11px] text-white/45 leading-relaxed">
                  Placements are vetted. Proof wins.
                </div>
                <a
                  href="#"
                  className="mt-4 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition"
                >
                  Apply <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
