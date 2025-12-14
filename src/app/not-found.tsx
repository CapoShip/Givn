import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="max-w-md text-center px-6">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-gray-600 mt-2">
          This page doesn’t exist.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block px-5 py-3 rounded-xl bg-black text-white hover:bg-gray-900"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
