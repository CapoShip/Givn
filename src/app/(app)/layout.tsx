import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="border-r border-white/10 md:min-h-screen">
          <div className="px-6 py-6 border-b border-white/10">
            <div className="text-xs tracking-widest text-white/40">GIVN</div>
            <div className="mt-2 text-lg text-white/80">Brand Console</div>
          </div>

          <nav className="px-3 py-4 text-sm">
            <a
              href="/dashboard"
              className="block px-3 py-3 border border-transparent hover:border-white/10 hover:bg-white/5 text-white/70"
            >
              Dashboard
            </a>
            <a
              href="/proofs"
              className="block px-3 py-3 border border-transparent hover:border-white/10 hover:bg-white/5 text-white/70"
            >
              Proofs
            </a>
            <a
              href="/settings"
              className="block px-3 py-3 border border-transparent hover:border-white/10 hover:bg-white/5 text-white/70"
            >
              Settings
            </a>

            <div className="mt-6 px-3 text-xs text-white/40">Public</div>
            <a
              href="/brand/demo-brand"
              className="block px-3 py-3 border border-transparent hover:border-white/10 hover:bg-white/5 text-white/70"
            >
              Public proof page
            </a>
          </nav>
        </aside>

        {/* Main */}
        <div className="min-h-screen">
          <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="text-xs text-white/50">App</div>
            <div className="text-xs text-white/40">Status: connected (demo)</div>
          </header>

          <main className="px-6 py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
