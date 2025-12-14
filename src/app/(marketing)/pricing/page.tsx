import Link from "next/link";

function Plan({
  name,
  price,
  features,
}: {
  name: string;
  price: string;
  features: string[];
}) {
  return (
    <div className="border rounded-2xl p-6">
      <p className="font-semibold">{name}</p>
      <p className="text-3xl font-bold mt-2">{price}</p>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Pricing</h1>
      <p className="text-gray-600 mt-2">
        Start simple. Upgrade when you need more verification volume.
      </p>

      <div className="grid gap-6 mt-8 md:grid-cols-3">
        <Plan
          name="Starter"
          price="$19/mo"
          features={[
            "Verified badge",
            "1 brand",
            "Up to 5 proofs / month",
            "Email support",
          ]}
        />
        <Plan
          name="Growth"
          price="$49/mo"
          features={[
            "Everything in Starter",
            "Up to 25 proofs / month",
            "Monthly verification report",
            "Priority support",
          ]}
        />
        <Plan
          name="Pro"
          price="$99/mo"
          features={[
            "Everything in Growth",
            "Up to 100 proofs / month",
            "Multiple storefront placements",
            "Dedicated onboarding",
          ]}
        />
      </div>

      <div className="mt-10">
        <Link
          href="/request-access"
          className="inline-block px-5 py-3 rounded-lg bg-black text-white hover:bg-gray-900"
        >
          Request access
        </Link>
      </div>
    </div>
  );
}
