// Fichier: src/app/methodology/page.tsx
import React from 'react';
import { ShieldCheck, Search, Database, Lock } from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background text-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 glow-text">The Truth Algorithm.</h1>
        <p className="text-xl text-zinc-400 mb-16 leading-relaxed">
          Givn isn't just a database. It's a rigorous verification protocol designed to eliminate greenwashing. Here is how we validate every single dollar.
        </p>

        <div className="space-y-16">
          {/* STEP 1 */}
          <div className="relative pl-8 border-l border-emerald-500/30">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-black border border-emerald-500 rounded-full flex items-center justify-center text-emerald-500">
              <Search size={12} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">1. Signal Detection</h3>
            <p className="text-zinc-400 leading-7">
              Our scrapers monitor corporate CSR reports, press releases, and social media claims. When a brand says "We donated $100k to Red Cross", we flag it as a <span className="text-white font-mono bg-white/10 px-1 rounded">CLAIM_PENDING</span>.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="relative pl-8 border-l border-emerald-500/30">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-black border border-emerald-500 rounded-full flex items-center justify-center text-emerald-500">
              <Database size={12} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">2. Evidence Ingestion</h3>
            <p className="text-zinc-400 leading-7">
              We require cryptographic proof or verifiable bank trails.
              <br/><br/>
              <ul className="list-disc pl-5 space-y-2 text-zinc-500">
                <li><strong className="text-zinc-300">On-Chain:</strong> Transaction Hash (TxID) verification on Ethereum/Solana.</li>
                <li><strong className="text-zinc-300">Off-Chain:</strong> IRS Form 990 or direct API receipts from platforms like The Giving Block.</li>
              </ul>
            </p>
          </div>

          {/* STEP 3 */}
          <div className="relative pl-8 border-l border-transparent">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-black">
              <ShieldCheck size={14} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">3. Immutable Badge</h3>
            <p className="text-zinc-400 leading-7">
              Once verified, the data is pinned to IPFS. The brand receives the <span className="text-emerald-400 font-bold">VERIFIED</span> badge. If a donation is recurring, we re-verify monthly. If a payment fails, the badge is automatically revoked.
            </p>
          </div>
        </div>

        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 text-center">
            <Lock className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
            <h4 className="text-lg font-bold mb-2">Zero-Knowledge Proofs (Coming Soon)</h4>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
                We are building a ZK-Rollup to allow companies to prove donation amounts without revealing sensitive bank account balances.
            </p>
        </div>
      </div>
    </div>
  );
}