// src/lib/types/givn.ts

export type ProofStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected";

export type BrandTrustRow = {
  id: string; // = brand_id de la view
  slug: string;
  name: string;
  website: string | null;
  logo_url: string | null;

  trust_score: number | null;
  proof_count: number | null;
  last_proof_at: string | null;

  // vient de la view: latest_status (enum proof_status)
  latest_status: ProofStatus | null;
};
