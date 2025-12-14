import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg">
            Givn
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link href="/pricing" className="hover:underline">
              Pricing
            </Link>
            <Link href="/request-access" className="hover:underline">
              Request access
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-md bg-black text-white hover:bg-gray-900"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>

      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-gray-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Givn</span>
          <span>Proof of Real Impact</span>
        </div>
      </footer>
    </div>
  );
}
