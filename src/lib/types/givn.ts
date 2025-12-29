// src/lib/types/givn.ts

export type BrandTrustRow = {
  id: string; // ou brand_id selon la vue
  slug: string;
  name: string;
  website: string | null;
  logo_url: string | null;
  category: string | null;
  claim: string | null;
  description: string | null;
  proof_count: number;
  total_donated: number; // Postgres renvoie souvent string ou number selon le driver
  last_proof_at: string | Date | null;
  trust_score: number;
  latest_status: 'draft' | 'submitted' | 'under_review' | 'verified' | 'rejected' | null;
};

export type GlobalActivityEvent = {
  id: string;
  type: 'proof_verified' | 'brand_joined'; // Extensible
  brandName: string;
  brandSlug: string;
  brandLogo: string | null;
  amount?: number;
  currency?: string;
  occurredAt: string; // ISO String
};