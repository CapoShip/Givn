"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function getHomeData() {
  const supabase = await supabaseServer();

  // 1. Récupérer toutes les marques
  const { data: brands } = await supabase.from("brands").select("*");

  // 2. Récupérer toutes les preuves VÉRIFIÉES
  // On récupère aussi le nom de la marque associée pour le fil d'actu
  // (Note: Si la relation SQL n'est pas faite, on fera le lien en JS, c'est plus robuste pour l'instant)
  const { data: proofs } = await supabase
    .from("proofs")
    .select("*")
    .eq("status", "verified")
    .order("verified_at", { ascending: false });

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
      total_donated: brandTotal, // On écrase la valeur statique par la vraie
    };
  }).sort((a, b) => b.total_donated - a.total_donated); // Tri décroissant

  // C. Activité Récente (Pour le ticker en haut)
  const recentActivity = proofs.slice(0, 5).map((proof) => {
    const brandName = brands.find(b => b.id === proof.brand_id)?.name || "Anonymous";
    return {
      id: proof.id,
      brand: brandName,
      amount: proof.amount,
      currency: proof.currency,
      time: new Date(proof.verified_at).toLocaleDateString(), // Tu pourras mettre "2h ago" plus tard
    };
  });

  return {
    totalVolume,
    leaderboard,
    recentActivity,
  };
}