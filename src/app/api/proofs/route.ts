import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ProofCreateSchema } from "@/lib/validators/proofs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    proofs: [
      {
        id: "proof_1",
        brandSlug: "demo-brand",
        amount: 500,
        month: "August",
        status: "pending",
      },
    ],
  });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    // Note: Zod expects number; ensure client sends number (not string).
    const data = ProofCreateSchema.parse(json);

    return NextResponse.json({
      ok: true,
      proof: {
        id: "proof_new",
        ...data,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    const message =
      err?.issues?.[0]?.message ?? "Invalid request body.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
