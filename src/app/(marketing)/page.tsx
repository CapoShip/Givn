import Link from "next/link";

function BadgeMock() {
  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Verified Impact</p>
        <span className="text-xs px-2 py-1 rounded-full border">Givn</span>
      </div>
      <p className="text-4xl font-bold mt-4">$500</p>
      <p className="text-gray-600 mt-1">donated this month</p>
      <div className="mt-6 border-t pt-4 text-xs text-gray-500 flex items-center justify-between">
        <span>Updated daily</span>
        <span>Verified by Givn</span>
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border rounded-2xl p-5">
      <p className="font-semibold">{title}</p>
      <p className="text-gray-600 mt-1 text-sm">{desc}</p>
    </div>
  );
}

function FAQItem({
  q,
  a,
}: {
  q: string;
  a: string;
}) {
  return (
    <div className="border rounded-2xl p-5">
      <p className="font-semibold">{q}</p>
      <p className="text-gray-600 mt-2 text-sm">{a}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      {/* Hero */}
      <section className="text-center">
        <p className="text-sm text-gray-600">
          Verification for Shopify donation claims
        </p>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mt-4">
          Stop saying “we donate”.
          <br />
          <span className="text-gray-500">Show proof.</span>
        </h1>

        <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
          Givn verifies your donations and shows a simple badge customers trust.
          Replace vague claims with transparent, verifiable impact.
        </p>

        <div className="flex items-center justify-center gap-3 mt-8">
          <Link
            href="/request-access"
            className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-900"
          >
            Request access
          </Link>
          <Link
            href="/pricing"
            className="px-6 py-3 rounded-xl border hover:bg-gray-50"
          >
            Pricing
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          No Shopify app needed. Copy-paste one script.
        </p>
      </section>

      {/* “Screenshot” */}
      <section className="mt-12 flex justify-center">
        <div className="w-full max-w-md">
          <BadgeMock />
        </div>
      </section>

      {/* Social proof style line */}
      <section className="mt-10 text-center">
        <p className="text-sm text-gray-600">
          Built for brands that don’t want to look like they’re greenwashing.
        </p>
      </section>

      {/* Features */}
      <section className="mt-12 grid gap-4 md:grid-cols-3">
        <Feature
          title="Trust at checkout"
          desc="Customers see verified impact, not marketing copy."
        />
        <Feature
          title="Proofs that hold up"
          desc="Receipts, statements, or NGO APIs. You choose."
        />
        <Feature
          title="Simple embed"
          desc="One script. Put the badge anywhere on your store."
        />
      </section>

      {/* How it works */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="border rounded-2xl p-5">
            <p className="text-xs text-gray-500">Step 1</p>
            <p className="font-semibold mt-2">Upload proof</p>
            <p className="text-sm text-gray-600 mt-1">
              Donation receipts or monthly statements.
            </p>
          </div>
          <div className="border rounded-2xl p-5">
            <p className="text-xs text-gray-500">Step 2</p>
            <p className="font-semibold mt-2">We verify</p>
            <p className="text-sm text-gray-600 mt-1">
              Manual review at first. Automations later.
            </p>
          </div>
          <div className="border rounded-2xl p-5">
            <p className="text-xs text-gray-500">Step 3</p>
            <p className="font-semibold mt-2">Show the badge</p>
            <p className="text-sm text-gray-600 mt-1">
              “Verified Impact: $X donated this month”.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 border rounded-2xl p-8 text-center bg-gray-50">
        <h3 className="text-2xl font-bold tracking-tight">
          Want the badge on your store?
        </h3>
        <p className="text-gray-600 mt-2">
          Join early access. I’ll onboard you personally.
        </p>
        <div className="mt-6">
          <Link
            href="/request-access"
            className="inline-block px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-900"
          >
            Request access
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FAQItem
            q="Is this a Shopify app?"
            a="No. You paste a script wherever you want the badge. (An app can come later.)"
          />
          <FAQItem
            q="How do you verify donations?"
            a="For now: manual review of receipts/statements. Later: API connections + automated checks."
          />
          <FAQItem
            q="Can I choose where the badge shows?"
            a="Yes. Product page, cart, checkout, footer—anywhere you can add HTML."
          />
          <FAQItem
            q="Does it increase conversion?"
            a="That’s the goal: trust reduces skepticism. We’ll track it with simple experiments."
          />
        </div>
      </section>
    </div>
  );
}
