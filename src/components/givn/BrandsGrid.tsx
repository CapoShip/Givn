"use client";

import { useState } from "react";
import type { BrandTrustRow } from "@/lib/types/givn";
import { BrandCard } from "./BrandCard";
import BrandDetailModal from "./BrandDetailModal";

export default function BrandsGrid({ brands }: { brands: BrandTrustRow[] }) {
  const [selectedBrand, setSelectedBrand] = useState<BrandTrustRow | null>(null);

  return (
    <>
      {/* CHANGEMENTS GRILLE :
         - gap-4 (plus serré)
         - sm:grid-cols-2 (2 par ligne sur mobile large/tablette)
         - lg:grid-cols-3 (3 par ligne sur laptop)
         - xl:grid-cols-4 (4 par ligne sur grand écran)
      */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      {selectedBrand && (
        <BrandDetailModal 
          brand={selectedBrand} 
          onClose={() => setSelectedBrand(null)}
          onOpenProof={() => console.log("Open proof for", selectedBrand.id)}
        />
      )}
    </>
  );
}