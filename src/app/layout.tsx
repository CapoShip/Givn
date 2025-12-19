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
          
          {/* --- MODIFICATION ICI : Fond plus opaque (zinc-900) et bordure plus visible --- */}
          <nav className="flex justify-between items-center px-6 py-4 border-b border-white/20 bg-zinc-900 sticky top-0 z-50 shadow-lg">
            
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-emerald-400 transition font-mono text-white">
              Givn.
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/methodology" className="text-sm font-medium text-zinc-300 hover:text-white transition">
                Méthodologie
              </Link>

              {/* Admin (Connecté) */}
              <SignedIn>
                <Link href="/admin" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/10">
                  Dashboard Admin
                </Link>
                <div className="ml-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>

              {/* Visiteur (Déconnecté) */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm px-4 py-2 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition">
                    Connexion
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </nav>

          <main className="flex-1">
            {children}
          </main>
          
        </body>
      </html>
    </ClerkProvider>
  )
}