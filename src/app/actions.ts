'use server'

import { z } from "zod";

// On réutilise le schéma pour une double sécurité (Frontend + Backend)
const schema = z.object({
  name: z.string().min(2, "Nom trop court"),
  website: z.string().url("URL invalide"),
  sector: z.enum(['Tech', 'Fashion', 'Finance', 'Food', 'Energy', 'Other']),
  contact: z.string().email("Email invalide"),
});

export type FormState = {
  message: string;
  errors?: Record<string, string[]>;
  success?: boolean;
}

export async function submitBrandAction(prevState: any, formData: FormData): Promise<FormState> {
  // 1. Extraction des données brutes
  const rawData = {
    name: formData.get('name'),
    website: formData.get('website'),
    sector: formData.get('sector'),
    contact: formData.get('contact'),
  };

  // 2. Validation Zod côté serveur
  const result = schema.safeParse(rawData);

  if (!result.success) {
    return {
      message: "Erreur de validation",
      errors: result.error.flatten().fieldErrors,
      success: false
    };
  }

  // 3. Simulation Backend (Ici, vous connecterez plus tard Supabase ou Prisma)
  // Ex: await db.insert(brands).values(result.data)
  console.log("--- NOUVELLE SOUMISSION REÇUE ---");
  console.log(result.data);
  console.log("---------------------------------");

  // Simulation d'attente réseau
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { message: "Demande enregistrée avec succès !", success: true };
}