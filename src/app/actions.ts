"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseClerkServer } from "@/lib/supabase/clerk-server";

// ✅ Import des vraies Server Actions (Supabase-first)
import {
  getBrands as getBrandsImpl,
  addBrand as addBrandImpl,
  updateBrandTier as updateBrandTierImpl,
} from "@/app/actions/brands";

/**
 * IMPORTANT (Next.js 16 + Turbopack):
 * In a "use server" file, only async functions may be exported.
 * So we expose wrappers instead of re-exporting.
 */

// ----- BRANDS (Supabase source of truth) -----

export async function getBrands() {
  return await getBrandsImpl();
}

export async function addBrand(prevState: unknown, formData: FormData) {
  return await addBrandImpl(prevState, formData);
}

export async function updateBrandTier(id: string, status: string) {
  return await updateBrandTierImpl(id, status);
}

// ----- CLERK / SUPABASE (keep) -----

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
    if (error) return { ok: false, error: error.message };
    return { ok: true, uid: data?.uid ?? null };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Unknown error" };
  }
}
