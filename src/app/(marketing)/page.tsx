import Link from "next/link";

function BadgePreview() {
  return (
    <div className="border rounded-2xl p-6 bg-white">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Verified Impact</p>
        <span className="text-xs px-2 py-1 rounded-full border">Givn</span>
      </div>
      <p className="text-3xl font-bold mt-3">$500</p>
      <p className="text-gray-600">donated this month</p>
      <p className="text-xs text-gray-500 mt-4">Verified by Givn</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="text-sm text-gray-600">Anti-greenwashing for Shopify brands</p>
        <h1 className="text-5xl font-bold leading-tight mt-3">
          Turn donation promises into proof.
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Givn verifies your donations and displays a badge customers trust.
          Replace vague claims with transparent, verifiable impact.
        </p>

        <div className="flex gap-3 mt-8">
          <Link
            href="/request-access"
            className="px-5 py-3 rounded-lg bg-black text-white hover:bg-gray-900"
          >
            Request access
          </Link>
          <Link
            href="/pricing"
            className="px-5 py-3 rounded-lg border hover:bg-gray-50"
          >
            See pricing
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 text-sm">
          <div className="border rounded-xl p-4">
            <p className="font-semibold">Verified proofs</p>
            <p className="text-gray-600 mt-1">Receipts & statements</p>
          </div>
          <div className="border rounded-xl p-4">
            <p className="font-semibold">Trust at checkout</p>
            <p className="text-gray-600 mt-1">Higher conversion</p>
          </div>
          <div className="border rounded-xl p-4">
            <p className="font-semibold">Simple embed</p>
            <p className="text-gray-600 mt-1">Shopify script</p>
          </div>
        </div>
      </div>

      <div className="lg:justify-self-end w-full max-w-md">
        <BadgePreview />
        <div className="mt-4 border rounded-2xl p-5 bg-gray-50 text-sm text-gray-700">
          <p className="font-semibold">How it works</p>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Upload donation proof (or connect an NGO API)</li>
            <li>Givn verifies the transaction</li>
            <li>Show a “Verified Impact” badge on your store</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
