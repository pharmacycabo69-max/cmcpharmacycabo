"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

// GA4 measurement IDs are public (they ship in the page HTML); env var overrides.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || (process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "G-7CR5LW3KJS" : undefined);

/**
 * GA4 + conversion events for the ways customers actually order:
 * WhatsApp (whatsapp_click), phone (phone_click) and email (email_click).
 * Uses NEXT_PUBLIC_GA_ID if set, otherwise the live property on Vercel production only.
 */
export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || !window.gtag) return;
      const href = a.getAttribute("href") ?? "";
      const event =
        /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href) ? "whatsapp_click"
        : href.startsWith("tel:") ? "phone_click"
        : href.startsWith("mailto:") ? "email_click"
        : null;
      if (!event) return;
      window.gtag("event", event, {
        link_url: href.split("?")[0],
        link_text: (a.textContent ?? "").trim().slice(0, 100),
        page_path: location.pathname,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
