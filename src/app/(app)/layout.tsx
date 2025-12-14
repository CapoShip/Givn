import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 md:min-h-screen">
          <div className="px-6 py-6 border-b border-white/10">
            <div className="text-xs tracking-widest text-white/40">GIVN</div>
            <div className="mt-2 text-lg text-white/80">Console</div>
          </div>

          <nav className="px-3 py-4 text-sm">
            <a href="/dashboard" className="block px-3 py-3 text-white/70 hover:bg-white/5">
              Dashboard
            </a>
            <a href="/proofs" className="block px-3 py-3 (text-white/70) hover:bg-white/5">
              Proofs
            </a>
            <a href="/settings" className="block px-3 py-3 text-white/70 hover:bg-white/5">
              Settings
            </a>
          </nav>
        </aside>

        <div>
          <header className="border-b border-white/10 px-6 py-4 flex justify-between">
            <div className="text-xs text-white/50">App</div>
            <a href="/proofs" className="block px-3 py-3 text-white/70 hover:bg-white/5">
  Proofs
</a>

          </header>

          <main className="px-6 py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
