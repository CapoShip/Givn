export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white font-mono pt-20">
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-xs tracking-widest text-white/40">PRICING</div>
        <h1 className="mt-6 text-5xl font-bold tracking-tight">Pay for verification.</h1>
        <p className="mt-6 text-white/60 max-w-2xl">
          Givn is not marketing software. It is verification infrastructure.
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Starter", price: "$49/mo", note: "For early brands" },
            { name: "Growth", price: "$149/mo", note: "For scaling stores" },
            { name: "Enterprise", price: "Custom", note: "Custom audits + SLA" },
          ].map((p) => (
            <div key={p.name} className="border border-white/10 p-6">
              <div className="text-xs tracking-widest text-white/40">{p.name}</div>
              <div className="mt-4 text-3xl font-bold">{p.price}</div>
              <div className="mt-2 text-sm text-white/60">{p.note}</div>

              <ul className="mt-8 space-y-3 text-sm text-white/70">
                <li>• Public proof page</li>
                <li>• Time-bound badge</li>
                <li>• Audit trail</li>
                <li>• Monthly verification</li>
              </ul>

              <a
                href="/request-access"
                className="mt-10 inline-flex w-full justify-center border border-white/20 px-4 py-3 text-xs text-white/70 hover:bg-white/10"
              >
                Request access
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
