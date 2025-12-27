import { Shield, AlertTriangle } from "lucide-react";
import type { Brand } from "@prisma/client";
import { getBrands } from "@/app/actions";
import { ActionsCell } from "./ActionsCell";

export default async function AdminPage() {
  const brands = (await getBrands()) as Brand[];

  const pending = brands.filter(
    (b) => b.credibility_tier === "PENDING"
  );

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-20">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="text-emerald-500" />
            Admin Dashboard
          </h1>
          <span className="text-xs font-mono bg-zinc-900 px-3 py-1 rounded text-zinc-500">
            v0.1.0
          </span>
        </div>

        {/* TABLE */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold">Pending Submissions</h3>

            <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1">
              <AlertTriangle size={12} />
              {pending.length} Actions required
            </span>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-zinc-500 text-xs uppercase">
              <tr>
                <th className="p-4">Brand</th>
                <th className="p-4">Website</th>
                <th className="p-4">Slug</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {pending.map((brand) => (
                <tr key={brand.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold">{brand.name}</td>

                  <td className="p-4 text-zinc-400 font-mono text-xs">
                    {brand.website}
                  </td>

                  <td className="p-4 text-zinc-400 font-mono text-xs">
                    {brand.slug}
                  </td>

                  <td className="p-4 text-right">
                    <ActionsCell brandId={brand.id} />
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
