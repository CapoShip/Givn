"use client";

import { useState } from "react";
import type { BrandTrustRow } from "@/lib/types/givn";
import { BrandCard } from "./BrandCard";
import BrandDetailModal from "./BrandDetailModal";

export default function BrandsGrid({ brands }: { brands: BrandTrustRow[] }) {
  const [selectedBrand, setSelectedBrand] = useState<BrandTrustRow | null>(null);

  return (
    <>
      {/* CORRECTION DE LA GRILLE :
        - 'grid-cols-2' : 2 cartes par ligne sur mobile/tablette (pour éviter la file indienne)
        - 'lg:grid-cols-4' : 4 cartes par ligne sur ordinateur (votre demande)
        - 'gap-4' : Espace réduit entre les carrés
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