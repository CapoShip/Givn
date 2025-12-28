'use server';

import { supabaseServer } from "@/lib/supabase/server";
import { BrandTrustRow } from "@/lib/types/givn";

export async function getBrands() {
  const supabase = await supabaseServer();

  // ✅ On sélectionne TOUT (*) dans la vue
  const { data, error } = await supabase
    .from('brand_trust_live') 
    .select('*');

  if (error) {
    console.error("🔥 Error fetching brands:", error);
    return [];
  }

  return (data || []).map((brand: any) => ({
    id: brand.id,
    slug: brand.slug,
    name: brand.name,
    website: brand.website || '',
    
    // 👇 CES CHAMPS DOIVENT ÊTRE LÀ POUR QUE ÇA S'AFFICHE
    logo_url: brand.logo_url || '',      // Le logo
    description: brand.description || '', // La description
    claim: brand.claim || '',            // Le claim
    
    // Le reste...
    proof_count: Number(brand.proof_count ?? 0),
    trust_score: Number(brand.trust_score ?? 0),
    last_proof_at: brand.last_proof_at ?? null,
    latest_status: brand.latest_status || 'draft',
    total_donated: Number(brand.total_donated ?? 0),
    category: brand.category || 'General',
  }));
}