"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { GlobalActivityEvent } from "@/lib/types/givn";

export async function getGlobalActivity(): Promise<GlobalActivityEvent[]> {
  const supabase = await supabaseServer();

  // On récupère les 10 dernières preuves VÉRIFIÉES
  // C'est le signal le plus fort de l'activité du système.
  const { data: proofs, error } = await supabase
    .from("proofs")
    .select(`
      id,
      amount,
      currency,
      verified_at,
      brand:brands (
        name,
        slug,
        logo_url
      )
    `)
    .eq("status", "verified")
    .order("verified_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("⚡ Error fetching global activity:", error);
    return [];
  }

  // Transformation "Client-Ready" pour l'UI
  // Note: Supabase retourne des tableaux imbriqués pour les relations, d'où le typage 'any' temporaire ici 
  // seulement si le codegen Supabase n'est pas encore parfait, mais on structure le retour proprement.
  
  return proofs.map((proof: any) => ({
    id: proof.id,
    type: 'proof_verified',
    brandName: proof.brand?.name || "Unknown Brand",
    brandSlug: proof.brand?.slug || "#",
    brandLogo: proof.brand?.logo_url || null,
    amount: Number(proof.amount),
    currency: proof.currency || "USD",
    occurredAt: proof.verified_at
  }));
}