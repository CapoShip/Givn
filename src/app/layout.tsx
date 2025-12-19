// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Header from '@/components/givn/Header'; // <-- On importe le header ici

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
          
          {/* Header fixe en haut */}
          <Header />

          {/* Le contenu (le padding-top est géré dans page.tsx) */}
          <main className="flex-1">
            {children}
          </main>
          
        </body>
      </html>
    </ClerkProvider>
  )
}