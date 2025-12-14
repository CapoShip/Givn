"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function RequestAccessPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [website, setWebsite] = useState("");
  const [volume, setVolume] = useState<"starter" | "growth" | "scale">("starter");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const e = email.trim();
    return e.length > 5 && e.includes("@") && state !== "submitting";
  }, [email, state]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || null,
          brand: brand.trim() || null,
          website: website.trim() || null,
          volume,
          source: "request-access",
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setState("success");
      setEmail("");
      setName("");
      setBrand("");
      setWebsite("");
      setVolume("starter");
    } catch {
      setState("error");
      setError("Could not submit. Try again in a moment.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white font-mono pt-20">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: copy */}
          <div>
            <div className="text-xs tracking-widest text-white/40">REQUEST ACCESS</div>
            <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight leading-[0.95]">
              Don’t sell virtue.
              <br />
              Prove it.
            </h1>

            <p className="mt-6 text-white/60 max-w-xl">
              Givn is a verification layer for Shopify brands who claim donations. You upload proof. We verify.
              Your customers see a badge that can’t exist without evidence.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-3 border border-white/10 p-4">
                <ShieldCheck className="h-5 w-5 text-white/70 mt-0.5" />
                <div>
                  <div className="text-sm text-white/80">Time-bound verification</div>
                  <div className="text-xs text-white/45 mt-1">
                    Badge expires when proof is missing for the next period.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 border border-white/10 p-4">
                <BadgeCheck className="h-5 w-5 text-white/70 mt-0.5" />
                <div>
                  <div className="text-sm text-white/80">Public audit trail</div>
                  <div className="text-xs text-white/45 mt-1">
                    Customers can verify totals and periods — not marketing text.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border border-white/10 p-5 text-xs text-white/50">
              We are not an NGO. Not a donation platform. Not a “feel good” widget.
              <span className="text-white/70"> Givn is a third-party proof engine.</span>
            </div>
          </div>

          {/* Right: form card */}
          <div className="border border-white/10 bg-black/60">
            <div className="p-6 border-b border-white/10">
              <div className="text-xs tracking-widest text-white/40">EARLY ACCESS</div>
              <div className="mt-2 text-lg text-white/80">
                Join the list. We’ll contact you when onboarding opens.
              </div>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs tracking-widest text-white/40">EMAIL</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@brand.com"
                  className="mt-2 w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white/80 outline-none focus:border-white/50"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs tracking-widest text-white/40">NAME (OPTIONAL)</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-2 w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white/80 outline-none focus:border-white/50"
                />
              </div>

              {/* Brand + Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest text-white/40">BRAND (OPTIONAL)</label>
                  <input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Nord Atelier"
                    className="mt-2 w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white/80 outline-none focus:border-white/50"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-white/40">WEBSITE (OPTIONAL)</label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://brand.com"
                    className="mt-2 w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white/80 outline-none focus:border-white/50"
                  />
                </div>
              </div>

              {/* Volume */}
              <div>
                <label className="block text-xs tracking-widest text-white/40">MONTHLY ORDER VOLUME</label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {[
                    { k: "starter", label: "0–1k" },
                    { k: "growth", label: "1k–10k" },
                    { k: "scale", label: "10k+" },
                  ].map((o) => (
                    <button
                      key={o.k}
                      type="button"
                      onClick={() => setVolume(o.k as any)}
                      className={`appearance-none bg-transparent border px-3 py-3 text-xs tracking-widest ${
                        volume === o.k ? "border-white/60 text-white" : "border-white/20 text-white/60 hover:border-white/40"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={`appearance-none w-full inline-flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold transition ${
                  canSubmit ? "bg-white text-black hover:opacity-90" : "bg-white/20 text-white/40 cursor-not-allowed"
                }`}
              >
                {state === "submitting" ? "Submitting…" : "Request access"}
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* State messages */}
              {state === "success" && (
                <div className="border border-white/10 p-4 text-sm text-white/70">
                  Received. If you’re a fit, we’ll reach out.
                </div>
              )}

              {state === "error" && (
                <div className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div className="text-[11px] text-white/40">
                By requesting access, you agree to be contacted. No spam. No newsletters.
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
