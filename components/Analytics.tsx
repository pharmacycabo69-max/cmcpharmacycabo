"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

// GA4 measurement IDs are public (they ship in the page HTML); env var overrides.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || (process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "G-7CR5LW3KJS" : undefined);

/**
 * Health privacy (V4 §11): Analytics never receives which medicine or search a visitor looked at.
 * Query strings (search terms, WhatsApp texts) are dropped and product URLs are reported as "/product/".
 * Page views are sent manually with that clean location (send_page_view: false).
 * Owner action pending: turn off "page changes based on browser history" in GA4 enhanced measurement,
 * which would otherwise report the raw URL on client-side navigation.
 */
const cleanPath = (p: string) => (p.startsWith("/product/") ? "/product/" : p);
const cleanLocation = () => `${location.origin}${cleanPath(location.pathname)}`;

/**
 * GA4 + conversion events for the ways customers actually order:
 * WhatsApp (whatsapp_click), phone (phone_click) and email (email_click).
 * Uses NEXT_PUBLIC_GA_ID if set, otherwise the live property on Vercel production only.
 */
export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    // The first page view is sent by the init script below; this one covers client-side navigation
    if (first.current) { first.current = false; return; }
    if (!GA_ID || !window.gtag) return;
    const page_location = cleanLocation();
    window.gtag("set", { page_location });
    window.gtag("event", "page_view", { page_location, page_path: cleanPath(location.pathname) });
  }, [pathname]);

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
        page_path: cleanPath(location.pathname),
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
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false,page_location:location.origin+(location.pathname.indexOf('/product/')===0?'/product/':location.pathname)});gtag('event','page_view');`}
      </Script>
    </>
  );
}
