"use client";

import { useEffect, useState } from "react";
import { DAY_LABEL, formatTime, getOpenStatus, type Hours } from "@/lib/hours";

// Computed on the client (Cabo time) so statically generated pages never show a stale state.
export function OpenStatus({ hours }: { hours: Hours }) {
  const [s, setS] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const update = () => {
      const o = getOpenStatus(hours);
      if (o.open) setS({ open: true, label: `Open now · closes ${formatTime(o.closesAt)}` });
      else if (o.opensAt) setS({ open: false, label: `Closed now · opens ${"today" in o && !o.today ? `${DAY_LABEL[o.day]} ` : ""}${formatTime(o.opensAt)}` });
      else setS({ open: false, label: "Closed" });
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [hours]);
  return <span aria-live="polite" className={`text-sm font-medium ${s?.open ? "text-brand" : "text-slate-500"}`}>{s?.label ?? " "}</span>;
}
