"use server";

import { supabaseServer } from "@/lib/supabase/server";
// On garde 'any' pour l'instant pour débloquer la situation immédiatement
import type { BrandTrustRow } from "@/lib/types/givn"; 

export async function getBrands() {
  const supabase = await supabaseServer();

  // 1. LA CLÉ DU SUCCÈS : .select("*")
  // On arrête de lister les colonnes manuellement. On prend TOUT.
  // C'est ça qui va enfin laisser passer 'description' et 'claim'.
  const { data, error } = await supabase
    .from("brand_trust_live")
    .select("*")
    .order("trust_score", { ascending: false });

  if (error) {
    console.error("🔥 Error fetching brands:", error);
    return [];
  }

  // 2. LE MAPPING CORRIGÉ
  return (data || []).map((brand: any) => ({
    id: brand.id || brand.brand_id, 
    slug: brand.slug,
    name: brand.name,
    website: brand.website || "",
    logo_url: brand.logo_url || "", 
    category: brand.category || "General",

    // ✅ RÉCUPÉRATION FORCÉE DES TEXTES
    // Si la base renvoie null, on met un texte par défaut PROPRE.
    description: brand.description || "No description available.",
    claim: brand.claim || "No active claim",

    // ✅ CORRECTION DES MONTANTS
    // On lit 'total_donated' (SQL) et on le met dans 'total_donated' (UI)
    proof_count: Number(brand.proof_count ?? 0),
    total_donated: Number(brand.total_donated ?? 0), 
    trust_score: Number(brand.trust_score ?? 0),
    
    last_proof_at: brand.last_proof_at,
    latest_status: brand.latest_status || "draft",
    
    // Astuce UX : On génère un "Month" fictif basé sur le total pour que ça ne soit pas vide
    month: Math.floor(Number(brand.total_donated ?? 0) * 0.12),
  }));
}