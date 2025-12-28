import { getBrands } from "@/app/actions/getBrands";
import BrandCard from "./BrandCard";

export default async function BrandsGrid() {
  const brands = await getBrands();

  if (!brands || brands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border border-dashed border-white/10 rounded-3xl bg-white/5">
        <div className="text-6xl animate-pulse">🌱</div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">The Database is Waiting.</h3>
          <p className="text-zinc-400 max-w-md mx-auto">
            Givn is live. Waiting for the first verified proof.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {brands.map((brand) => (
        <BrandCard 
          key={brand.id} 
          brand={{
            ...brand,
            total: brand.total_donated,
            month: 0, 
            lastProof: brand.last_proof_at ? new Date(brand.last_proof_at).toLocaleDateString() : "Never",
            status: (brand.latest_status as any) || "MISSING",
          }} 
        />
      ))}
    </div>
  );
}