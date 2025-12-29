// src/app/actions/getBrands.ts
"use server";

import { supabaseServer } from "@/lib/supabase/server";
import type { BrandTrustRow } from "@/lib/types/givn";

export type BrandCardData = {
  id: string;
  slug: string;
  name: string;
  website: string;
  logo_url: string;
  category: string;
  description: string;
  claim: string;
  proof_count: number;
  total_donated: number;
  trust_score: number;
  last_proof_at: string | null;
  latest_status: string;
  formatted_total: string; // Prêt pour l'affichage
};

export async function getBrands(): Promise<BrandCardData[]> {
  const supabase = await supabaseServer();

  // On utilise le generic <BrandTrustRow> si tu as généré les types Supabase, 
  // sinon on caste le résultat de data.
  const { data, error } = await supabase
    .from("brand_trust_live")
    .select("*")
    .order("trust_score", { ascending: false });

  if (error) {
    console.error("🔥 Error fetching brands:", error);
    return [];
  }

  // Casting explicite pour rassurer TypeScript sur ce qui sort de la View
  const rows = data as unknown as BrandTrustRow[];

  return rows.map((brand) => {
    // Gestion défensive des valeurs numériques
    const donated = Number(brand.total_donated ?? 0);
    
    return {
      id: brand.id,
      slug: brand.slug,
      name: brand.name,
      website: brand.website || "",
      logo_url: brand.logo_url || "",
      category: brand.category || "General",
      description: brand.description || "Transparence en attente de description.",
      claim: brand.claim || "Engagement en cours de vérification.",
      proof_count: Number(brand.proof_count ?? 0),
      total_donated: donated,
      trust_score: Number(brand.trust_score ?? 0),
      last_proof_at: brand.last_proof_at ? new Date(brand.last_proof_at).toISOString() : null,
      latest_status: brand.latest_status || "draft",
      
      // Formatting côté serveur pour éviter les glitchs d'hydratation UI
      formatted_total: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(donated),
    };
  });
}