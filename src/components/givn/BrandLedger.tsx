import { ShieldCheck, Skull } from "lucide-react";
import type { PublicBrandResponse } from "@/lib/givn/publicBrand";

function money(n: number) {
  if (n <= 0) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

export default function BrandLedger({ data }: { data: PublicBrandResponse }) {
  return (
    <div className="border border-white/10 p-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-xs tracking-widest text-white/40">PUBLIC DONATION LEDGER</div>
          <div className="mt-3 text-lg text-white/60">This is not a claim. This is a record.</div>
        </div>
        <div className="text-sm text-white/50">
          Verified total → <span className="text-white">{money(data.badge.verifiedTotal)}</span>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {data.ledger.map((l) => (
          <div
            key={l.id}
            className={`flex items-center justify-between border-l-2 pl-6 pr-4 py-5 ${
              l.status === "verified"
                ? "border-white/20"
                : l.status === "pending"
                ? "border-white/20 bg-white/5"
                : "border-red-500/50 bg-red-500/5"
            }`}
          >
            <div className="flex items-center gap-4">
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
              <div className={`text-lg ${l.status === "missing" ? "text-red-300" : "text-white"}`}>
                {l.status === "verified" ? money(l.amount) : "NO VERIFIED DONATION"}
              </div>
              <div className="text-[10px] tracking-widest text-white/30 uppercase">{l.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
