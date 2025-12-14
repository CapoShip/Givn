import ProofStatusPill from "@/components/givn/ProofStatusPill";
import type { PublicBrandResponse } from "@/lib/givn/publicBrand";

async function getDemo(): Promise<PublicBrandResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/public/brand/demo-brand`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load demo brand");
  return res.json();
}

function money(n: number) {
  if (n <= 0) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

export default async function DashboardPage() {
  const data = await getDemo();

  return (
    <section className="max-w-5xl">
      <div className="text-xs tracking-widest text-white/40">DASHBOARD</div>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">Verification status</h1>
      <p className="mt-4 text-white/60">
        This console will manage uploads and verification. For now: demo data wired to public endpoint.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">CURRENT PERIOD</div>
          <div className="mt-4 text-2xl font-bold">{data.badge.period}</div>
          <div className="mt-4">
            <ProofStatusPill status={data.badge.status} />
          </div>
        </div>

        <div className="border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">VERIFIED TOTAL</div>
          <div className="mt-4 text-2xl font-bold">{money(data.badge.verifiedTotal)}</div>
          <div className="mt-3 text-sm text-white/60">Publicly visible.</div>
        </div>

        <div className="border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">EXPIRY</div>
          <div className="mt-4 text-2xl font-bold">
            {new Date(data.badge.expiresAt).toISOString().slice(0, 10)}
          </div>
          <div className="mt-3 text-sm text-white/60">Badge degrades if proof is missing.</div>
        </div>
      </div>

      <div className="mt-10 border border-white/10 p-6">
        <div className="text-xs tracking-widest text-white/40">NEXT ACTIONS</div>
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          <li>• Upload proof (receipts, statements)</li>
          <li>• Submit for verification</li>
          <li>• Publish updated badge state</li>
        </ul>

        <div className="mt-6 flex gap-3">
          <a
            href="/proofs"
            className="inline-flex items-center justify-center border border-white/20 px-4 py-3 text-xs text-white/70 hover:bg-white/10"
          >
            Go to Proofs
          </a>
          <a
            href="/brand/demo-brand"
            className="inline-flex items-center justify-center bg-white text-black px-4 py-3 text-xs font-semibold hover:opacity-90"
          >
            View public proof page
          </a>
        </div>
      </div>
    </section>
  );
}
