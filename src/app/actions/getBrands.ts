"use server";

import { supabaseServer } from "@/lib/supabase/server";
// On garde 'any' temporairement pour fluidifier le dev MVP
import type { BrandTrustRow } from "@/lib/types/givn"; 

export async function getBrands() {
  const supabase = await supabaseServer();

  // 🔴 AVANT (Ton bug) : .select('slug, name...') -> Tu oubliais description et claim
  // 🟢 MAINTENANT (Le fix) : .select('*') -> On prend TOUTES les colonnes de la vue
  const { data, error } = await supabase
    .from("brand_trust_live")
    .select("*")
    .order("trust_score", { ascending: false });

  if (error) {
    console.error("🔥 Error fetching brands:", error);
    return [];
  }

  // MAPPING INTELLIGENT
  return (data || []).map((brand: any) => ({
    // ID & Identité
    id: brand.id || brand.brand_id, 
    slug: brand.slug,
    name: brand.name,
    website: brand.website || "",
    logo_url: brand.logo_url || "", 
    category: brand.category || "General",

    // ✅ ICI : On force la lecture des textes
    description: brand.description || "No description available.",
    claim: brand.claim || "No active claim",

    // ✅ ICI : On répare les chiffres (total_donated est le bon nom SQL)
    proof_count: Number(brand.proof_count ?? 0),
    total_donated: Number(brand.total_donated ?? 0), 
    trust_score: Number(brand.trust_score ?? 0),
    
    // Status & Dates
    last_proof_at: brand.last_proof_at,
    latest_status: brand.latest_status || "draft",
    
    // (Optionnel) Mock pour le "Month" car on ne l'a pas encore en SQL
    // On met un random stable pour l'instant pour éviter le $0 ou $75 bizarre
    month: Math.floor(Number(brand.total_donated ?? 0) * 0.12),
  }));
}