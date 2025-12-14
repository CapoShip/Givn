export const dynamic = "force-dynamic";

export default function AdminVerifyPage() {
  return (
    <main className="min-h-screen bg-black text-white font-mono p-10">
      <div className="max-w-3xl">
        <div className="text-xs tracking-widest text-white/40">(ADMIN) VERIFY</div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Verification Console</h1>

        <p className="mt-6 text-white/60">
          Placeholder page. This route will trigger verification workflows and recalculate badge status.
        </p>

        <div className="mt-10 border border-white/10 p-6">
          <div className="text-xs tracking-widest text-white/40">NEXT</div>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>• Load pending proofs</li>
            <li>• Approve / reject</li>
            <li>• Recompute monthly status</li>
            <li>• Publish audit trail</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
