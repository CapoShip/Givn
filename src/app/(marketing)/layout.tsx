import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            Givn
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link href="/pricing" className="text-gray-700 hover:text-black">
              Pricing
            </Link>
            <Link
              href="/request-access"
              className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-900"
            >
              Request access
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t mt-16">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-gray-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Givn</span>
          <span>Proof of Real Impact</span>
        </div>
      </footer>
    </div>
  );
}
