"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { GlobalActivityEvent } from "@/lib/types/givn";

export async function getGlobalActivity(): Promise<GlobalActivityEvent[]> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
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
    .limit(5);

  if (error) {
    console.error("Error fetching global activity:", error);
    return [];
  }

  return data.map((proof: any) => ({
    id: proof.id,
    type: 'proof_verified',
    brandName: proof.brand?.name || "Unknown Brand",
    brandSlug: proof.brand?.slug || "#",
    brandLogo: proof.brand?.logo_url || null,
    amount: Number(proof.amount),
    currency: proof.currency || "USD",
    occurredAt: proof.verified_at // Déjà ISO string via Supabase JSON
  }));
}