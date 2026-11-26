import { redirect } from "next/navigation";

/** Retired (V5): payment pages per service were replaced by signed links (/pay?t=…). Book first. */
export default async function OldPay({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  redirect(`/book?service=${encodeURIComponent(service)}`);
}
