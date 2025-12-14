import type { ProofStatus } from "@/lib/givn/publicBrand";

export default function ProofStatusPill({ status }: { status: ProofStatus }) {
  const cls =
    status === "verified"
      ? "border-white/20 text-white/80"
      : status === "pending"
      ? "border-white/20 text-white/60"
      : "border-red-500/30 text-red-300";

  const label =
    status === "verified" ? "VERIFIED" : status === "pending" ? "PENDING REVIEW" : "NO VERIFIED DONATION";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] tracking-widest border ${cls}`}>
      {label}
    </span>
  );
}
