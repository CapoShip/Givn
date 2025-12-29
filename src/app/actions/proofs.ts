"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export type ProofState = {
  message: string;
  success: boolean;
};

const ADMIN_EMAIL = "shippingdrop76@gmail.com"; 

export async function uploadProof(
  prevState: ProofState,
  formData: FormData
): Promise<ProofState> {
  // 1️⃣ SÉCURITÉ CLERK
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase().trim();

  if (!userEmail || userEmail !== ADMIN_EMAIL) {
    return { 
      message: "Accès refusé. Compte non autorisé.", 
      success: false 
    };
  }

  // 2️⃣ LOGIQUE MÉTIER
  const supabase = await supabaseServer();

  try {
    const brandId = formData.get("brandId") as string;
    const amountStr = formData.get("amount") as string;
    const currency = formData.get("currency") as string;
    const file = formData.get("file") as File;
    // ✅ NOUVEAU : On récupère le titre/description
    const title = formData.get("title") as string; 

    if (!brandId || !amountStr || !file || file.size === 0) {
      return { message: "Données incomplètes.", success: false };
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${brandId}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("proofs")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage Error:", uploadError);
      return { message: "Erreur upload fichier.", success: false };
    }

    const { data: urlData } = supabase.storage.from("proofs").getPublicUrl(filePath);

    const { error: dbError } = await supabase.from("proofs").insert({
      brand_id: brandId,
      amount: parseFloat(amountStr),
      currency: currency || "USD",
      proof_url: urlData.publicUrl,
      status: "verified",
      verified_at: new Date().toISOString(),
      // ✅ NOUVEAU : On insère le titre en base
      title: title || "Donation Proof", 
    });

    if (dbError) {
      console.error("DB Error:", dbError);
      return { message: "Erreur base de données.", success: false };
    }

    revalidatePath("/");
    revalidatePath("/admin");

    return { message: "Success! Proof added.", success: true };

  } catch (error) {
    console.error("Fatal:", error);
    return { message: "Erreur serveur.", success: false };
  }
}