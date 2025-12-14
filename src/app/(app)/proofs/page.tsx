export default function ProofsPage() {
  return (
    <section className="max-w-5xl">
      <div className="text-xs tracking-widest text-white/40">PROOFS</div>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">Upload & verification queue</h1>
      <p className="mt-4 text-white/60">
        Next step: add file upload + status (pending/verified/rejected) backed by Prisma.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">UPLOAD (PLACEHOLDER)</div>
          <div className="mt-4 border border-white/10 p-6 text-sm text-white/60">
            Dropzone will go here.
          </div>
          <div className="mt-4 text-xs text-white/40">
            Accepted: PDF, screenshots, statements. Each upload becomes auditable.
          </div>
        </div>

        <div className="border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">QUEUE (DEMO)</div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="border border-white/10 p-4 text-white/70">December statement — PENDING</div>
            <div className="border border-white/10 p-4 text-white/70">November receipt — VERIFIED</div>
            <div className="border border-white/10 p-4 text-white/70">October — MISSING</div>
          </div>
        </div>
      </div>
    </section>
  );
}
