import Link from "next/link";

/** "Book this drip": opens the shared booking flow with the drip preselected (pay only after confirmation). */
export function BookDripButton({ id, label = "Book this drip", className = "btn btn-primary" }: { id: string; label?: string; className?: string }) {
  const href = id === "nad-performance" ? "/book?service=nad" : `/book?service=iv-therapy&option=${encodeURIComponent(id)}`;
  return <Link href={href} className={className}>{label}</Link>;
}
