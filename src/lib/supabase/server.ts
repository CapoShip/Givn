import "server-only";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function supabaseServer() {
  // ✅ Chez toi, cookies() retourne une Promise -> il faut await
  const cookieStore = await cookies();

  const url = mustEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anon = mustEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll() as unknown as CookieOptionsWithName[];
      },
      setAll(cookiesToSet: CookieOptionsWithName[]) {
        try {
          const storeAny = cookieStore as any;
          if (typeof storeAny.set !== "function") return;

          // ✅ Pas de destructuration -> évite l’erreur TS sur le callback
          for (const c of cookiesToSet) {
            storeAny.set(c.name, c.value, c.options);
          }
        } catch {
          // Certaines exécutions RSC interdisent set(); lectures OK.
        }
      },
    },
  });
}
