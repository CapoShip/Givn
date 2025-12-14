import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  const payload = {
    brandSlug: slug,
    verified: true,
    month: "August",
    amount: 500,
    currency: "USD",
    verifiedBy: "Givn",
  };

  return NextResponse.json(payload);
}
