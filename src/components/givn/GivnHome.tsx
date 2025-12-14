// src/components/givn/GivnHome.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Search,
  Plus,
  Sparkles,
  Megaphone,
  Newspaper,
  Crown,
  ShieldCheck,
} from "lucide-react";
import {
  BRANDS,
  Category,
  cx,
  fmtStamp,
  matches,
  money,
  ProofStatus,
  unique,
} from "@/lib/givn-data";

type AdTone = "blue" | "slate" | "violet" | "green" | "amber" | "indigo";

type Ad = {
  title: string;
  desc: string;
  tone: AdTone;
  icon: "megaphone" | "newspaper" | "sparkles";
};

const ADS: Ad[] = [
  { title: "Verified Spotlight", desc: "One brand. One claim. One proof trail.", tone: "blue", icon: "sparkles" },
  { title: "Partner Placement", desc: "Sponsored — only if verifiable.", tone: "amber", icon: "megaphone" },
  { title: "Monthly Digest", desc: "Newly verified brands. No fluff.", tone: "indigo", icon: "newspaper" },
  { title: "Proof Drop", desc: "Evidence uploaded → badge updates instantly.", tone: "violet", icon: "sparkles" },
  { title: "Impact Index", desc: "Rank by verified donation totals.", tone: "green", icon: "newspaper" },
];

function ToneBox({ tone }: { tone: AdTone }) {
  const toneClass: Record<AdTone, string> = {
    blue: "from-sky-500/20 via-sky-500/5 to-transparent border-sky-500/20",
    slate: "from-white/10 via-white/5 to-transparent border-white/10",
    violet: "from-violet-500/20 via-violet-500/5 to-transparent border-violet-500/20",
    green: "from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/20",
    amber: "from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/20",
    indigo: "from-indigo-500/20 via-indigo-500/5 to-transparent border-indigo-500/20",
  };
  return toneClass[tone];
}

function AdIcon({ icon }: { icon: Ad["icon"] }) {
  if (icon === "megaphone") return <Megaphone className="h-4 w-4 text-white/70" />;
  if (icon === "newspaper") return <Newspaper className="h-4 w-4 text-white/70" />;
  return <Sparkles className="h-4 w-4 text-white/70" />;
}

/**
 * WOW ads:
 * - rotates automatically
 * - crossfade + slight slide
 * - progress bar
 * - shine sweep
 * - hover tilt
 */
function AdRotator({ side }: { side: "left" | "right" }) {
  const [idx, setIdx] = useState(side === "left" ? 0 : 2);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const every = 3200;
    const i = window.setInterval(() => setIdx((v) => (v + 1) % ADS.length), every);

    // progress bar ticker (smooth-ish without requestAnimationFrame)
    const p = window.setInterval(() => setTick((t) => (t + 1) % 1000), 40);

    return () => {
      window.clearInterval(i);
      window.clearInterval(p);
    };
  }, []);

  const ad = ADS[idx];
  const progress = (tick / 1000) * 100;

  return (
    <div className="relative">
      <div
        className={cx(
          "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5",
          ToneBox({ tone: ad.tone }),
          "transition will-change-transform"
        )}
        style={{
          transform: "translateZ(0)",
        }}
      >
        {/* shine sweep */}
        <div className="pointer-events-none absolute -inset-20 opacity-0 group-hover:opacity-100 transition duration-500">
          <div className="absolute inset-0 rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)] animate-[givnShine_1.2s_ease-in-out_infinite]" />
        </div>

        {/* subtle noise */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_40%)]" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <AdIcon icon={ad.icon} />
            <div className="text-xs font-semibold text-white/85">{ad.title}</div>
          </div>
          <div className="text-[10px] text-white/40">Sponsored</div>
        </div>

        <div className="relative z-10 mt-3 text-[11px] leading-relaxed text-white/55">
          {ad.desc}
        </div>

        <div className="relative z-10 mt-4 flex items-center justify-between">
          <div className="text-[10px] text-white/40">Rotating</div>
          <div className="text-[10px] text-white/60">{idx + 1}/{ADS.length}</div>
        </div>

        {/* progress bar */}
        <div className="relative z-10 mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-white/40 transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* hover tilt */}
      <style jsx>{`
        .group:hover {
          transform: perspective(700px) rotateX(3deg) rotateY(${side === "left" ? "4deg" : "-4deg"}) translateY(-2px);
        }
      `}</style>
    </div>
  );
}

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

function StatusPill({ status }: { status: ProofStatus }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] tracking-widest",
        status === "verified"
          ? "border-white/15 text-white/70"
          : "border-red-500/30 text-red-200"
      )}
    >
      {status === "verified" ? (
        <>
          <BadgeCheck className="h-3.5 w-3.5" /> VERIFIED
        </>
      ) : (
        <>
          <ShieldCheck className="h-3.5 w-3.5" /> MISSING
        </>
      )}
    </span>
  );
}

function BrandCard({ slug }: { slug: string }) {
  const b = BRANDS.find((x) => x.slug === slug)!;

  return (
    <Link
      href={`/brand/${b.slug}`}
      className="min-w-[260px] rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition block"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white/90">{b.name}</div>
          <div className="mt-1 text-[11px] text-white/50">{b.category}</div>
        </div>
        <StatusPill status={b.proofStatus} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-[11px]">
        <div>
          <div className="text-white/40">THIS MONTH</div>
          <div className="mt-1 text-white">{money(b.verifiedThisMonth)}</div>
        </div>
        <div>
          <div className="text-white/40">ALL TIME</div>
          <div className="mt-1 text-white">{money(b.verifiedAllTime)}</div>
        </div>
        <div>
          <div className="text-white/40">LAST PROOF</div>
          <div className="mt-1 text-white">{fmtStamp(b.lastProof)}</div>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-white/55">
        Claim: {b.claim}
      </div>

      <div className="mt-4 inline-flex items-center gap-2 text-xs text-white/70">
        View brand dashboard <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

export default function GivnHome() {
  const categories = useMemo(() => {
    const cats = unique(BRANDS.map((x) => x.category));
    return ["All" as const, ...cats];
  }, []);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    return BRANDS.filter((x) => {
      const okQ = matches(q, `${x.name} ${x.category} ${x.claim}`);
      const okC = cat === "All" ? true : x.category === cat;
      return okQ && okC;
    });
  }, [q, cat]);

  const leaderboard = useMemo(() => {
    // Ranked by verifiedThisMonth (donations)
    return BRANDS.slice()
      .sort((a, b) => b.verifiedThisMonth - a.verifiedThisMonth)
      .slice(0, 6);
  }, []);

  return (
    <>
      {/* No horizontal scroll ever */}
      <div className="min-h-screen w-full bg-black text-white overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/70" />
              <span className="text-sm font-semibold text-white/85">Givn</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs text-white/60">
              <a className="hover:text-white transition" href="#database">Database</a>
              <a className="hover:text-white transition" href="#leaderboard">Leaderboard</a>
              <a className="hover:text-white transition" href="#categories">Categories</a>
              <a className="hover:text-white transition" href="#ads">Ads</a>
            </nav>

            <Link
              href="/request-access"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white text-black px-3 py-2 text-xs font-semibold hover:opacity-90 transition"
            >
              Request access <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* Layout: center always fluid; rails only on very large screens */}
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 2xl:grid-cols-[320px_1fr_320px] gap-8">
            {/* Left rail (only on 2xl) */}
            <aside className="hidden 2xl:flex flex-col gap-4" id="ads">
              <AdRotator side="left" />
              <AdRotator side="left" />
              <AdRotator side="left" />
            </aside>

            {/* Center */}
            <section className="min-w-0">
              {/* Hero */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-white/70 text-sm">
                  <BadgeCheck className="h-4 w-4" />
                  <span className="font-semibold">Givn</span>
                </div>

                <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
                  They say they donate.
                  <span className="block text-white/45">Givn shows the proof.</span>
                </h1>

                <p className="mt-4 text-white/60 max-w-2xl mx-auto">
                  Brands can claim anything. Givn only shows what is verifiable.
                </p>

                {/* Search + actions */}
                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                  <div className="flex items-center gap-2 w-full max-w-[560px] rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <Search className="h-4 w-4 text-white/50" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search brands, categories, claims..."
                      className="w-full bg-transparent outline-none text-sm text-white/80 placeholder:text-white/35"
                    />
                  </div>

                  <Link
                    href="/request-access"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
                  >
                    <Plus className="h-4 w-4" /> Add brand
                  </Link>
                </div>

                <div className="mt-4 text-xs text-white/40">
                  Badges update when evidence is uploaded. Missing proof is shown publicly.
                </div>
              </div>

              {/* Mobile ads (appear under hero, instead of compressing layout) */}
              <div className="mt-10 2xl:hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AdRotator side="left" />
                  <AdRotator side="right" />
                  <AdRotator side="left" />
                </div>
              </div>

              {/* Categories */}
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

              {/* Database section */}
              <div id="database" className="mt-12">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white/85">Recently listed</div>
                  <Link href="/request-access" className="text-xs text-white/50 hover:text-white transition">
                    View all <ArrowRight className="inline h-4 w-4" />
                  </Link>
                </div>

                {/* Cards: NO horizontal page scroll; only the row scrolls */}
                <div className="mt-4 -mx-4 sm:mx-0">
                  <div className="px-4 sm:px-0 flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
                    {filtered.slice(0, 10).map((b) => (
                      <div key={b.slug} className="snap-start">
                        <BrandCard slug={b.slug} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <div id="leaderboard" className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm font-semibold text-white/85">Impact leaderboard</div>
                  <div className="text-xs text-white/45">Ranked by verified donations (this month)</div>
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
                      {leaderboard.map((r, i) => (
                        <tr key={r.slug} className="border-t border-white/10">
                          <td className="py-3 pr-3 text-white/70">
                            {i === 0 ? <Crown className="inline h-4 w-4 mr-2" /> : null}
                            {i + 1}
                          </td>
                          <td className="py-3 text-white/85">
                            <Link href={`/brand/${r.slug}`} className="hover:underline">
                              {r.name}
                            </Link>
                          </td>
                          <td className="py-3 text-white/60">{r.category}</td>
                          <td className="py-3 text-right text-white">{money(r.verifiedThisMonth)}</td>
                          <td className="py-3 text-right text-white/85">{money(r.verifiedAllTime)}</td>
                          <td className="py-3 text-right text-white/70">{fmtStamp(r.lastProof)}</td>
                          <td className="py-3 text-right">
                            <StatusPill status={r.proofStatus} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-14 border-t border-white/10 pt-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-xs text-white/50">
                <div>
                  <div className="text-white/70 font-semibold mb-3">Navigation</div>
                  <div className="space-y-2">
                    <a className="block hover:text-white" href="#database">Database</a>
                    <a className="block hover:text-white" href="#leaderboard">Leaderboard</a>
                    <a className="block hover:text-white" href="#categories">Categories</a>
                    <Link className="block hover:text-white" href="/request-access">Request access</Link>
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
                  <div className="text-white/70 font-semibold mb-3">Ads policy</div>
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2">
                      <Newspaper className="h-4 w-4" /> Only verifiable ads
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <Megaphone className="h-4 w-4" /> Sponsored ≠ unverified
                    </div>
                    <div className="text-white/45 leading-relaxed">
                      If a claim can’t be proven, it can’t be promoted.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-xs text-white/35 flex items-center justify-between">
                <div>© {new Date().getFullYear()} Givn</div>
                <div className="text-white/45">Proof is the product</div>
              </div>
            </section>

            {/* Right rail (only on 2xl) */}
            <aside className="hidden 2xl:flex flex-col gap-4">
              <AdRotator side="right" />
              <AdRotator side="right" />
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs text-white/70 font-semibold">Advertise</div>
                <div className="mt-2 text-[11px] text-white/45 leading-relaxed">
                  Want a placement? Your proof must be real.
                </div>
                <Link
                  href="/request-access"
                  className="mt-4 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition"
                >
                  Apply <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        </main>

        {/* Keyframes for shine */}
        <style jsx global>{`
          @keyframes givnShine {
            0% { transform: translateX(-30%); opacity: 0; }
            15% { opacity: .9; }
            55% { opacity: .6; }
            100% { transform: translateX(30%); opacity: 0; }
          }
        `}</style>
      </div>
    </>
  );
}
