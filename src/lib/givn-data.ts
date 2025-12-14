// src/lib/givn-data.ts

export type ProofStatus = "verified" | "missing";

export type Category =
  | "E-commerce"
  | "SaaS"
  | "Consumer"
  | "Fashion"
  | "Beauty"
  | "Food"
  | "Health"
  | "Education"
  | "Marketplace"
  | "Other";

export type ProofEntry = {
  id: string;
  timestamp: string; // ISO-ish
  amount: number; // dollars
  ngo: string;
  status: ProofStatus;
  receiptUrl?: string;
};

export type Brand = {
  slug: string;
  name: string;
  category: Category;
  claim: string;
  proofStatus: ProofStatus;
  verifiedThisMonth: number;
  verifiedAllTime: number;
  lastProof: string;
  ledger: ProofEntry[];
};

export function money(n: number) {
  if (!n || n <= 0) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

export function fmtStamp(s: string) {
  return s.replace("T", " ");
}

export function cx(...v: Array<string | false | undefined | null>) {
  return v.filter(Boolean).join(" ");
}

export function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function matches(q: string, hay: string) {
  const a = q.trim().toLowerCase();
  if (!a) return true;
  return hay.toLowerCase().includes(a);
}

export function sumVerified(ledger: ProofEntry[]) {
  return ledger
    .filter((l) => l.status === "verified")
    .reduce((s, l) => s + l.amount, 0);
}

export function lastVerified(ledger: ProofEntry[]) {
  const v = ledger.find((l) => l.status === "verified");
  return v ? v.timestamp : null;
}

// Fake dataset (tu remplaceras par Prisma plus tard)
export const BRANDS: Brand[] = [
  {
    slug: "lumen-goods",
    name: "Lumen Goods",
    category: "E-commerce",
    claim: "1% of revenue donated",
    proofStatus: "verified",
    verifiedThisMonth: 1250,
    verifiedAllTime: 8420,
    lastProof: "2025-12-08T09:11Z",
    ledger: [
      { id: "l4", timestamp: "2025-12-08T09:11Z", amount: 620, ngo: "Water.org", status: "verified", receiptUrl: "#" },
      { id: "l3", timestamp: "2025-12-01T08:40Z", amount: 630, ngo: "Water.org", status: "verified", receiptUrl: "#" },
      { id: "l2", timestamp: "2025-11-02T—", amount: 0, ngo: "—", status: "missing" },
      { id: "l1", timestamp: "2025-10-03T10:22Z", amount: 540, ngo: "Water.org", status: "verified", receiptUrl: "#" },
    ],
  },
  {
    slug: "vantawear",
    name: "VantaWear",
    category: "Fashion",
    claim: "A portion donated",
    proofStatus: "verified",
    verifiedThisMonth: 620,
    verifiedAllTime: 3190,
    lastProof: "2025-12-05T14:22Z",
    ledger: [
      { id: "v3", timestamp: "2025-12-05T14:22Z", amount: 620, ngo: "Dress for Success", status: "verified", receiptUrl: "#" },
      { id: "v2", timestamp: "2025-11-05T—", amount: 0, ngo: "—", status: "missing" },
      { id: "v1", timestamp: "2025-10-05T09:10Z", amount: 500, ngo: "Dress for Success", status: "verified", receiptUrl: "#" },
    ],
  },
  {
    slug: "nori-market",
    name: "Nori Market",
    category: "Food",
    claim: "We give back monthly",
    proofStatus: "missing",
    verifiedThisMonth: 0,
    verifiedAllTime: 0,
    lastProof: "2025-11-01T—",
    ledger: [
      { id: "n2", timestamp: "2025-11-01T—", amount: 0, ngo: "—", status: "missing" },
      { id: "n1", timestamp: "2025-10-01T—", amount: 0, ngo: "—", status: "missing" },
    ],
  },
  {
    slug: "pulse-bloom",
    name: "Pulse Bloom",
    category: "Health",
    claim: "$1 per order donated",
    proofStatus: "verified",
    verifiedThisMonth: 310,
    verifiedAllTime: 1440,
    lastProof: "2025-12-10T08:03Z",
    ledger: [
      { id: "p2", timestamp: "2025-12-10T08:03Z", amount: 310, ngo: "Red Cross", status: "verified", receiptUrl: "#" },
      { id: "p1", timestamp: "2025-11-10T08:01Z", amount: 280, ngo: "Red Cross", status: "verified", receiptUrl: "#" },
    ],
  },
  {
    slug: "cedar-kids",
    name: "Cedar Kids",
    category: "Education",
    claim: "Supplies funded",
    proofStatus: "verified",
    verifiedThisMonth: 980,
    verifiedAllTime: 6110,
    lastProof: "2025-12-09T16:40Z",
    ledger: [
      { id: "c2", timestamp: "2025-12-09T16:40Z", amount: 980, ngo: "DonorsChoose", status: "verified", receiptUrl: "#" },
      { id: "c1", timestamp: "2025-11-09T12:10Z", amount: 900, ngo: "DonorsChoose", status: "verified", receiptUrl: "#" },
    ],
  },
  {
    slug: "echo-cart",
    name: "Echo Cart",
    category: "Marketplace",
    claim: "Carbon removal funded",
    proofStatus: "verified",
    verifiedThisMonth: 210,
    verifiedAllTime: 980,
    lastProof: "2025-12-07T11:02Z",
    ledger: [
      { id: "e2", timestamp: "2025-12-07T11:02Z", amount: 210, ngo: "Stripe Climate", status: "verified", receiptUrl: "#" },
      { id: "e1", timestamp: "2025-11-07T10:50Z", amount: 190, ngo: "Stripe Climate", status: "verified", receiptUrl: "#" },
    ],
  },
];

export function getBrand(slug: string) {
  return BRANDS.find((b) => b.slug === slug) || null;
}
