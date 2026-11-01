"use client";

import { useEffect, useState } from "react";
import { IV } from "@/lib/ivtherapy";

const TEXT: Record<string, string> = {
  invalid: "Something in your booking didn’t validate. Please try again.",
  config: "Online payment is temporarily unavailable.",
  stripe: "We couldn’t start the payment. Please try again.",
};

/** Shows the reason when /api/iv-therapy/checkout bounces back with ?error= (keeps the page static). */
export function BookingError() {
  const [code, setCode] = useState("");
  useEffect(() => setCode(new URLSearchParams(location.search).get("error") ?? ""), []);
  if (!code) return null;
  return (
    <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
      {TEXT[code] ?? TEXT.invalid} Pick your drip and try again, or <a className="font-semibold underline" href={`https://wa.me/${IV.whatsapp}`}>send your request on WhatsApp</a>.
    </p>
  );
}
