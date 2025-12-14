import BrandBadge from "@/components/givn/BrandBadge";
import BrandLedger from "@/components/givn/BrandLedger";
import BrandTimeline from "@/components/givn/BrandTimeline";
import type { PublicBrandResponse } from "@/lib/givn/publicBrand";

async function getData(slug: string): Promise<PublicBrandResponse> {
  // IMPORTANT: use relative fetch (works on Vercel + local)
  const res = await fetch(`/api/public/brand/${slug}`, { cache: "no-store" });

  if (!res.ok) {
    // make the error explicit in server logs
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to load brand (${res.status}). ${text}`);
  }

  return res.json();
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getData(slug);

  return (
    <main className="min-h-screen bg-black text-white font-mono pt-20">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs tracking-widest text-white/40">PUBLIC PROOF PAGE</div>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">{data.brand.name}</h1>
            <p className="mt-4 text-white/60 max-w-2xl">
              Givn displays verifiable donation records. If proof is missing, it is shown explicitly.
            </p>
          </div>

          <a
            href="/request-access"
            className="inline-flex items-center border border-white/20 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
          >
            Request access
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8">
          <BrandBadge data={data} />
          <BrandTimeline data={data} />
          <BrandLedger data={data} />
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-xs text-white/40">
          Givn is a third-party verification layer. Not an NGO. Not a donation platform.
        </div>
      </section>
    </main>
  );
}
