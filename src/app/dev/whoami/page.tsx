import { auth } from "@clerk/nextjs/server";
import { debugClerkToken, whoAmI } from "@/app/actions";

export default async function WhoAmIPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-xl font-semibold">Login required</h1>
          <p className="mt-2 text-white/70">
            Clique sur “Connexion”, termine le login Clerk, puis recharge /dev/whoami.
          </p>
        </div>
      </div>
    );
  }

  const tokenDbg = await debugClerkToken();
  const supaDbg = await whoAmI();

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Supabase identity via Clerk</h1>

        <div className="mt-4 grid gap-4">
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="mb-2 text-sm font-semibold text-white/80">Clerk JWT</div>
            <pre className="text-sm">{JSON.stringify(tokenDbg, null, 2)}</pre>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="mb-2 text-sm font-semibold text-white/80">
              Supabase RPC (auth.uid)
            </div>
            <pre className="text-sm">{JSON.stringify(supaDbg, null, 2)}</pre>
          </div>
        </div>

        <p className="mt-4 text-xs text-white/50">
          Attendu: tokenDbg.hasToken=true puis supaDbg.raw.uid != null et supaDbg.raw.jwt.iss =
          ton domaine Clerk.
        </p>
      </div>
    </div>
  );
}
