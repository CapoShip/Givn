"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db.js";
import { supabaseClerkServer } from "@/lib/supabase/clerk-server";

// ---------------------------
// Types
// ---------------------------
type ActionState = {
  success: boolean;
  message: string;
};

// ---------------------------
// Prisma: Brands (Admin)
// ---------------------------

// 1) Récupérer toutes les marques depuis la DB
export async function getBrands() {
  try {
    const brands = await db.brand.findMany({
      orderBy: { createdAt: "desc" },
    });
    return brands;
  } catch (error) {
    console.error("Erreur database lors de la lecture:", error);
    return [];
  }
}

// 2) Ajouter une nouvelle marque
export async function addBrand(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const website = formData.get("website") as string;
  const email = formData.get("email") as string;

  if (!name || !website || !email) {
    return { success: false, message: "Veuillez remplir tous les champs" };
  }

  try {
    await db.brand.create({
      data: {
        name,
        website,
        email,
        status: "PENDING",
      },
    });

    revalidatePath("/admin");
    return { success: true, message: "Marque ajoutée avec succès !" };
  } catch (error) {
    console.error("Erreur création dans la DB:", error);
    return { success: false, message: "Erreur lors de l'ajout (Base de données)" };
  }
}

// 3) Supprimer une marque
export async function deleteBrand(id: string) {
  try {
    await db.brand.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true, message: `Marque ${id} supprimée.` };
  } catch (error) {
    console.error("Erreur suppression dans la DB:", error);
    return { success: false, message: "Échec de la suppression." };
  }
}

// 4) Mettre à jour le statut d'une marque
export async function updateBrandStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
) {
  try {
    await db.brand.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin");
    return { success: true, message: `Statut de la marque ${id} mis à jour.` };
  } catch (error) {
    console.error("Erreur mise à jour du statut dans la DB:", error);
    return { success: false, message: "Échec de la mise à jour du statut." };
  }
}

// ---------------------------
// Clerk x Supabase: Proof of Identity
// ---------------------------

export async function debugClerkToken() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "supabase" });

  return {
    userId,
    hasToken: Boolean(token),
    tokenPreview: token ? `${token.slice(0, 24)}...${token.slice(-12)}` : null,
  };
}

export async function whoAmI() {
  const sb = await supabaseClerkServer();
  const { data, error } = await sb.rpc("givn_whoami");

  if (error) {
    return {
      supabaseUserId: null as string | null,
      ok: false,
      error: error.message,
      raw: null as any,
    };
  }

  return {
    supabaseUserId: (data?.uid as string | null) ?? null,
    ok: true,
    error: null as string | null,
    raw: data,
  };
}
