export type BrandTrustRow = {
  brand_id: string;
  slug: string;
  name: string;
  website: string | null;
  logo_url: string | null;
  category: string | null;

  proofs_total: number;
  verified_count: number;
  rejected_count: number;
  disputed_count: number;

  last_event_type: string | null;
  last_event_at: string | null;

  trust_score: number;
};
