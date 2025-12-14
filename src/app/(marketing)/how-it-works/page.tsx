export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-black text-white font-mono pt-20">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-xs tracking-widest text-white/40">HOW IT WORKS</div>
        <h1 className="mt-6 text-5xl font-bold tracking-tight">Proof. Not promises.</h1>

        <div className="mt-10 space-y-8 text-white/70">
          <div className="border border-white/10 p-6">
            <div className="text-xs tracking-widest text-white/40">1 — BRAND PROVIDES EVIDENCE</div>
            <p className="mt-3">
              Receipts, monthly statements, confirmations. Later: NGO APIs.
            </p>
          </div>

          <div className="border border-white/10 p-6">
            <div className="text-xs tracking-widest text-white/40">2 — GIVN VERIFIES</div>
            <p className="mt-3">
              Initially manual. Later automated. Every record becomes auditable.
            </p>
          </div>

          <div className="border border-white/10 p-6">
            <div className="text-xs tracking-widest text-white/40">3 — PUBLIC BADGE + LEDGER</div>
            <p className="mt-3">
              The badge is time-bound. It degrades when proof is missing. The ledger shows the trail.
            </p>
          </div>

          <div className="border border-white/10 p-6">
            <div className="text-xs tracking-widest text-white/40">4 — TRUST CONVERTS</div>
            <p className="mt-3">
              Customers stop guessing. They verify.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
