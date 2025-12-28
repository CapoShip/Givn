"use client";

import { useState } from "react";
import type { BrandTrustRow } from "@/lib/types/givn";
import { BrandCard } from "./BrandCard";
import BrandDetailModal from "./BrandDetailModal";

export default function BrandsGrid({ brands }: { brands: BrandTrustRow[] }) {
  const [selectedBrand, setSelectedBrand] = useState<BrandTrustRow | null>(null);

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {brands.map((b) => (
          <BrandCard 
            key={b.id} 
            // 🛡️ MAPPING DE SÉCURITÉ
            brand={{
              id: b.id,
              name: b.name,
              logo_url: b.logo_url,
              
              // 1. Si category est null, on met "General"
              category: b.category || "General",
              
              // 2. Si trust_score est null, on met 0
              trust_score: b.trust_score || 0,
              
              // 3. On traduit le status SQL (verified/draft) en status UI (VERIFIED/PENDING)
              status: b.latest_status === "verified" ? "VERIFIED" : "PENDING",

              // ✅ 4. CHAMPS SUPPLÉMENTAIRES POUR LA CARTE 3D
              claim: b.claim,
              proof_count: b.proof_count || 0
            }} 
            onClick={() => setSelectedBrand(b)} 
          />
        ))}
      </div>

      {/* Le Modal s'affiche si une marque est sélectionnée */}
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