"use server";

import { supabaseServer } from "@/lib/supabase/server";
// On garde 'any' pour l'instant pour éviter les erreurs de typage bloquantes
import type { BrandTrustRow } from "@/lib/types/givn"; 

export async function getBrands() {
  const supabase = await supabaseServer();

  // 1. SELECT * : On prend TOUT. Plus d'oubli de colonne.
  const { data, error } = await supabase
    .from("brand_trust_live")
    .select("*")
    .order("trust_score", { ascending: false });

  if (error) {
    console.error("🔥 Error fetching brands:", error);
    return [];
  }

  // 2. MAPPING CHIRURGICAL
  // On convertit les noms de colonnes SQL (snake_case) vers ton UI (camelCase)
  return (data || []).map((brand: any) => ({
    id: brand.id || brand.brand_id, 
    slug: brand.slug,
    name: brand.name,
    website: brand.website || "",
    
    // ✅ LES CHAMPS QUI TE MANQUAIENT
    logo_url: brand.logo_url || "", 
    description: brand.description || "No description available.",
    claim: brand.claim || "No active claim",
    category: brand.category || "General",

    // ✅ CORRECTION DES CHIFFRES (total_donated vs proofs_total)
    proof_count: Number(brand.proof_count ?? 0),
    total_donated: Number(brand.total_donated ?? 0), // C'est ici que 'All Time' se joue
    trust_score: Number(brand.trust_score ?? 0),
    
    last_proof_at: brand.last_proof_at,
    latest_status: brand.latest_status || "draft",
  }));
}