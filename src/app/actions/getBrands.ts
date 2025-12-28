"use server";

import { supabaseServer } from "@/lib/supabase/server";
// On utilise 'any' ici temporairement pour éviter les conflits de types stricts 
// pendant qu'on aligne le backend et le frontend.
import type { BrandTrustRow } from "@/lib/types/givn"; 

export async function getBrands() {
  const supabase = await supabaseServer();

  // 1. On sélectionne TOUT (*) depuis la vue
  // C'est plus sûr pour ne rien oublier (description, claim, logo, etc.)
  const { data, error } = await supabase
    .from("brand_trust_live")
    .select("*")
    .order("trust_score", { ascending: false });

  if (error) {
    console.error("🔥 Error fetching brands:", error);
    return [];
  }

  // 2. MAPPING ROBUSTE (Le secret pour que tout s'affiche)
  // On transforme les données brutes de la DB en format parfait pour ton UI
  return (data || []).map((brand: any) => ({
    id: brand.id || brand.brand_id, // Gestion des deux noms possibles
    slug: brand.slug,
    name: brand.name,
    website: brand.website || "",
    
    // ✅ ICI : On récupère enfin les champs textuels
    logo_url: brand.logo_url || "", 
    description: brand.description || "No description available.",
    claim: brand.claim || "No active claim",
    category: brand.category || "General",

    // ✅ ICI : On mappe les chiffres (DB: snake_case -> UI: camelCase)
    // On force la conversion en Number pour éviter les bugs BigInt
    proof_count: Number(brand.proof_count ?? 0),
    total_donated: Number(brand.total_donated ?? 0),
    trust_score: Number(brand.trust_score ?? 0),
    
    // Gestion des dates et status
    last_proof_at: brand.last_proof_at,
    latest_status: brand.latest_status || "draft",
  }));
}