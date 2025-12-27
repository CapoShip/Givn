import { whoAmI } from "@/app/actions";

export default async function WhoAmIPage() {
  const res = await whoAmI();

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-xs tracking-[0.3em] text-white/50">DEBUG</div>
        <h1 className="mt-2 text-xl font-semibold">Supabase identity via Clerk</h1>
        <pre className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4 text-sm">
          {JSON.stringify(res, null, 2)}
        </pre>
      </div>
    </div>
  );
}
