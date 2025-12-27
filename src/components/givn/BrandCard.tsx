import type { BrandTrustRow } from "@/lib/types/givn";
import { NoProofBadge } from "./NoProofBadge";

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

type BrandCardProps = {
  brand: BrandTrustRow;
  onClick?: (brand: BrandTrustRow) => void;
};

export function BrandCard({ brand, onClick }: BrandCardProps) {
  // ✅ Normalize status coming from DB
  // DB allowed: PENDING | APPROVED | REJECTED
  const isApproved = brand.status === "APPROVED";
  const displayStatus = isApproved ? "VERIFIED" : brand.status;

  // ✅ Risk heuristic: not approved OR no proof OR low trust => risk
  const risk = !isApproved || brand.proof_count === 0 || brand.trust_score < 25;

  const clickable = typeof onClick === "function";

  return (
    <article
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : -1}
      onClick={clickable ? () => onClick(brand) : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(brand);
              }
            }
          : undefined
      }
      className={[
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5",
        "p-5 backdrop-blur-xl transition",
        "hover:bg-white/7 hover:border-white/15",
        risk
          ? "shadow-[0_0_60px_rgba(239,68,68,0.08)]"
          : "shadow-[0_0_60px_rgba(34,211,238,0.06)]",
        clickable
          ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400/30 hover:-translate-y-[1px]"
          : "",
      ].join(" ")}
    >
      {/* top glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.25em] text-white/50">
            {displayStatus}
          </div>

          <h3 className="mt-1 truncate text-lg font-semibold text-white">
            {brand.name}
          </h3>

          <div className="mt-2 flex items-center gap-3">
            <NoProofBadge brand={brand} />
            <div className="text-xs text-white/50">
              Last proof:{" "}
              <span className="text-white/70">
                {formatDate(brand.last_proof_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Score block */}
        <div className="text-right">
          <div className="text-xs uppercase tracking-[0.25em] text-white/50">
            Trust
          </div>
          <div className="mt-1 flex items-baseline justify-end gap-2">
            <div
              className={[
                "text-3xl font-bold",
                brand.trust_score === 0 ? "text-red-300" : "text-white",
              ].join(" ")}
            >
              {brand.trust_score}
            </div>
            <div className="text-sm text-white/50">/100</div>
          </div>
        </div>
      </div>

      {/* website */}
      <div className="mt-4 text-sm text-white/70">
        {brand.website ? (
          <a
            href={brand.website}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-200 hover:text-cyan-100"
            onClick={(e) => e.stopPropagation()}
          >
            Verify site →
          </a>
        ) : (
          <span className="text-white/40">No website</span>
        )}
      </div>

      {/* bottom hint */}
      {brand.proof_count === 0 && (
        <div className="mt-4 rounded-xl border border-red-400/15 bg-red-500/10 p-3 text-xs text-red-200">
          Silence is a signal. This brand has no public proof.
        </div>
      )}
    </article>
  );
}
