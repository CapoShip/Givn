// src/components/Header.tsx
"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Scan } from "lucide-react";

export default function Header() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        
        {/* Partie Gauche : Logo + Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center group-hover:scale-110 transition-transform bg-white/5 group-hover:bg-emerald-500/20 group-hover:border-emerald-500">
                <div className="w-2.5 h-2.5 bg-white rounded-full group-hover:bg-emerald-400"></div>    
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">Givn</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
             <Link href="/methodology" className="text-sm text-zinc-400 hover:text-white transition">
                Methodology
             </Link>
             
             {/* Lien Admin - Visible seulement si connecté */}
             <SignedIn>
                <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 rounded-full">
                  <Scan size={14} />
                  Admin Panel
                </Link>
             </SignedIn>
          </div>
        </div>

        {/* Partie Droite : Connexion / Profil */}
        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-bold text-white hover:text-emerald-400 transition">
                Connexion
              </button>
            </SignInButton>
          </SignedOut>
        </div>

      </div>
    </nav>
  );
}