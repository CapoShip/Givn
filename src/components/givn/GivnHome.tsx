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
 * Public, verifiable impact records for brands.
 * Built to make donation proof visible, readable, and hard to fake.
 */

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

type ProofStatus = "verified" | "missing";

type Category =
  | "E-commerce"
  | "SaaS"
  | "Consumer"
  | "Fashion"
  | "Beauty"
  | "Food"
  | "Health"
  | "Education"
  | "Marketplace"
  | "Other";

type ImpactCard = {
  id: string;
  brand: string;
  category: Category;
  verified: boolean;
  verifiedThisMonth: number; // dollars
  lastProof: string; // ISO-ish
  claim: string;
  proofStatus: ProofStatus;
};

type LeaderRow = {
  rank: number;
  brand: string;
  category: Category;
  verifiedThisMonth: number;
  verifiedAllTime: number;
  lastProof: string;
  status: ProofStatus;
};

type AdTone = "blue" | "slate" | "violet" | "green" | "amber" | "indigo";

type Ad = {
  title: string;
  desc: string;
  tone: AdTone;
};

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function money(n: number) {
  if (n <= 0) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
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

function nextIndex(current: number, length: number) {
  if (length <= 0) return 0;
  return (current + 1) % length;
}

// dev tests
if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
  console.assert(money(0) === "—", "money(0)");
  console.assert(money(500) === "$500", "money(500)");
  console.assert(money(1500) === "$1.5k", "money(1500)");
  console.assert(matches("", "abc") === true, "matches empty");
  console.assert(matches("ab", "abc") === true, "matches positive");
  console.assert(matches("zz", "abc") === false, "matches negative");
  console.assert(unique(["a", "a", "b"]).length === 2, "unique");
  console.assert("2025-12-08T09:11Z".replace("T", " ").includes(" "), "lastProof replace T");
  console.assert(nextIndex(0, 5) === 1, "nextIndex increments");
  console.assert(nextIndex(4, 5) === 0, "nextIndex wraps");
  console.assert(nextIndex(10, 0) === 0, "nextIndex safe on empty");
}

// ────────────────────────────────────────────────────────────
// Demo data
// ────────────────────────────────────────────────────────────

const IMPACT: ImpactCard[] = [
  {
    id: "b1",
    brand: "Lumen Goods",
    category: "E-commerce",
    verified: true,
    verifiedThisMonth: 1250,
    lastProof: "2025-12-08T09:11Z",
    claim: "1% of revenue donated",
    proofStatus: "verified",
  },
  {
    id: "b2",
    brand: "VantaWear",
    category: "Fashion",
    verified: true,
    verifiedThisMonth: 620,
    lastProof: "2025-12-05T14:22Z",
    claim: "A portion donated",
    proofStatus: "verified",
  },
  {
    id: "b3",
    brand: "Nori Market",
    category: "Food",
    verified: false,
    verifiedThisMonth: 0,
    lastProof: "2025-11-01T—",
    claim: "We give back monthly",
    proofStatus: "missing",
  },
  {
    id: "b4",
    brand: "Pulse Bloom",
    category: "Health",
    verified: true,
    verifiedThisMonth: 310,
    lastProof: "2025-12-10T08:03Z",
    claim: "$1 per order donated",
    proofStatus: "verified",
  },
  {
    id: "b5",
    brand: "Cedar Kids",
    category: "Education",
    verified: true,
    verifiedThisMonth: 980,
    lastProof: "2025-12-09T16:40Z",
    claim: "Supplies funded",
    proofStatus: "verified",
  },
  {
    id: "b6",
    brand: "Echo Cart",
    category: "Marketplace",
    verified: true,
    verifiedThisMonth: 210,
    lastProof: "2025-12-07T11:02Z",
    claim: "Carbon removal funded",
    proofStatus: "verified",
  },
];

const LEADERBOARD: LeaderRow[] = [
  {
    rank: 1,
    brand: "Lumen Goods",
    category: "E-commerce",
    verifiedThisMonth: 1250,
    verifiedAllTime: 8420,
    lastProof: "2025-12-08T09:11Z",
    status: "verified",
  },
  {
    rank: 2,
    brand: "Cedar Kids",
    category: "Education",
    verifiedThisMonth: 980,
    verifiedAllTime: 6110,
    lastProof: "2025-12-09T16:40Z",
    status: "verified",
  },
  {
    rank: 3,
    brand: "VantaWear",
    category: "Fashion",
    verifiedThisMonth: 620,
    verifiedAllTime: 3190,
    lastProof: "2025-12-05T14:22Z",
    status: "verified",
  },
  {
    rank: 4,
    brand: "Pulse Bloom",
    category: "Health",
    verifiedThisMonth: 310,
    verifiedAllTime: 1440,
    lastProof: "2025-12-10T08:03Z",
    status: "verified",
  },
  {
    rank: 5,
    brand: "Echo Cart",
    category: "Marketplace",
    verifiedThisMonth: 210,
    verifiedAllTime: 980,
    lastProof: "2025-12-07T11:02Z",
    status: "verified",
  },
];

const SIDE_ADS_LEFT: Ad[] = [
  { title: "Replymer", desc: "Human replies that sell your product", tone: "blue" },
  { title: "ace.me", desc: "Email + address + cloud storage", tone: "slate" },
  { title: "Requesty", desc: "Centralize requests, route to the right team", tone: "violet" },
  { title: "BlogSEO", desc: "Rank on Google & AI search, on autopilot", tone: "slate" },
  { title: "HypeProxies", desc: "Proxy infra built for automating & scaling", tone: "green" },
];

const SIDE_ADS_RIGHT: Ad[] = [
  { title: "Newsletters.ai", desc: "Weekly AI catch-up for lazy readers", tone: "amber" },
  { title: "ADMN", desc: "10x Linux Server Administration", tone: "indigo" },
  { title: "WaitForIt", desc: "Build a waitlist for your idea in 3 minutes", tone: "slate" },
  { title: "Postopus", desc: "Post everywhere, all at once", tone: "violet" },
  { title: "Rewardful", desc: "Launch and scale your affiliate program", tone: "blue" },
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

function AdCard({
  title,
  desc,
  tone,
  active,
}: {
  title: string;
  desc: string;
  tone: AdTone;
  active: boolean;
}) {
  const toneClass: Record<AdTone, string> = {
    blue: "bg-sky-500/10 border-sky-500/20",
    slate: "bg-white/5 border-white/10",
    violet: "bg-violet-500/10 border-violet-500/20",
    green: "bg-emerald-500/10 border-emerald-500/20",
    amber: "bg-amber-500/10 border-amber-500/20",
    indigo: "bg-indigo-500/10 border-indigo-500/20",
  };

  return (
    <div
      className={cx(
        "rounded-2xl border p-5 transition-all duration-700 will-change-transform",
        toneClass[tone],
        active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}
    >
      <div className="text-xs text-white/80 font-semibold">{title}</div>
      <div className="mt-2 text-[11px] text-white/50 leading-relaxed">{desc}</div>
      <div className="mt-4 h-px w-full bg-white/10" />
      <div className="mt-3 text-[10px] text-white/40">Sponsored</div>
    </div>
  );
}

function RotatingAdRail({
  ads,
  intervalMs,
  offset,
}: {
  ads: Ad[];
  intervalMs: number;
  offset?: number;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!ads.length) return;

    // optional offset so left/right don't change at the exact same time
    let t0: number | undefined;
    let int: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      int = setInterval(() => {
        setIdx((v) => nextIndex(v, ads.length));
      }, intervalMs);
    };

    if (offset && offset > 0) {
      t0 = window.setTimeout(() => start(), offset);
    } else {
      start();
    }

    return () => {
      if (t0) window.clearTimeout(t0);
      if (int) clearInterval(int);
    };
  }, [ads.length, intervalMs, offset]);

  return (
    <div className="flex flex-col gap-4">
      {ads.map((a, i) => (
        <AdCard
          key={a.title}
          title={a.title}
          desc={a.desc}
          tone={a.tone}
          active={i === idx}
        />
      ))}
    </div>
  );
}

function ImpactTile({ item }: { item: ImpactCard }) {
  return (
    <div className="w-[240px] shrink-0 rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white/90">{item.brand}</div>
          <div className="mt-1 text-[11px] text-white/50">{item.category}</div>
        </div>
        <span
          className={cx(
            "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] tracking-widest",
            item.verified ? "border-white/15 text-white/70" : "border-red-500/30 text-red-200"
          )}
        >
          {item.verified ? (
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
          <div className="text-white/40">STATUS</div>
          <div className="mt-1 text-white">{item.proofStatus}</div>
        </div>
        <div>
          <div className="text-white/40">LAST PROOF</div>
          <div className="mt-1 text-white">{item.lastProof.replace("T", " ")}</div>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-white/55">Claim: {item.claim}</div>

      <div className="mt-4">
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
  const categories = useMemo(() => {
    const cats = unique(IMPACT.map((x) => x.category));
    return ["All" as const, ...cats];
  }, []);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    return IMPACT.filter((x) => {
      const okQ = matches(q, `${x.brand} ${x.category} ${x.claim}`);
      const okC = cat === "All" ? true : x.category === cat;
      return okQ && okC;
    });
  }, [q, cat]);

  return (
    <>
      {/* Ensure the preview/container background never shows white gutters */}
      <style jsx global>{`
        html, body { background: #000; }
        body { margin: 0; }
      `}</style>

      <div className="min-h-screen w-full bg-black text-white overflow-x-hidden">

        {/* Top bar */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
          <div className="max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/70" />
              <span className="text-sm font-semibold text-white/85">Givn</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-xs text-white/60">
              <a className="hover:text-white transition" href="#database">Database</a>
              <a className="hover:text-white transition" href="#leaderboard">Leaderboard</a>
              <a className="hover:text-white transition" href="#categories">Categories</a>
              <a className="hover:text-white transition" href="#ads">Ads</a>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white text-black px-3 py-2 text-xs font-semibold hover:opacity-90 transition"
            >
              Request access <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </header>

        {/* Hero + rails layout */}
        <main className="max-w-[1200px] mx-auto px-5 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_240px] gap-6">

            {/* Left rail (rotating fake ads) */}
            <aside className="hidden lg:block">
              <RotatingAdRail ads={SIDE_ADS_LEFT} intervalMs={3200} />
            </aside>

            {/* Center */}
            <section>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-white/70 text-sm">
                  <BadgeCheck className="h-4 w-4" />
                  <span className="font-semibold">Givn</span>
                </div>

                <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
                  They say they donate.
                  <br />
                  <span className="text-white/60">Givn shows the proof.</span>
                </h1>

                <p className="mt-4 text-white/60 max-w-2xl mx-auto">
                  Brands can claim anything. Givn shows what can be proven.
                </p>

                {/* Search */}
                <div className="mt-8 flex items-center justify-center gap-3">
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
                    className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
                  >
                    <Plus className="h-4 w-4" /> Add brand
                  </button>
                </div>

                <div className="mt-4 text-xs text-white/40">
                  All impact is verified through evidence uploads. Data updates when new proof is recorded.
                </div>
              </div>

              {/* Categories chips */}
              <div id="categories" className="mt-12 border-t border-white/10 pt-10">
                <div className="text-center text-sm font-semibold text-white/85">Browse by category</div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {categories.map((c) => (
                    <Pill key={c} active={c === cat} onClick={() => setCat(c)}>
                      {c}
                    </Pill>
                  ))}
                </div>
              </div>

              {/* Recently listed */}
              <div id="database" className="mt-12">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white/85">Recently verified</div>
                  <a href="#" className="text-xs text-white/50 hover:text-white transition">
                    View all <ArrowRight className="inline h-4 w-4" />
                  </a>
                </div>

                <div className="mt-4 -mx-5 px-5 flex gap-4 overflow-x-auto pb-2 max-w-full">

                  {filtered.slice(0, 8).map((x) => (
                    <ImpactTile key={x.id} item={x} />
                  ))}
                </div>
              </div>

              {/* Featured */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white/85">Featured this week</div>
                  <a href="#" className="text-xs text-white/50 hover:text-white transition">
                    View all <ArrowRight className="inline h-4 w-4" />
                  </a>
                </div>

                <div className="mt-4 -mx-5 px-5 flex gap-4 overflow-x-auto pb-2 max-w-full">

                  {filtered
                    .slice()
                    .reverse()
                    .slice(0, 8)
                    .map((x) => (
                      <ImpactTile key={x.id} item={x} />
                    ))}
                </div>
              </div>

              {/* Leaderboard */}
              <div id="leaderboard" className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
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
                      {LEADERBOARD.map((r) => (
                        <tr key={r.rank} className="border-t border-white/10">
                          <td className="py-3 pr-3 text-white/70">
                            {r.rank === 1 ? <Crown className="inline h-4 w-4 mr-2" /> : null}
                            {r.rank}
                          </td>
                          <td className="py-3 text-white/85">{r.brand}</td>
                          <td className="py-3 text-white/60">{r.category}</td>
                          <td className="py-3 text-right text-white">{money(r.verifiedThisMonth)}</td>
                          <td className="py-3 text-right text-white/85">{money(r.verifiedAllTime)}</td>
                          <td className="py-3 text-right text-white/70">{r.lastProof.replace("T", " ")}</td>
                          <td className="py-3 text-right">
                            <span
                              className={cx(
                                "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px]",
                                r.status === "verified"
                                  ? "border-white/15 text-white/70"
                                  : "border-red-500/30 text-red-200"
                              )}
                            >
                              {r.status === "verified" ? (
                                <>
                                  <BadgeCheck className="h-4 w-4" /> verified
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="h-4 w-4" /> missing
                                </>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer links */}
              <div className="mt-14 border-t border-white/10 pt-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-xs text-white/50">
                <div>
                  <div className="text-white/70 font-semibold mb-3">Navigation</div>
                  <div className="space-y-2">
                    <a className="block hover:text-white" href="#database">Search</a>
                    <a className="block hover:text-white" href="#leaderboard">Stats</a>
                    <a className="block hover:text-white" href="#categories">Categories</a>
                    <a className="block hover:text-white" href="#ads">Advertise</a>
                    <a className="block hover:text-white" href="#">Terms of service</a>
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
                <div id="ads">
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
                <div className="text-white/45">Proof of Real Impact</div>
              </div>
            </section>

            {/* Right rail (rotating fake ads) */}
            <aside className="hidden lg:block">
              <RotatingAdRail ads={SIDE_ADS_RIGHT} intervalMs={3600} offset={800} />

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs text-white/70 font-semibold">Advertise</div>
                <div className="mt-2 text-[11px] text-white/45 leading-relaxed">
                  Placements are vetted. Proof is the product.
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
