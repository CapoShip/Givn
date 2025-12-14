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

type ProofStatus = "verified" | "missing";
type ProofEntry = {
  id: string;
  timestamp: string;
  amount: number;
  ngo: string;
  status: ProofStatus;
};

function money(n: number) {
  if (n <= 0) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

const LEDGER: ProofEntry[] = [
  { id: "l4", timestamp: "2024-12-12T10:43Z", amount: 500, ngo: "Water.org", status: "verified" },
  { id: "l3", timestamp: "2024-11-03T09:01Z", amount: 420, ngo: "Water.org", status: "verified" },
  { id: "l2", timestamp: "2024-10-18T—", amount: 0, ngo: "—", status: "missing" },
  { id: "l1", timestamp: "2024-09-02T08:11Z", amount: 380, ngo: "Water.org", status: "verified" },
];

export default function GivnProofEngine() {
  const [reveal, setReveal] = useState(false);
  const [showMissing, setShowMissing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReveal(true), 450);
    return () => clearTimeout(t);
  }, []);

  const verifiedTotal = useMemo(
    () => LEDGER.filter(l => l.status === "verified").reduce((s, l) => s + l.amount, 0),
    []
  );

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-sm text-white/80">Givn</a>

          <nav className="flex items-center gap-4 text-xs text-white/60">
            <a className="hover:text-white" href="/how-it-works">How it works</a>
            <a className="hover:text-white" href="/pricing">Pricing</a>
            <a className="hover:text-white" href="/brand/demo-brand">Proof page</a>
            <a className="inline-flex items-center gap-2 bg-white text-black px-3 py-2 font-semibold" href="/request-access">
              Request access <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative pt-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className={`transition-all duration-700 ${reveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            PROOF
            <span className="text-white/40"> &gt; </span>
            PROMISES
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-white/55 max-w-2xl mx-auto">
            Givn verifies donation claims for Shopify brands and publishes a public ledger.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/brand/demo-brand"
              className="inline-flex items-center justify-center gap-2 border border-white/25 px-6 py-3 text-sm text-white/80 hover:bg-white/10"
            >
              View a proof page <ShieldCheck className="h-4 w-4" />
            </a>
            <a
              href="/request-access"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 text-sm font-semibold hover:opacity-90"
            >
              Install on Shopify <Zap className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 text-xs text-white/40">
            Not an NGO. Not a donation platform. A third-party verification layer.
          </div>
        </div>
      </section>

      {/* Mini Proof Preview (court) */}
      <section className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs tracking-widest text-white/40">PUBLIC LEDGER (PREVIEW)</div>
              <div className="mt-3 text-lg text-white/60">Claims don’t convert. Records do.</div>
            </div>

            <button
              onClick={() => setShowMissing(v => !v)}
              className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
            >
              {showMissing ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showMissing ? "hide missing" : "show missing"}
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {LEDGER.filter(l => showMissing || l.status === "verified").slice(0, 3).map(l => (
              <div
                key={l.id}
                className={`flex items-center justify-between border-l-2 pl-5 pr-4 py-4 ${
                  l.status === "verified" ? "border-white/20" : "border-red-500/50 bg-red-500/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {l.status === "verified" ? (
                    <ShieldCheck className="h-5 w-5 text-white/60" />
                  ) : (
                    <Skull className="h-5 w-5 text-red-300" />
                  )}
                  <div>
                    <div className="text-sm text-white/80">{l.timestamp}</div>
                    <div className="text-xs text-white/40">{l.ngo}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg ${l.status === "missing" ? "text-red-300" : ""}`}>
                    {l.status === "verified" ? money(l.amount) : "NO PROOF"}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30">{l.status}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <div className="text-sm text-white/50">
              Verified total → <span className="text-white">{money(verifiedTotal)}</span>
            </div>
            <a
              href="/brand/demo-brand"
              className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white"
            >
              Open full proof page <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Givn — Proof is the product
      </footer>
    </div>
  );
}
