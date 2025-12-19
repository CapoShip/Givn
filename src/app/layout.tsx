import { ClerkProvider, UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Givn - The Verification Layer',
  description: 'Verified corporate philanthropy on-chain.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider 
      publishableKey="pk_test_aW50ZXJuYWwtbGFicmFkb3ItMTMuY2xlcmsuYWNjb3VudHMuZGV2JA"
    >
      <html lang="fr" className="dark">
        <body className={`${inter.variable} ${mono.variable} font-sans antialiased bg-background text-white min-h-screen selection:bg-emerald-500 selection:text-black`}>
          
          {/* --- DÉBUT DE LA NAVIGATION --- */}
          <nav className="flex justify-between items-center p-6 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
            {/* Logo / Titre */}
            <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-emerald-400 transition font-mono">
              Givn.
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/methodology" className="text-sm text-zinc-400 hover:text-white transition">
                Méthodologie
              </Link>

              {/* Visible uniquement si connecté (Admin) */}
              <SignedIn>
                <Link href="/admin" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/10">
                  Dashboard Admin
                </Link>
                {/* Le bouton profil gère la déconnexion automatiquement */}
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              {/* Visible uniquement si déconnecté (Visiteur) */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition">
                    Connexion
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </nav>
          {/* --- FIN DE LA NAVIGATION --- */}

          <main className="flex-1">
            {children}
          </main>
          
        </body>
      </html>
    </ClerkProvider>
  )
}