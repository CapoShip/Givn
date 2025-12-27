"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function getBrands() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("brand_trust_live")
    .select(`
      brand_id,
      name,
      slug,
      website,
      logo_url,
      trust_score,
      proofs_count,
      total_usd,
      latest_status
    `)
    .order("trust_score", { ascending: false });

  if (error) {
    console.error("[getBrands]", error);
    return [];
  }

  return data ?? [];
}
