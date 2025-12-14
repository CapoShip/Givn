export type ProofStatus = "verified" | "missing" | "pending";

export type PublicBrandResponse = {
  brand: { slug: string; name: string };
  badge: {
    period: string; // YYYY-MM
    status: ProofStatus;
    verifiedTotal: number;
    expiresAt: string;
  };
  ledger: Array<{
    id: string;
    timestamp: string;
    amount: number;
    ngo: string;
    status: ProofStatus;
  }>;
  timeline: Array<{
    period: string; // YYYY-MM
    status: ProofStatus;
    verifiedAmount: number;
  }>;
};

export async function fetchPublicBrand(slug: string): Promise<PublicBrandResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/public/brand/${slug}`, {
    // IMPORTANT: brand pages should be cacheable later; for now no-store during dev.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load public brand: ${slug}`);
  }

  return res.json();
}
