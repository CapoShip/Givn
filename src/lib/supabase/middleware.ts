import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. On prépare la réponse initiale
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. On initialise le client Supabase avec les types stricts
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        // ✅ FIX TYPE : On explique à TypeScript ce qu'est 'cookiesToSet'
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          // Étape A : Setter sur la requête (pour le middleware courant)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // Étape B : Recréer la réponse pour inclure les cookies mis à jour
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          // Étape C : Setter sur la réponse finale (pour le navigateur)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Rafraîchissement critique de la session
  await supabase.auth.getUser()

  return response
}