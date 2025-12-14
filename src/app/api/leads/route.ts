import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation minimale (tu peux renforcer après)
    const email = String(body?.email ?? "").trim();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    // TODO plus tard: sauver en DB (Prisma) ou envoyer vers un CRM
    // Pour l’instant on log proprement au serveur
    console.log("[LEAD]", {
      email,
      name: body?.name ?? null,
      brand: body?.brand ?? null,
      website: body?.website ?? null,
      volume: body?.volume ?? null,
      source: body?.source ?? "unknown",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
