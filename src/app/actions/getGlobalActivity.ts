"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { GlobalActivityEvent } from "@/lib/types/givn";

export async function getGlobalActivity(): Promise<GlobalActivityEvent[]> {
  const supabase = await supabaseServer();

  // 1. On essaie de chercher les vraies données
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

  // 2. Si on a des données réelles, on les utilise
  if (data && data.length > 0) {
    return data.map((proof: any) => ({
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

  // 🚨 3. MODE DÉMO / FALLBACK
  console.log("⚠️ DB empty, serving Mock Data for visuals");
  return [
    {
      id: "demo-1",
      type: "proof_verified",
      brandName: "Patagonia",
      brandSlug: "patagonia",
      brandLogo: null,
      amount: 50000,
      currency: "USD",
      occurredAt: new Date().toISOString(),
    },
    {
      id: "demo-2",
      type: "proof_verified",
      brandName: "Tesla",
      brandSlug: "tesla",
      brandLogo: null,
      amount: 125000,
      currency: "USD",
      occurredAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "demo-3",
      type: "proof_verified",
      brandName: "Oatly",
      brandSlug: "oatly",
      brandLogo: null,
      amount: 15000,
      currency: "EUR",
      occurredAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ];
}