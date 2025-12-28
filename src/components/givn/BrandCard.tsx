"use client";

import React from "react";
import Badge from "@/components/givn/Badge";

// IMPORTANT: ce type vient de src/lib/types/givn.ts
import type { BrandTrustRow } from "@/lib/types/givn";

type Props = {
  brand: any; // ton Home cast déjà en any, on reste compatible
  onClick?: () => void;
};

function normalizeUiStatusFromLatest(latest: BrandTrustRow["latest_status"]): "VERIFIED" | "PENDING" | "REJECTED" {
  if (latest === "verified") return "VERIFIED";
  if (latest === "rejected") return "REJECTED";
  // draft / submitted / under_review / null => pending côté UI
  return "PENDING";
}

export function BrandCard({ brand, onClick }: Props) {
  // On accepte que `brand` vienne soit du mapping UI, soit direct DB.
  // Priorité:
  // 1) brand.status déjà "VERIFIED/PENDING/REJECTED" (si tu as mappé)
  // 2) brand.latest_status (si tu passes BrandTrustRow brut)
  const uiStatus: "VERIFIED" | "PENDING" | "REJECTED" =
    brand?.status === "VERIFIED" || brand?.status === "PENDING" || brand?.status === "REJECTED"
      ? brand.status
      : normalizeUiStatusFromLatest(brand?.latest_status ?? null);

  const trustScore = Number(brand?.trust_score ?? 0);
  const proofCount = Number(brand?.proof_count ?? 0);

  // Heuristique “risk” simple: pas verified OU trust faible OU aucun proof
  const isRisk = uiStatus !== "VERIFIED" || proofCount <= 0 || trustScore < 60;

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl border border-white/10 bg-[#0A0A0A] p-5 shadow-2xl transition-all hover:border-emerald-500/30 hover:bg-white/[0.02] cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {brand?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logo_url}
              alt={brand?.name ?? "Brand"}
              className="h-10 w-10 rounded-xl object-cover border border-white/10"
            />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10" />
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-white truncate">{brand?.name ?? "Unknown"}</p>
              <span className="shrink-0">
                <Badge status={uiStatus} />
              </span>
            </div>

            <p className="text-xs text-zinc-500 truncate">
              {brand?.category ?? "Public Database"}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs text-zinc-500">Trust</p>
          <p className="font-mono text-sm text-white">{Math.round(trustScore)}/100</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-400 line-clamp-2">
          {brand?.claim ?? "No claim available."}
        </p>

        <div
          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
            isRisk
              ? "bg-red-500/10 border-red-500/30 text-red-300"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          }`}
        >
          {isRisk ? "Risk" : "Low risk"}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span>Proofs: {proofCount}</span>
        <span>
          {brand?.last_proof_at ? `Last: ${new Date(brand.last_proof_at).toLocaleDateString()}` : "No proofs yet"}
        </span>
      </div>
    </div>
  );
}

export default BrandCard;
