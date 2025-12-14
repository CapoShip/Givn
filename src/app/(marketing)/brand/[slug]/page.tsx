import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, ShieldCheck } from "lucide-react";

type ProofStatus = "verified" | "missing";

type Brand = {
  slug: string;
  name: string;
  category: string;
  claim: string;
  verifiedThisMonth: number;
  verifiedAllTime: number;
  lastProof: string;
  status: ProofStatus;
  ledger: Array<{
    id: string;
    timestamp: string;
    ngo: string;
    amount: number;
    status: ProofStatus;
    note?: string;
  }>;
};

function money(n: number) {
  if (!n || n <= 0) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

// Demo data: tu remplaceras plus tard par DB/API
const BRANDS: Brand[] = [
  {
    slug: "lumen-goods",
    name: "Lumen Goods",
    category: "E-commerce",
    claim: "1% of revenue donated",
    verifiedThisMonth: 1250,
    verifiedAllTime: 8420,
    lastProof: "2025-12-08T09:11Z",
    status: "verified",
    ledger: [
      { id: "l1", timestamp: "2025-12-12T10:43Z", ngo: "Water.org", amount: 500, status: "verified" },
      { id: "l2", timestamp: "2025-11-03T09:01Z", ngo: "Water.org", amount: 420, status: "verified" },
      { id: "l3", timestamp: "2025-10-18T—", ngo: "—", amount: 0, status: "missing", note: "No verifiable record found." },
    ],
  },
  {
    slug: "vantawear",
    name: "VantaWear",
    category: "Fashion",
    claim: "A portion donated",
    verifiedThisMonth: 620,
    verifiedAllTime: 3190,
    lastProof: "2025-12-05T14:22Z",
    status: "verified",
    ledger: [
      { id: "v1", timestamp: "2025-12-05T14:22Z", ngo: "Red Cross", amount: 250, status: "verified" },
      { id: "v2", timestamp: "2025-11-16T—", ngo: "—", amount: 0, status: "missing", note: "Claim present but no proof uploaded." },
    ],
  },
  {
    slug: "nori-market",
    name: "Nori Market",
    category: "Food",
    claim: "We give back monthly",
    verifiedThisMonth: 0,
    verifiedAllTime: 0,
    lastProof: "2025-11-01T—",
    status: "missing",
    ledger: [
      { id: "n1", timestamp: "2025-11-01T—", ngo: "—", amount: 0, status: "missing", note: "Missing proof for the current period." },
    ],
  },
];

export default function BrandDashboardPage({ params }: { params: { slug: string } }) {
  const brand = BRANDS.find((b) => b.slug === params.slug);
  if (!brand) return notFound();

  const statusPill =
    brand.status === "verified"
      ? "border-white/15 text-white/70"
      : "border-red-500/30 text-red-200";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${statusPill}`}>
            {brand.status === "verified" ? (
              <>
                <BadgeCheck className="h-4 w-4" /> verified
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" /> missing
              </>
            )}
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs text-white/50">{brand.category}</div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{brand.name}</h1>
            <p className="mt-3 text-white/60">Claim: {brand.claim}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="text-xs text-white/40">THIS MONTH</div>
                <div className="mt-1 text-xl">{money(brand.verifiedThisMonth)}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="text-xs text-white/40">ALL TIME</div>
                <div className="mt-1 text-xl">{money(brand.verifiedAllTime)}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="text-xs text-white/40">LAST PROOF</div>
                <div className="mt-1 text-sm text-white/80">{brand.lastProof.replace("T", " ")}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold text-white/85">Verified badge</div>
            <p className="mt-3 text-sm text-white/60">
              This badge reflects current verification for the active period. It updates when new proof is recorded.
            </p>

            <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="text-xs text-white/40">STATUS</div>
              <div className="mt-1 text-lg">
                {brand.status === "verified" ? "Verified impact" : "Missing proof"}
              </div>
              <div className="mt-2 text-xs text-white/40">
                Givn does not certify intent. Only verifiable records.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white/85">Public donation ledger</div>
            <div className="text-xs text-white/45">Time-stamped records</div>
          </div>

          <div className="mt-5 space-y-3">
            {brand.ledger.map((l) => (
              <div
                key={l.id}
                className={`flex items-center justify-between rounded-xl border p-4 ${
                  l.status === "verified"
                    ? "border-white/10 bg-black/40"
                    : "border-red-500/25 bg-red-500/5"
                }`}
              >
                <div>
                  <div className="text-sm text-white/80">{l.timestamp}</div>
                  <div className="text-xs text-white/40">{l.ngo}</div>
                  {l.note ? <div className="mt-1 text-xs text-white/45">{l.note}</div> : null}
                </div>

                <div className="text-right">
                  <div className={l.status === "verified" ? "text-white" : "text-red-200"}>
                    {l.status === "verified" ? money(l.amount) : "NO VERIFIED DONATION"}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30">{l.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-xs text-white/35">© {new Date().getFullYear()} Givn</div>
      </div>
    </div>
  );
}
