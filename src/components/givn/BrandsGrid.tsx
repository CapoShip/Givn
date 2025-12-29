"use client";

import { useState } from "react";
import type { BrandTrustRow } from "@/lib/types/givn";
import { BrandCard } from "./BrandCard";
import BrandDetailModal from "./BrandDetailModal";

export default function BrandsGrid({ brands }: { brands: BrandTrustRow[] }) {
  const [selectedBrand, setSelectedBrand] = useState<BrandTrustRow | null>(null);

  return (
    <>
      {/* GRILLE RESPONSIVE :
          - Mobile : 2 par ligne
          - Tablette : 3 par ligne
          - Ordi (lg) : 4 par ligne
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {brands.map((b) => (
          <BrandCard 
            key={b.id} 
            brand={{
              id: b.id,
              name: b.name,
              logo_url: b.logo_url,
              category: b.category || "General",
              trust_score: b.trust_score || 0,
              status: b.latest_status === "verified" ? "VERIFIED" : "PENDING",
              claim: b.claim,
              proof_count: b.proof_count || 0
            }} 
            onClick={() => setSelectedBrand(b)} 
          />
        ))}
      </div>

      {/* ✅ CORRECTION : On a retiré onOpenProof car inutile maintenant */}
      <BrandDetailModal 
        brand={selectedBrand} 
        onClose={() => setSelectedBrand(null)}
      />
    </>
  );
}