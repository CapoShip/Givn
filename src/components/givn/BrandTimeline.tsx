import type { PublicBrandResponse } from "@/lib/givn/publicBrand";
import ProofStatusPill from "@/components/givn/ProofStatusPill";

function money(n: number) {
  if (n <= 0) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

export default function BrandTimeline({ data }: { data: PublicBrandResponse }) {
  return (
    <div className="border border-white/10 p-6">
      <div className="text-xs tracking-widest text-white/40">PROOF TIMELINE</div>
      <div className="mt-3 text-lg text-white/60">
        Month-by-month verification. Missing proof is shown explicitly.
      </div>

      <div className="mt-8 space-y-4">
        {data.timeline.map((t) => (
          <div key={t.period} className="flex items-center justify-between border border-white/10 px-4 py-4">
            <div className="text-sm text-white/80">{t.period}</div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-white/70">{money(t.verifiedAmount)}</div>
              <ProofStatusPill status={t.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
