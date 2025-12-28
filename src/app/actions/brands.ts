"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import type { BrandTrustRow } from "@/lib/types/givn";

export type ActionState = {
  success: boolean;
  message: string;
};

export type BrandRow = {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  logo_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export async function getBrands(): Promise<BrandRow[]> {
  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("brands")
      .select("id, slug, name, website, logo_url, status, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as BrandRow[];
  } catch (error: any) {
    console.error("[getBrands]", error);
    return [];
  }
}

export async function addBrand(_: unknown, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (!name || !website) {
    return { success: false, message: "Tous les champs sont requis" };
  }

  try {
    const supabase = await supabaseServer();

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60);

    const { error } = await supabase.from("brands").insert({
      name,
      website,
      slug,
      status: "PENDING",
    });

    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Marque soumise avec succès" };
  } catch (error: any) {
    console.error("[addBrand]", error);
    return { success: false, message: error?.message ?? "Erreur lors de la soumission" };
  }
}

export async function updateBrandTier(id: string, status: string): Promise<ActionState> {
  try {
    const supabase = await supabaseServer();

    const { error } = await supabase.from("brands").update({ status }).eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: `Tier mis à jour → ${status}` };
  } catch (error: any) {
    console.error("[updateBrandTier]", error);
    return { success: false, message: error?.message ?? "Erreur mise à jour" };
  }
}

/**
 * Homepage: source de vérité = view `brand_trust_live`
 * Colonnes attendues (d'après tes captures):
 * brand_id, slug, name, website, logo_url, trust_score, proof_count, last_proof_at, latest_status
 */
export async function getLivingBrands(): Promise<BrandTrustRow[]> {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("brand_trust_live")
      .select("brand_id, slug, name, website, logo_url, trust_score, proof_count, last_proof_at, latest_status")
      .order("trust_score", { ascending: false });

    if (error) throw new Error(error.message);

    const rows: BrandTrustRow[] = (data ?? []).map((r: any) => ({
      id: String(r.brand_id),
      slug: String(r.slug),
      name: String(r.name),
      website: r.website ?? null,
      logo_url: r.logo_url ?? null,
      trust_score: r.trust_score ?? null,
      proof_count: r.proof_count ?? null,
      last_proof_at: r.last_proof_at ?? null,
      latest_status: r.latest_status ?? null,
    }));

    return rows;
  } catch (error: any) {
    console.error("[getLivingBrands]", error);
    return [];
  }
}
