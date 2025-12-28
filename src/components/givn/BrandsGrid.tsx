"use client";

import { useState } from "react";
import type { BrandTrustRow } from "@/lib/types/givn";
import { BrandCard } from "./BrandCard";
import BrandDetailModal from "./BrandDetailModal";

// On renomme le composant existant ou on l'écrase
export default function BrandsGrid({ brands }: { brands: BrandTrustRow[] }) {
  const [selectedBrand, setSelectedBrand] = useState<BrandTrustRow | null>(null);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {brands.map((b) => (
          <BrandCard 
            key={b.id} 
            brand={b} 
            onClick={() => setSelectedBrand(b)} // ✅ C'est ici que la magie opère
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