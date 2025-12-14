export default function SettingsPage() {
  return (
    <section className="max-w-5xl">
      <div className="text-xs tracking-widest text-white/40">SETTINGS</div>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">Brand configuration</h1>
      <p className="mt-4 text-white/60">
        Next step: connect Shopify store, set NGO, choose verification period rule (monthly vs rolling 30d).
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">SHOPIFY</div>
          <div className="mt-4 text-sm text-white/70">Not connected (demo)</div>
        </div>
        <div className="border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">PERIOD RULE</div>
          <div className="mt-4 text-sm text-white/70">Monthly (recommended)</div>
        </div>
        <div className="border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">NGO</div>
          <div className="mt-4 text-sm text-white/70">Water.org (demo)</div>
        </div>
      </div>
    </section>
  );
}
