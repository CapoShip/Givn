import { auth } from "@clerk/nextjs/server";
import { debugClerkToken, whoAmI } from "@/app/actions";

export default async function WhoAmIPage() {
  const { userId } = await auth(); // ✅ TOUJOURS await chez toi

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
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-xl font-semibold">Supabase identity via Clerk</h1>

        <pre className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm">
          {JSON.stringify(tokenDbg, null, 2)}
        </pre>

        <pre className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm">
          {JSON.stringify(supaDbg, null, 2)}
        </pre>
      </div>
    </div>
  );
}
