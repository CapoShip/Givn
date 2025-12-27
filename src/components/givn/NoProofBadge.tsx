import type { BrandTrustRow } from "@/lib/types/givn";

export function NoProofBadge({ brand }: { brand: BrandTrustRow }) {
  if (brand.proof_count === 0) {
    return (
      <div
        className="rounded-full px-3 py-1 text-xs font-semibold tracking-wide
                   bg-red-500/15 text-red-300 ring-1 ring-red-400/30
                   shadow-[0_0_24px_rgba(239,68,68,0.25)]"
        title="No published proof. Negative signal by design."
      >
        NO PROOF
      </div>
    );
  }

  // You can refine tiers later; for now simple “PROVED”
  return (
    <div
      className="rounded-full px-3 py-1 text-xs font-semibold tracking-wide
                 bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/30
                 shadow-[0_0_24px_rgba(34,211,238,0.18)]"
      title="Has public proof."
    >
      PROOFED
    </div>
  );
}
