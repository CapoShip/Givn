import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LeadCreateSchema } from "@/lib/validators/leads";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = LeadCreateSchema.parse(json);

    // MVP: no DB yet
    return NextResponse.json({
      ok: true,
      lead: { ...data, createdAt: new Date().toISOString() },
    });
  } catch (err: any) {
    const message =
      err?.issues?.[0]?.message ?? "Invalid request body.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
