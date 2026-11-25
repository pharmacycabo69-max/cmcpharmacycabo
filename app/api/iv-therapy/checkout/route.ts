import { NextResponse } from "next/server";

/**
 * Retired: IV bookings no longer pay before the time is confirmed (owner, 25 Nov 2026 / V4 §8).
 * Old forms or bookmarks are sent to the shared booking flow; payment happens at /pay/[service] after confirmation.
 */
export function POST(req: Request) {
  return NextResponse.redirect(new URL("/book?service=iv-therapy", req.url), 303);
}
