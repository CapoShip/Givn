export type BrandStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | string;

export type BrandTrustRow = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  status: string;          // "PENDING" etc.
  last_proof_at: string | null; // "YYYY-MM-DD" from view
  proof_count: number;
  trust_score: number;
};

