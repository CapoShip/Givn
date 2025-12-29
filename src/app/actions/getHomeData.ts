"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function getHomeData() {
  const supabase = await supabaseServer();

  // 1. Récupérer toutes les marques
  const { data: brands } = await supabase.from("brands").select("*");

  // 2. Récupérer toutes les preuves VÉRIFIÉES
  const { data: proofs } = await supabase
    .from("proofs")
    .select("*")
    .eq("status", "verified")
    .order("verified_at", { ascending: false }); // Les plus récentes en premier

  if (!brands || !proofs) {
    return {
      totalVolume: 0,
      leaderboard: [],
      recentActivity: [],
    };
  }

  // --- CALCULS ---

  // A. Volume Total Global
  const totalVolume = proofs.reduce((acc, proof) => acc + Number(proof.amount), 0);

  // B. Leaderboard (Classement par argent donné)
  const leaderboard = brands.map((brand) => {
    // Somme des preuves pour cette marque
    const brandTotal = proofs
      .filter((p) => p.brand_id === brand.id)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      ...brand,
      total_donated: brandTotal,
    };
  })
  // 🔴 J'AI RETIRÉ LE FILTRE QUI CACHAIT LES MARQUES À 0$
  // .filter(b => b.total_donated > 0) 
  .sort((a, b) => b.total_donated - a.total_donated); // Tri décroissant (Riches en haut)

  // C. Activité Récente (Pour le ticker en haut)
  const recentActivity = proofs.slice(0, 5).map((proof) => {
    const brandName = brands.find(b => b.id === proof.brand_id)?.name || "Anonymous";
    return {
      id: proof.id,
      brand: brandName,
      amount: proof.amount,
      currency: proof.currency,
      timestamp: proof.verified_at, 
    };
  });

  return {
    totalVolume,
    leaderboard,
    recentActivity,
  };
}