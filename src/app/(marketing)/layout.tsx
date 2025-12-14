import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 text-xs text-white/60 border-b border-white/10 bg-black/70 backdrop-blur">
        <a className="hover:text-white" href="/">
          Givn
        </a>
        <nav className="flex gap-4">
          <a className="hover:text-white" href="/pricing">
            Pricing
          </a>
          <a className="hover:text-white" href="/request-access">
            Request access
          </a>
        </nav>
      </header>

      {children}
    </div>
  );
}
