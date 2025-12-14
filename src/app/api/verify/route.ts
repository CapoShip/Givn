import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { VerifySchema } from "@/lib/validators/verify";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = VerifySchema.parse(json);

    return NextResponse.json({
      ok: true,
      verification: {
        ...data,
        verifiedBy: "admin",
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    const message =
      err?.issues?.[0]?.message ?? "Invalid request body.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
