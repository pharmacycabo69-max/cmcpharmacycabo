import Image from "next/image";
import Link from "next/link";
import { OpenStatus } from "@/components/OpenStatus";
import type { Location } from "@/lib/locations";

export function StoreCard({ l, priority = false }: { l: Location; priority?: boolean }) {
  const photo = l.photos[0];
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-brand">
      <Link href={`/locations/${l.slug}`} aria-label={`${l.gbpName}, ${l.addressLine}`} className="block aspect-[4/3] overflow-hidden bg-slate-100">
        <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(min-width: 1024px) 350px, (min-width: 640px) 50vw, 100vw" priority={priority} className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="font-semibold"><Link href={`/locations/${l.slug}`} className="hover:text-brand">{l.gbpName}</Link></h3>
        <p className="text-sm text-slate-600">{l.addressLine}</p>
        <p className="mt-auto pt-2"><OpenStatus hours={l.hours} /></p>
      </div>
    </article>
  );
}
