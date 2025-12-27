"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

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
  status: string; // "PENDING" | "VERIFIED" etc.
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

export async function addBrand(_: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (!name || !website) {
    return { success: false, message: "Tous les champs sont requis" };
  }

  try {
    const supabase = await supabaseServer();

    // slug minimal (tu peux le durcir plus tard)
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

export async function updateBrandTier(id: string, status: string) {
  try {
    const supabase = await supabaseServer();

    const { error } = await supabase
      .from("brands")
      .update({ status })
      .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin");
    return { success: true, message: `Tier mis à jour → ${status}` };
  } catch (error: any) {
    console.error("[updateBrandTier]", error);
    return { success: false, message: error?.message ?? "Erreur mise à jour" };
  }
}

import type { BrandTrustRow } from "@/lib/types/givn";

export async function getLivingBrands(): Promise<BrandTrustRow[]> {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("brand_trust") // ta view
      .select("id, slug, name, website, logo_url, status, last_proof_at, proof_count, trust_score")
      .order("trust_score", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as BrandTrustRow[];
  } catch (error: any) {
    console.error("[getLivingBrands]", error);
    return [];
  }
}

