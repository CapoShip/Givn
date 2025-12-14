// src/app/(marketing)/brand/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, ExternalLink, FileText } from "lucide-react";
import { getBrand, money, fmtStamp, sumVerified, lastVerified } from "@/lib/givn-data";

export default function BrandPage({ params }: { params: { slug: string } }) {
  const brand = getBrand(params.slug);
  if (!brand) return notFound();

  const verifiedTotal = sumVerified(brand.ledger);
  const lastV = lastVerified(brand.ledger);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <header className="border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <Link
            href="/request-access"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white text-black px-3 py-2 text-xs font-semibold hover:opacity-90 transition"
          >
            Request access
          </Link>
        </div>
      </header>

      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-[1100px]">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-white/70 text-sm">
              <BadgeCheck className="h-4 w-4" />
              <span className="font-semibold">Brand dashboard</span>
            </div>

            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
              {brand.name}
            </h1>
            <p className="mt-2 text-white/60">
              Category: {brand.category} • Status:{" "}
              <span className={brand.proofStatus === "verified" ? "text-white" : "text-red-300"}>
                {brand.proofStatus}
              </span>
            </p>

            <p className="mt-4 text-white/70">
              Claim: <span className="text-white">{brand.claim}</span>
            </p>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 w-full md:w-[360px]">
            <div className="text-xs text-white/60">Verified totals</div>
            <div className="mt-2 text-3xl font-semibold">{money(verifiedTotal)}</div>
            <div className="mt-2 text-xs text-white/45">
              Last verified proof: {lastV ? fmtStamp(lastV) : "—"}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <div className="text-[11px] text-white/45">This month</div>
                <div className="mt-1">{money(brand.verifiedThisMonth)}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <div className="text-[11px] text-white/45">All time</div>
                <div className="mt-1">{money(brand.verifiedAllTime)}</div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <Link
                href={`/badge/${brand.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
              >
                View public badge <ExternalLink className="h-4 w-4" />
              </Link>

              <Link
                href="/request-access"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition"
              >
                Upload proof (demo) <FileText className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Ledger */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-white/85">Proof ledger</div>
              <div className="mt-1 text-xs text-white/45">
                Every entry is either verified or publicly missing.
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-white/45">
                  <th className="text-left font-medium py-2">Timestamp</th>
                  <th className="text-left font-medium py-2">NGO</th>
                  <th className="text-right font-medium py-2">Amount</th>
                  <th className="text-right font-medium py-2">Status</th>
                  <th className="text-right font-medium py-2">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {brand.ledger.map((l) => (
                  <tr key={l.id} className="border-t border-white/10">
                    <td className="py-3 text-white/75">{fmtStamp(l.timestamp)}</td>
                    <td className="py-3 text-white/65">{l.ngo}</td>
                    <td className="py-3 text-right">{l.status === "verified" ? money(l.amount) : "—"}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] ${
                          l.status === "verified"
                            ? "border-white/15 text-white/70"
                            : "border-red-500/30 text-red-200"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {l.receiptUrl && l.status === "verified" ? (
                        <a
                          href={l.receiptUrl}
                          className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white"
                        >
                          View <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-xs text-white/30">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-xs text-white/40">
            Total verified from ledger: <span className="text-white/75">{money(verifiedTotal)}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
