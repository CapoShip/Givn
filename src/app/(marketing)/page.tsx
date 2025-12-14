import Link from "next/link";
import { BadgeCheck, ShieldCheck, ArrowRight, Search } from "lucide-react";

type ProofStatus = "verified" | "missing";

type BrandCard = {
  id: string;
  slug: string;
  name: string;
  category: string;
  claim: string;
  verifiedThisMonth: number;
  lastProof: string;
  status: ProofStatus;
};

function money(n: number) {
  if (!n || n <= 0) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

const BRANDS: BrandCard[] = [
  {
    id: "b1",
    slug: "lumen-goods",
    name: "Lumen Goods",
    category: "E-commerce",
    claim: "1% of revenue donated",
    verifiedThisMonth: 1250,
    lastProof: "2025-12-08T09:11Z",
    status: "verified",
  },
  {
    id: "b2",
    slug: "vantawear",
    name: "VantaWear",
    category: "Fashion",
    claim: "A portion donated",
    verifiedThisMonth: 620,
    lastProof: "2025-12-05T14:22Z",
    status: "verified",
  },
  {
    id: "b3",
    slug: "nori-market",
    name: "Nori Market",
    category: "Food",
    claim: "We give back monthly",
    verifiedThisMonth: 0,
    lastProof: "2025-11-01T—",
    status: "missing",
  },
  {
    id: "b4",
    slug: "pulse-bloom",
    name: "Pulse Bloom",
    category: "Health",
    claim: "$1 per order donated",
    verifiedThisMonth: 310,
    lastProof: "2025-12-10T08:03Z",
    status: "verified",
  },
  {
    id: "b5",
    slug: "cedar-kids",
    name: "Cedar Kids",
    category: "Education",
    claim: "Supplies funded",
    verifiedThisMonth: 980,
    lastProof: "2025-12-09T16:40Z",
    status: "verified",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
          <div className="text-sm font-semibold text-white/85">Givn</div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-white/60">
            <a href="#database" className="hover:text-white">Database</a>
            <a href="#categories" className="hover:text-white">Categories</a>
            <a href="/request-access" className="hover:text-white">Request access</a>
          </nav>

          <Link
            href="/request-access"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white text-black px-3 py-2 text-xs font-semibold hover:opacity-90"
          >
            Request access <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            They say they donate.
            <span className="block text-white/50">Givn shows the proof.</span>
          </h1>

          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            A public database of verifiable donation records.
          </p>

          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-2 w-full max-w-[640px] rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <Search className="h-4 w-4 text-white/50" />
              <input
                placeholder="Search brands, categories, claims..."
                className="w-full bg-transparent outline-none text-sm text-white/80 placeholder:text-white/35"
              />
            </div>
          </div>
        </div>

        <section id="database" className="mt-12">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white/85">Recently verified</div>
            <span className="text-xs text-white/45">{BRANDS.length} brands</span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BRANDS.map((b) => (
              <div key={b.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white/90">{b.name}</div>
                    <div className="mt-1 text-[11px] text-white/50">{b.category}</div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] tracking-widest ${
                      b.status === "verified"
                        ? "border-white/15 text-white/70"
                        : "border-red-500/30 text-red-200"
                    }`}
                  >
                    {b.status === "verified" ? (
                      <>
                        <BadgeCheck className="h-3.5 w-3.5" /> VERIFIED
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-3.5 w-3.5" /> MISSING
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <div className="text-white/40">THIS MONTH</div>
                    <div className="mt-1 text-white">{money(b.verifiedThisMonth)}</div>
                  </div>
                  <div>
                    <div className="text-white/40">STATUS</div>
                    <div className="mt-1 text-white">{b.status}</div>
                  </div>
                  <div>
                    <div className="text-white/40">LAST PROOF</div>
                    <div className="mt-1 text-white">{b.lastProof.replace("T", " ")}</div>
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-white/55">Claim: {b.claim}</div>

                <div className="mt-4">
                  <Link
                    href={`/brand/${b.slug}`}
                    className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition"
                  >
                    View proof page <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-8 text-xs text-white/40 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Givn</div>
          <div>Proof is the product</div>
        </div>
      </footer>
    </div>
  );
}
