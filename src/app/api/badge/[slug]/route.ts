import { NextResponse } from "next/server";

type ProofStatus = "verified" | "missing" | "pending";

type ProofEntry = {
  id: string;
  timestamp: string; // ISO string ideally
  amount: number; // cents or dollars — here we assume dollars for demo
  ngo: string;
  status: ProofStatus;
};

type TimelineMonth = {
  period: string; // "2025-12"
  status: ProofStatus;
  verifiedAmount: number;
};

function demoData(slug: string) {
  const ledger: ProofEntry[] = [
    { id: "p4", timestamp: "2024-12-12T10:43:00Z", amount: 500, ngo: "Water.org", status: "verified" },
    { id: "p3", timestamp: "2024-11-03T09:01:00Z", amount: 420, ngo: "Water.org", status: "verified" },
    { id: "p2", timestamp: "2024-10-01T00:00:00Z", amount: 0, ngo: "—", status: "missing" },
    { id: "p1", timestamp: "2024-09-02T08:11:00Z", amount: 380, ngo: "Water.org", status: "verified" },
  ];

  const timeline: TimelineMonth[] = [
    { period: "2024-12", status: "verified", verifiedAmount: 500 },
    { period: "2024-11", status: "verified", verifiedAmount: 420 },
    { period: "2024-10", status: "missing", verifiedAmount: 0 },
    { period: "2024-09", status: "verified", verifiedAmount: 380 },
  ];

  const verifiedTotal = ledger.filter(l => l.status === "verified").reduce((s, l) => s + l.amount, 0);

  const currentPeriod = "2024-12";
  const current = timeline.find(t => t.period === currentPeriod);
  const badgeStatus: ProofStatus = current?.status ?? "missing";

  return {
    brand: {
      slug,
      name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    },
    badge: {
      period: currentPeriod,
      status: badgeStatus,
      verifiedTotal,
      expiresAt: "2025-01-01T00:00:00Z",
    },
    ledger,
    timeline,
  };
}

export async function GET(_: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;

  // TODO (plus tard): remplacer demoData() par tes services:
  // - lire la marque + périodes
  // - proofs vérifiées
  // - calcul statut du mois courant
  // - calcul expiresAt
  const payload = demoData(slug);

  return NextResponse.json(payload, { status: 200 });
}
