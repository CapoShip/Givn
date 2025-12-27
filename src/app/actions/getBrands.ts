"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function getBrands() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("brands")
    .select("id, slug, name, website, logo_url, status, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`[getBrands] ${error.message}`);
  return data ?? [];
}
