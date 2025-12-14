export default function DashboardPage() {
  return (
    <section className="max-w-4xl">
      <div className="text-xs tracking-widest text-white/40">DASHBOARD</div>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">Your verification status</h1>
      <p className="mt-4 text-white/60">
        This is the brand console. Next: upload proof, submit verification, publish public badge.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">STATUS</div>
          <div className="mt-4 text-xl font-semibold">VALID (demo)</div>
        </div>
        <div className="border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">PERIOD</div>
          <div className="mt-4 text-xl font-semibold">December 2024</div>
        </div>
        <div className="border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">TOTAL</div>
          <div className="mt-4 text-xl font-semibold">$1.3k</div>
        </div>
      </div>
    </section>
  );
}
