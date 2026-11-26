import { NextResponse } from "next/server";

/**
 * Retired (V5): payments only through signed links issued by the concierge (/pay?t=…, /api/pay/checkout).
 * A reference alone can no longer open a payment.
 */
export function POST() {
  return NextResponse.json({ error: "gone" }, { status: 410, headers: { "X-Robots-Tag": "noindex" } });
}
