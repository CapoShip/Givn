import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

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
      // 👇 AJOUTEZ CETTE LIGNE EXACTEMENT COMME ÇA
      publishableKey="pk_test_aW50ZXJuYWwtbGFicmFkb3ItMTMuY2xlcmsuYWNjb3VudHMuZGV2JA"
    >
      <html lang="fr" className="dark">
        <body className={`${inter.variable} ${mono.variable} font-sans antialiased bg-background text-white min-h-screen selection:bg-emerald-500 selection:text-black`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}