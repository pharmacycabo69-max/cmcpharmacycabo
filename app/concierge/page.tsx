import type { Metadata } from "next";
import Link from "next/link";
import { getBookable } from "@/lib/booking";
import { authReady, getSession } from "@/lib/server/auth";
import { channelReady } from "@/lib/server/notify";
import { payLinksReady, paymentsEnabled } from "@/lib/server/paylink";
import { listRecords, type Status } from "@/lib/server/records";
import { storeReady } from "@/lib/server/store";

export const metadata: Metadata = { title: "Concierge", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const FILTERS: (Status | "all")[] = ["all", "received", "in_review", "quote_sent", "confirmed", "payment_link_sent", "paid", "completed", "cancelled"];

/** Concierge console (V5 §12): login, request list, unattended alerts and integration status. */
export default async function Concierge({ searchParams }: { searchParams: Promise<{ s?: string; error?: string }> }) {
  const { s = "all", error } = await searchParams;
  const session = await getSession();
  if (!session) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <h1 className="font-display text-2xl font-bold text-navy">CMC concierge</h1>
        {!authReady() && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Not configured: set SESSION_SECRET and CONCIERGE_KEY in Vercel.</p>}
        {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error === "wait" ? "Too many attempts. Try again in a few minutes." : "Access denied."}</p>}
        <form method="post" action="/api/concierge/login" className="mt-6 space-y-3">
          <div><label htmlFor="c-name" className="text-sm font-medium">Your name</label><input id="c-name" name="name" autoComplete="name" className="field mt-1" required /></div>
          <div><label htmlFor="c-key" className="text-sm font-medium">Staff key</label><input id="c-key" name="key" type="password" autoComplete="current-password" className="field mt-1" required /></div>
          <button className="btn btn-primary w-full">Sign in</button>
        </form>
      </div>
    );
  }
  const status = FILTERS.includes(s as Status) && s !== "all" ? (s as Status) : undefined;
  const recs = storeReady() ? await listRecords(status, 150).catch(() => []) : [];
  const now = Date.now();
  const unattended = recs.filter((r) => r.status === "received" && now - Date.parse(r.createdAt) > 30 * 60_000);
  const checks: [string, boolean][] = [["Storage", storeReady()], ["CRM webhook", channelReady.crm()], ["Email", channelReady.email()], ["Internal WhatsApp", channelReady.whatsapp()], ["Payment links", payLinksReady()], ["Online payments", paymentsEnabled()]];
  return (
    <div className="mx-auto max-w-[76rem] px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-navy">Requests · CMC Pharmacy</h1>
        <form method="post" action="/api/concierge/login"><input type="hidden" name="logout" value="1" /><button className="text-sm text-slate-600 underline">Sign out ({session.name}, {session.role})</button></form>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2 text-xs">{checks.map(([k, ok]) => <li key={k} className={`rounded-full px-3 py-1 font-semibold ${ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>{ok ? "✓" : "✗"} {k}</li>)}</ul>
      {unattended.length > 0 && <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">{unattended.length} request(s) waiting more than 30 minutes: {unattended.map((r) => r.folio).join(", ")}</p>}
      <nav className="mt-5 flex flex-wrap gap-2" aria-label="Filter by status">{FILTERS.map((f) => <Link key={f} href={`/concierge?s=${f}`} className={`rounded-full px-3 py-1.5 text-sm ${s === f ? "bg-navy text-white" : "bg-surface text-navy"}`}>{f.replace(/_/g, " ")}</Link>)}</nav>
      <div className="mt-5 overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-slate-500"><tr><th className="p-3">Folio</th><th className="p-3">Type</th><th className="p-3">Customer</th><th className="p-3">When</th><th className="p-3">Status</th><th className="p-3">Amount</th></tr></thead>
          <tbody className="divide-y divide-line">
            {recs.map((r) => (
              <tr key={r.folio} className="hover:bg-surface">
                <td className="p-3 font-mono"><Link href={`/concierge/r/${r.folio}`} className="text-brand underline">{r.folio}</Link></td>
                <td className="p-3">{r.kind === "pharmacy" ? `Pharmacy · ${r.items?.length ?? 0} items` : getBookable(r.service?.id ?? "")?.name ?? r.service?.id}</td>
                <td className="p-3">{r.contact.name}</td>
                <td className="p-3">{new Date(r.createdAt).toLocaleString("en-US", { timeZone: "America/Mazatlan", dateStyle: "short", timeStyle: "short" })}</td>
                <td className="p-3">{r.status.replace(/_/g, " ")}</td>
                <td className="p-3">{r.expectedCents ? `$${(r.expectedCents / 100).toFixed(2)}` : "—"}</td>
              </tr>
            ))}
            {recs.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-slate-500">{storeReady() ? "No requests." : "Storage not configured."}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
