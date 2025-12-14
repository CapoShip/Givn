import { ArrowRight, BadgeCheck, ShieldCheck, Zap } from "lucide-react";

export default function MarketingHomeSections() {
  return (
    <section className="border-t border-white/10">
      <div className="max-w-5xl mx-auto px-6 py-24 font-mono text-white">
        {/* Why */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="text-xs tracking-widest text-white/40">WHY IT MATTERS</div>
            <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight leading-[0.95]">
              Donation claims don’t convert.
              <br />
              Proof does.
            </h2>
            <p className="mt-6 text-white/60">
              “We donate 1%” is now perceived as marketing. Customers want verification, not vibes.
            </p>

            <a
              href="/brand/demo-brand"
              className="mt-10 inline-flex items-center gap-2 border border-white/20 px-4 py-3 text-xs text-white/70 hover:bg-white/10"
            >
              See a public proof page <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="space-y-4">
            <div className="border border-white/10 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-white/70 mt-0.5" />
                <div>
                  <div className="text-sm text-white/80">Trust gap</div>
                  <div className="text-xs text-white/45 mt-1">
                    Brands claim. Customers cannot verify. Conversion suffers.
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white/10 p-5">
              <div className="flex items-start gap-3">
                <BadgeCheck className="h-5 w-5 text-white/70 mt-0.5" />
                <div>
                  <div className="text-sm text-white/80">Time-bound badge</div>
                  <div className="text-xs text-white/45 mt-1">
                    The badge expires if proof is missing for the next period.
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white/10 p-5">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-white/70 mt-0.5" />
                <div>
                  <div className="text-sm text-white/80">Checkout confidence</div>
                  <div className="text-xs text-white/45 mt-1">
                    Customers stop guessing. They verify. You convert.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20 border border-white/10">
          <div className="p-6 border-b border-white/10">
            <div className="text-xs tracking-widest text-white/40">HOW IT WORKS</div>
            <div className="mt-2 text-lg text-white/80">Verification, not storytelling.</div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "1 — Upload proof",
                desc: "Receipts, monthly statements. Later: NGO APIs.",
              },
              {
                title: "2 — Verify",
                desc: "Manual first. Automated later. Always auditable.",
              },
              {
                title: "3 — Publish",
                desc: "Public badge + ledger. Missing proof is visible.",
              },
            ].map((x) => (
              <div key={x.title} className="border border-white/10 p-5">
                <div className="text-xs tracking-widest text-white/40">{x.title}</div>
                <p className="mt-3 text-sm text-white/65">{x.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-white/10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="text-xs text-white/50">
              Givn is not an NGO. Not a donation platform. A third-party proof engine.
            </div>
            <div className="flex gap-3">
              <a
                href="/how-it-works"
                className="inline-flex items-center justify-center border border-white/20 px-4 py-3 text-xs text-white/70 hover:bg-white/10"
              >
                Read how it works
              </a>
              <a
                href="/request-access"
                className="inline-flex items-center justify-center bg-white text-black px-4 py-3 text-xs font-semibold hover:opacity-90"
              >
                Request access
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <div className="text-xs tracking-widest text-white/40">FAQ</div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "Is this a donation platform?",
                a: "No. Givn verifies and publishes proof. Donations happen elsewhere.",
              },
              {
                q: "Can a brand fake it?",
                a: "Not without evidence. Missing proof is shown publicly.",
              },
              {
                q: "Does the badge expire?",
                a: "Yes. If proof isn’t recorded for the next period, status degrades.",
              },
              {
                q: "Shopify integration?",
                a: "Badge embed is designed for Shopify storefronts and product pages.",
              },
            ].map((f) => (
              <div key={f.q} className="border border-white/10 p-6">
                <div className="text-sm text-white/85">{f.q}</div>
                <div className="mt-3 text-sm text-white/60">{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 border border-white/10 p-8 text-center">
          <div className="text-xs tracking-widest text-white/40">READY</div>
          <div className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">
            Replace claims with proof.
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href="/brand/demo-brand"
              className="inline-flex items-center justify-center border border-white/20 px-5 py-3 text-xs text-white/70 hover:bg-white/10"
            >
              View proof page
            </a>
            <a
              href="/request-access"
              className="inline-flex items-center justify-center bg-white text-black px-5 py-3 text-xs font-semibold hover:opacity-90"
            >
              Request access
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
