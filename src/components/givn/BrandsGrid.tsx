import type { BrandTrustRow } from "@/lib/types/givn";
import { BrandCard } from "./BrandCard";

export function BrandsGrid({ brands }: { brands: BrandTrustRow[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {brands.map((b) => (
        <BrandCard key={b.id} brand={b} />
      ))}
    </div>
  );
}
