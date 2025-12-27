"use server";

// Assurez-vous que le nom du fichier est correct : db (pour db.ts) ou db.js (si renommé)
import { db } from "@/lib/db.js"; 
import { revalidatePath } from "next/cache";

// Type pour la réponse du formulaire
type ActionState = {
    success: boolean;
    message: string;
};

// 1. Récupérer toutes les marques depuis la DB
export async function getBrands() {
  try {
    const brands = await db.brand.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return brands;
  } catch (error) {
    console.error("Erreur database lors de la lecture:", error);
    // Retourne un tableau vide en cas d'erreur pour ne pas bloquer l'interface
    return []; 
  }
}

// 2. Ajouter une nouvelle marque (connecté au formulaire)
export async function addBrand(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name") as string;
  const website = formData.get("website") as string;
  const email = formData.get("email") as string;

  if (!name || !website || !email) {
    return { success: false, message: "Veuillez remplir tous les champs" };
  }

  try {
    // Création dans Supabase via Prisma
    await db.brand.create({
      data: {
        name,
        website,
        email,
        status: "PENDING", // Statut par défaut à la création
      },
    });

    // Rafraîchir la page admin pour que la nouvelle marque apparaisse
    revalidatePath("/admin");
    return { success: true, message: "Marque ajoutée avec succès !" };
    
  } catch (error) {
    console.error("Erreur création dans la DB:", error);
    return { success: false, message: "Erreur lors de l'ajout (Base de données)" };
  }
}

// 3. Supprimer une marque (pour le tableau de bord Admin)
export async function deleteBrand(id: string) {
  try {
    await db.brand.delete({
      where: { id }
    });
    // Rafraîchir la page admin après la suppression
    revalidatePath("/admin");
    return { success: true, message: `Marque ${id} supprimée.` };
  } catch (error) {
    console.error("Erreur suppression dans la DB:", error);
    return { success: false, message: "Échec de la suppression." };
  }
}

// 4. Mettre à jour le statut d'une marque (pour le tableau de bord Admin)
export async function updateBrandStatus(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
  try {
    await db.brand.update({
      where: { id },
      data: { status }
    });
    
    revalidatePath("/admin");
    return { success: true, message: `Statut de la marque ${id} mis à jour.` };

  } catch (error) {
    console.error("Erreur mise à jour du statut dans la DB:", error);
    return { success: false, message: "Échec de la mise à jour du statut." };
  }
}
"use server";

import { supabaseClerkServer } from "@/lib/supabase/clerk-server";

export async function whoAmI() {
  const sb = await supabaseClerkServer();
  const { data, error } = await sb.auth.getUser();
  if (error) throw new Error(error.message);

  return { supabaseUserId: data.user?.id ?? null };
}
