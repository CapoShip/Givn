"use server";

import { supabaseServer } from "@/lib/supabase/server";
import type { BrandTrustRow } from "@/lib/types";

export async function getBrands(params?: { verifiedOnly?: boolean }) {
  const supabase = await supabaseServer();

  let query = supabase
    .from("brand_trust_live")
    .select(
      `
      brand_id,
      slug,
      name,
      website,
      logo_url,
      category,
      proofs_total,
      verified_count,
      rejected_count,
      disputed_count,
      last_event_type,
      last_event_at,
      trust_score
    `
    )
    .order("trust_score", { ascending: false });

  if (params?.verifiedOnly) {
    query = query.gt("verified_count", 0);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`[getBrands] ${error.message}`);
  }

  return (data ?? []) as BrandTrustRow[];
}
