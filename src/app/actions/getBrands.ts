'use server';

import { supabaseServer } from "@/lib/supabase/server";
import { BrandTrustRow } from "@/lib/types/givn";

export async function getBrands() {
  const supabase = await supabaseServer();

  // On appelle la VUE "Live"
  const { data, error } = await supabase
    .from('brand_trust_live') 
    .select('*');

  if (error) {
    console.error("🔥 Error fetching brands:", error);
    return [];
  }

  // ✅ CRITIQUE : Conversion des données pour éviter les bugs
  return (data || []).map((brand: any) => ({
    id: brand.id,
    slug: brand.slug,
    name: brand.name,
    website: brand.website || '',
    logo_url: brand.logo_url || '',
    
    // 🛡️ Conversion BigInt -> Number (Vital !)
    proof_count: Number(brand.proof_count ?? 0),
    
    // Gestion des scores et dates
    trust_score: Number(brand.trust_score ?? 0),
    last_proof_at: brand.last_proof_at ?? null,
    
    // Champs UI
    latest_status: brand.latest_status || 'draft',
    total_donated: Number(brand.total_donated ?? 0),
    category: brand.category || 'General',
    description: brand.description || '',
    claim: brand.claim || ''
  }));
}