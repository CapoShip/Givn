"use client";

import { useState } from "react";
import { BadgeCheck, Zap } from "lucide-react";
import type { PublicBrandResponse } from "@/lib/givn/publicBrand";
import ProofStatusPill from "@/components/givn/ProofStatusPill";

function money(n: number) {
  if (n <= 0) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

export default function BrandBadge({ data }: { data: PublicBrandResponse }) {
  const [open, setOpen] = useState(false);

  const isStale = data.badge.status !== "verified";
  const border = isStale ? "border-red-500/50 bg-red-500/5" : "border-white/20";
  const subtle = isStale ? "text-red-300" : "text-white/60";

  return (
    <div className="border border-white/10 p-6">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`appearance-none bg-transparent w-full text-left border ${border} p-6`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <BadgeCheck className="h-6 w-6 text-white/70" />
            <div>
              <div className="text-xs tracking-widest text-white/50">GIVN BADGE</div>
              <div className="mt-1 text-lg tracking-wide">VERIFIED IMPACT</div>
              <div className={`mt-3 text-sm ${subtle}`}>
                Period: <span className="text-white">{data.badge.period}</span>
              </div>
              <div className={`mt-1 text-sm ${subtle}`}>
                Verified total: <span className="text-white">{money(data.badge.verifiedTotal)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <ProofStatusPill status={data.badge.status} />
            <div className="text-[11px] text-white/40">
              Expires: <span className="text-white/70">{new Date(data.badge.expiresAt).toISOString().slice(0, 10)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 text-xs text-white/40 max-w-2xl">
          This badge is time-bound. It degrades when proof is missing. Click to inspect audit trail.
        </div>
      </button>

      {open && (
        <div className="mt-6 border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">AUDIT TRAIL</div>
          <div className="mt-4 space-y-3">
            {data.ledger.map((l) => (
              <div key={l.id} className="flex items-center justify-between text-sm">
                <div className="text-white/70">{l.timestamp}</div>
                <div className={l.status === "missing" ? "text-red-300" : "text-white"}>
                  {l.status === "verified" ? money(l.amount) : "NO VERIFIED DONATION"}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-xs text-white/70 hover:bg-white/10">
            Install (Shopify)
            <Zap className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );
}
