import { NextResponse } from "next/server";

/**
 * HOTFIX (26 Nov 2026): online IV deposits are paused. Nothing is charged before our team confirms the time,
 * and no personal or health data is sent to the payment processor. Requests go to the team on WhatsApp.
 */
export function POST(req: Request) {
  return NextResponse.redirect(new URL("/iv-therapy#drips", req.url), 303);
}
