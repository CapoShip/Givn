"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Eye,
  EyeOff,
  Zap,
  Skull,
} from "lucide-react";

/**
 * GIVN — PROOF ENGINE
 * This is not a website.
 * This is an interface that exposes truth.
 * The goal is to unsettle before it convinces.
 */

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

type ProofStatus = "verified" | "missing";

type ProofEntry = {
  id: string;
  timestamp: string;
  amount: number;
  ngo: string;
  status: ProofStatus;
};

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function money(n: number) {
  if (n <= 0) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

function sumVerified(entries: ProofEntry[]) {
  return entries
    .filter((e) => e.status === "verified")
    .reduce((s, e) => s + e.amount, 0);
}

function mostRecentVerifiedDate(entries: ProofEntry[]) {
  const v = entries.find((e) => e.status === "verified");
  return v ? v.timestamp.split("T")[0] : null;
}

// dev tests
if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
  console.assert(money(0) === "—", "money(0) should be —");
  console.assert(money(500) === "$500", "money(500) should be $500");
  console.assert(money(1500) === "$1.5k", "money(1500) should be $1.5k");

  const t: ProofEntry[] = [
    { id: "a", timestamp: "x", amount: 10, ngo: "n", status: "verified" },
    { id: "b", timestamp: "y", amount: 0, ngo: "n", status: "missing" },
    { id: "c", timestamp: "z", amount: 20, ngo: "n", status: "verified" },
  ];
  console.assert(sumVerified(t) === 30, "sumVerified should sum only verified entries");
  console.assert(mostRecentVerifiedDate(t) === "x", "mostRecentVerifiedDate should return first verified entry date prefix");
}

// ────────────────────────────────────────────────────────────
// Immutable proof log (demo)
// ────────────────────────────────────────────────────────────

const LEDGER: ProofEntry[] = [
  {
    id: "l4",
    timestamp: "2024-12-12T10:43Z",
    amount: 500,
    ngo: "Water.org",
    status: "verified",
  },
  {
    id: "l3",
    timestamp: "2024-11-03T09:01Z",
    amount: 420,
    ngo: "Water.org",
    status: "verified",
  },
  {
    id: "l2",
    timestamp: "2024-10-18T—",
    amount: 0,
    ngo: "—",
    status: "missing",
  },
  {
    id: "l1",
    timestamp: "2024-09-02T08:11Z",
    amount: 380,
    ngo: "Water.org",
    status: "verified",
  },
];

// ────────────────────────────────────────────────────────────
// App
// ────────────────────────────────────────────────────────────

export default function GivnProofEngine() {

  const [reveal, setReveal] = useState(false);
  const [showMissing, setShowMissing] = useState(true);
  const [badgeOpen, setBadgeOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) setReveal(true);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lastVerifiedDate = useMemo(() => mostRecentVerifiedDate(LEDGER), []);

  // NOTE: For now, we degrade only when there is no verified record at all.
  // If you want "stale" to mean "no proof for current month", tell me your exact month/period rules.
  const badgeState: "valid" | "stale" = lastVerifiedDate ? "valid" : "stale";

  const verifiedTotal = useMemo(
    () => sumVerified(LEDGER),
    []
  );

  return (
  <div className="min-h-screen bg-red-500 text-white">

      {/* ───────────── HERO : EXISTENTIAL ACCUSATION ───────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />
        <h1 className="relative z-10 text-6xl md:text-8xl font-bold tracking-tight">
          THEY SAY THEY DONATE
        </h1>
        <p className="relative z-10 mt-6 text-2xl md:text-3xl text-white/50">
          but money leaves traces.
        </p>
        <div className="relative z-10 mt-16 animate-pulse">
          <ArrowRight className="h-10 w-10 text-white/30" />
        </div>
      </section>

      {/* ───────────── PROOF REVEAL ───────────── */}
      <section
        className={`transition-opacity duration-700 ${reveal ? "opacity-100" : "opacity-0"}`}
      >
        <div className="max-w-4xl mx-auto px-6 pb-40">
          <div className="mb-16">
            <h2 className="text-xs uppercase tracking-widest text-white/40">
              Public donation ledger
            </h2>
            <p className="mt-3 text-lg text-white/60 max-w-xl">
              This is not a claim. This is a record.
            </p>
          </div>

          <div className="space-y-6">
            {LEDGER.filter((l) => showMissing || l.status === "verified").map((l) => (
              <div
                key={l.id}
                className={`group flex items-center justify-between border-l-2 pl-6 pr-5 py-6 transition ${
                  l.status === "verified"
                    ? "border-white/20"
                    : "border-red-500/50 bg-red-500/5"
                }`}
              >
                <div className="flex items-center gap-5">
                  {l.status === "verified" ? (
                    <ShieldCheck className="h-6 w-6 text-white/60" />
                  ) : (
                    <Skull className="h-6 w-6 text-red-400" />
                  )}
                  <div>
                    <div className="text-sm text-white/70">{l.timestamp}</div>
                    <div className="text-xs text-white/40">{l.ngo}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xl ${l.status === "missing" ? "text-red-400" : ""}`}
                  >
                    {l.status === "verified" ? money(l.amount) : "NO VERIFIED DONATION"}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30">
                    {l.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-16 flex items-center justify-between">
            <div className="text-sm text-white/50">
              Verified total → <span className="text-white">{money(verifiedTotal)}</span>
            </div>
            <button
              onClick={() => setShowMissing((v) => !v)}
              className="inline-flex items-center gap-2 border border-white/30 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
            >
              {showMissing ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showMissing ? "hide missing records" : "show missing records"}
            </button>
          </div>
        </div>
      </section>

      {/* ───────────── BADGE = LIVING CONTRACT ───────────── */}
      <section className="border-t border-white/10 py-40 text-center">
        <div className="max-w-xl mx-auto px-6">
          {/* Badge core */}
          <button
            onClick={() => setBadgeOpen((v) => !v)}
            className={`inline-flex w-full flex-col items-center gap-3 px-10 py-8 transition border ${
              badgeState === "valid" ? "border-white/30" : "border-red-500/50 bg-red-500/5"
            }`}
          >
            <BadgeCheck className="h-7 w-7" />
            <div className="text-lg tracking-wide">VERIFIED IMPACT</div>

            {/* Dynamic state */}
            <div className="mt-2 text-sm text-white/60">Verification valid for</div>
            <div className="text-xl font-semibold">December 2024</div>

            <div className="mt-4 text-sm text-white/50">
              {money(verifiedTotal)} verified donations
            </div>

            <div
              className={`mt-6 border-t pt-4 text-xs max-w-xs ${
                badgeState === "valid"
                  ? "border-white/10 text-white/40"
                  : "border-red-500/30 text-red-400"
              }`}
            >
              This badge expires automatically if no new proof is recorded for the next period.
            </div>
          </button>

          {/* Verdict text */}
          <p className="mt-12 text-white/50 text-lg">
            This is not a promise.
            <br />
            This is a time-bound verification.
          </p>

          {/* CTA */}
          <div className="mt-20 inline-flex items-center gap-3 bg-white text-black px-10 py-5 text-sm font-semibold">
            Install Givn on Shopify
            <Zap className="h-4 w-4" />
          </div>

          {/* Disclaimer */}
          <p className="mt-12 text-xs text-white/40">
            Givn does not certify intent. Only verifiable records.
          </p>

          {/* Expandable audit trail */}
          {badgeOpen && (
            <div className="mt-20 max-w-2xl mx-auto text-left border border-white/10 p-6">
              <div className="mb-6 text-xs uppercase tracking-widest text-white/40">
                Badge audit trail
              </div>
              <div className="space-y-4">
                {LEDGER.map((l) => (
                  <div key={l.id} className="flex justify-between text-sm">
                    <span className={l.status === "missing" ? "text-red-400" : "text-white/70"}>
                      {l.timestamp}
                    </span>
                    <span className={l.status === "missing" ? "text-red-400" : "text-white"}>
                      {l.status === "verified" ? money(l.amount) : "NO VERIFIED DONATION"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-xs text-white/40">
                This badge reflects real-time verification status.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ───────────── FOOTER ───────────── */}
      <footer className="border-t border-white/10 py-12 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Givn — Proof is the product
      </footer>
    </div>
  );
}
