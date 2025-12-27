import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function supabaseServer() {
  const cookieStore = await cookies();

  // Cast only at the integration boundary to satisfy @supabase/ssr 0.5.2 types
  return createServerClient(
    mustEnv("NEXT_PUBLIC_SUPABASE_URL"),
    mustEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach((c) => {
              cookieStore.set(c.name, c.value, c.options);
            });
          } catch {
            // Some Server Component contexts disallow setting cookies.
            // Safe to ignore; reads still work.
          }
        },
      },
    } as any
  );
}
