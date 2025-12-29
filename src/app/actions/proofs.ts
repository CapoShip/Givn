"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProofState = {
  message: string;
  success: boolean;
};

// Initial state pour useActionState
export const initialProofState: ProofState = {
  message: "",
  success: false,
};

export async function uploadProof(
  prevState: ProofState,
  formData: FormData
): Promise<ProofState> {
  const supabase = await supabaseServer();

  try {
    // 1. Extraction
    const brandId = formData.get("brandId") as string;
    const amountStr = formData.get("amount") as string;
    const currency = formData.get("currency") as string;
    const file = formData.get("file") as File;

    if (!brandId || !amountStr || !file || file.size === 0) {
      return { message: "Champs manquants ou fichier vide.", success: false };
    }

    // 2. Upload Storage
    // Nom unique : brandId-timestamp.ext
    const fileExt = file.name.split(".").pop();
    const fileName = `${brandId}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("proofs")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage Error:", uploadError);
      return { message: "Erreur lors de l'upload du fichier.", success: false };
    }

    // 3. URL Publique
    const { data: urlData } = supabase.storage
      .from("proofs")
      .getPublicUrl(filePath);

    // 4. Insertion DB
    // On force le statut "verified" pour que ça apparaisse direct dans le Pulse
    const { error: dbError } = await supabase.from("proofs").insert({
      brand_id: brandId,
      amount: parseFloat(amountStr),
      currency: currency,
      proof_url: urlData.publicUrl,
      status: "verified",
      verified_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      return { message: "Erreur lors de l'enregistrement en base.", success: false };
    }

    // 5. Revalidation
    revalidatePath("/"); // Met à jour la home page
    revalidatePath("/admin");
    
    return { message: "Preuve enregistrée et vérifiée !", success: true };

  } catch (error) {
    console.error("Server Action Fatal:", error);
    return { message: "Erreur serveur critique.", success: false };
  }
}