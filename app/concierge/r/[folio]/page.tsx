import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getBookable, MODE_LABEL } from "@/lib/booking";
import { getSession } from "@/lib/server/auth";
import { paymentsEnabled } from "@/lib/server/paylink";
import { getRecord } from "@/lib/server/records";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Concierge record", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const money = (c?: number) => (typeof c === "number" ? `$${(c / 100).toFixed(2)}` : "—");

export default async function RecordPage({ params, searchParams }: { params: Promise<{ folio: string }>; searchParams: Promise<{ link?: string; msg?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/concierge");
  const { folio } = await params;
  const { link, msg } = await searchParams;
  const r = await getRecord(folio).catch(() => null);
  if (!r) notFound();
  const svc = r.service ? getBookable(r.service.id) : undefined;
  const subtotal = r.items?.reduce((s, i) => s + i.unitCents * i.qty, 0) ?? 0;
  const canPayOnline = r.kind === "booking" && !!r.expectedCents && ["confirmed", "payment_link_sent"].includes(r.status);
  const Action = ({ action, label, extra, danger }: { action: string; label: string; extra?: React.ReactNode; danger?: boolean }) => (
    <form method="post" action="/api/concierge/action" className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="folio" value={r.folio} /><input type="hidden" name="action" value={action} />
      {extra}
      <button className={`btn !py-2 text-sm ${danger ? "bg-red-600 text-white" : "btn-outline"}`}>{label}</button>
    </form>
  );
  const wa = `https://wa.me/${r.contact.phone.replace(/\D/g, "")}`;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/concierge" className="text-sm text-brand">← All requests</Link>
      <h1 className="mt-3 font-mono text-2xl font-bold text-navy">{r.folio}</h1>
      <p className="text-sm text-slate-600">{r.brand} · {r.kind} · status <b>{r.status.replace(/_/g, " ")}</b> · created {new Date(r.createdAt).toLocaleString("en-US", { timeZone: "America/Mazatlan" })} · lang {r.lang}</p>
      {msg && <p role="status" className="mt-3 rounded-lg bg-surface p-3 text-sm">{msg}</p>}
      {link && <div className="mt-3 rounded-xl border border-brand bg-brand-soft p-4 text-sm"><p className="font-semibold">Payment link (send it on WhatsApp):</p><p className="mt-1 break-all font-mono">{link}</p></div>}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-semibold text-navy">Customer</h2>
          <p className="mt-2 text-sm">{r.contact.name}<br />{r.contact.phone} · <a className="text-brand underline" href={wa} target="_blank" rel="noopener">WhatsApp</a>{r.contact.email && <><br />{r.contact.email}</>}</p>
          {r.delivery && <p className="mt-2 text-sm">{r.delivery.place}, {r.delivery.area}{r.delivery.window && <> · {r.delivery.window}</>}{r.delivery.instructions && <><br />Instructions: {r.delivery.instructions}</>}</p>}
        </section>
        <section className="card p-5">
          <h2 className="font-semibold text-navy">{r.kind === "pharmacy" ? "Products" : "Service"}</h2>
          {r.items && <ul className="mt-2 space-y-1 text-sm">{r.items.map((i) => <li key={i.id}>{i.qty} × {i.name} — {money(i.unitCents)} {i.rx && <b className="text-amber-800">℞</b>}</li>)}</ul>}
          {r.items && <p className="mt-2 text-sm">Catalog subtotal {money(subtotal)} · {subtotal >= SITE.freeDeliveryFrom * 100 ? "free delivery" : "delivery fee to confirm"}{r.rxAnswer && <> · prescription: {r.rxAnswer}</>}</p>}
          {r.notFound && <p className="mt-2 text-sm">Requested by name: {r.notFound}</p>}
          {r.service && <p className="mt-2 text-sm">{svc?.name}{r.service.option && ` — ${svc?.options?.find((o) => o.id === r.service!.option)?.name}`}<br />{MODE_LABEL[r.service.mode as keyof typeof MODE_LABEL]} · preferred {r.service.date} {r.service.time}{r.service.people && r.service.people > 1 ? ` · ${r.service.people} people` : ""}</p>}
          <p className="mt-2 text-sm">Expected amount: <b>{money(r.expectedCents)}</b>{r.deliveryFeeCents !== undefined && <> · delivery {money(r.deliveryFeeCents)}</>}</p>
          {r.payment && <p className="mt-2 text-sm">Payment: {r.payment.status} {money(r.payment.amountCents)} {r.payment.paymentIntent && <a className="text-brand underline" href={`https://dashboard.stripe.com/payments/${r.payment.paymentIntent}`} target="_blank" rel="noopener">Stripe</a>}</p>}
        </section>
      </div>

      <section className="card mt-6 space-y-4 p-5">
        <h2 className="font-semibold text-navy">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Action action="in_review" label="Mark in review" />
          <Action action="assign" label="Assign to me" />
        </div>
        <Action action="quote" label={r.kind === "pharmacy" ? "Save quote (total incl. delivery)" : "Save quote / amount"} extra={<><label className="text-xs">Amount USD<input name="amount" inputMode="decimal" className="field mt-1 w-32" defaultValue={r.expectedCents ? (r.expectedCents / 100).toFixed(2) : ""} /></label>{r.kind === "pharmacy" && <label className="text-xs">Delivery fee USD<input name="fee" inputMode="decimal" className="field mt-1 w-28" /></label>}</>} />
        <Action action="confirm" label="Confirm availability" extra={<><label className="text-xs">Date<input name="date" type="date" className="field mt-1" defaultValue={r.service?.date} /></label><label className="text-xs">Time<input name="time" type="time" className="field mt-1" /></label></>} />
        {r.kind === "booking" ? (
          <Action action="paylink" label={paymentsEnabled() ? "Create payment link" : "Payment links disabled"} extra={<label className="text-xs">Valid (hours)<select name="hours" className="field mt-1 w-24" defaultValue="24"><option>6</option><option>24</option><option>48</option><option>72</option></select></label>} />
        ) : <p className="text-xs text-slate-500">Pharmacy orders are not charged online: agree an authorized payment method with the customer and record it below.</p>}
        {!canPayOnline && r.kind === "booking" && <p className="text-xs text-slate-500">A payment link needs status “confirmed” and an amount.</p>}
        <div className="flex flex-wrap gap-3">
          <Action action="completed" label="Mark completed" extra={<input name="note" placeholder="Note (payment method, delivery…)" className="field w-72" />} />
          <Action action="cancelled" label="Cancel" danger extra={<input name="note" placeholder="Reason" className="field w-56" required />} />
          {session.role === "admin" && <Action action="refund_recorded" label="Record refund" danger extra={<input name="note" placeholder="Stripe refund id / amount" className="field w-56" required />} />}
        </div>
      </section>

      <section className="card mt-6 p-5">
        <h2 className="font-semibold text-navy">History</h2>
        <ol className="mt-3 space-y-1 text-sm">{r.events.map((e, i) => <li key={i}><span className="font-mono text-xs text-slate-500">{new Date(e.at).toLocaleString("en-US", { timeZone: "America/Mazatlan" })}</span> · {e.type} → {e.status} · {e.by}{e.note && ` · ${e.note}`}{e.amountCents !== undefined && ` · ${money(e.amountCents)}`}</li>)}</ol>
      </section>
    </div>
  );
}
