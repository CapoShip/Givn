"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { supabaseClerkServer } from "@/lib/supabase/clerk-server";

/* ---------------------------------
   TYPES
---------------------------------- */

export type ActionState = {
  success: boolean;
  message: string;
};

export type BrandTier = "PENDING" | "VERIFIED" | "REJECTED";

/* ---------------------------------
   BRANDS
---------------------------------- */

// Lire toutes les marques
export async function getBrands() {
  try {
    return await db.brand.findMany({
      orderBy: { created_at: "desc" },
    });
  } catch (e) {
    console.error("[getBrands]", e);
    return [];
  }
}

// Ajouter une marque (form public)
export async function addBrand(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (!name || !website) {
    return {
      success: false,
      message: "Tous les champs sont requis",
    };
  }

  try {
    await db.brand.create({
      data: {
        name,
        website,
        credibility_tier: "PENDING",
      },
    });

    revalidatePath("/");
    return {
      success: true,
      message: "Marque soumise avec succès",
    };
  } catch (e: any) {
    console.error("[addBrand]", e);
    return {
      success: false,
      message: e?.message ?? "Erreur lors de la soumission",
    };
  }
}

// Approve / Reject (admin)
export async function updateBrandTier(
  id: string,
  tier: BrandTier
): Promise<ActionState> {
  try {
    await db.brand.update({
      where: { id },
      data: { credibility_tier: tier },
    });

    revalidatePath("/admin");

    return {
      success: true,
      message: `Tier mis à jour → ${tier}`,
    };
  } catch (e: any) {
    console.error("[updateBrandTier]", e);
    return {
      success: false,
      message: e?.message ?? "Erreur mise à jour",
    };
  }
}

/* ---------------------------------
   CLERK / SUPABASE
---------------------------------- */

export async function debugClerkToken() {
  const { userId, getToken } = await auth();

  if (!userId) {
    return { hasToken: false, userId: null };
  }

  const token = await getToken({ template: "supabase" });

  return {
    hasToken: Boolean(token),
    userId,
    tokenPreview: token ? token.slice(0, 30) + "..." : null,
  };
}

export async function whoAmI() {
  try {
    const sb = await supabaseClerkServer();
    const { data, error } = await sb.rpc("givn_whoami");

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, uid: data?.uid ?? null };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Unknown error" };
  }
}
