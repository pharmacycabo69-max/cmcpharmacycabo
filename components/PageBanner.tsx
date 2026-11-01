import Image from "next/image";

const PHOTOS = {
  arco: { src: "/images/cabo/el-arco-sunset.jpg", alt: "El Arco rock formation at sunset in Cabo San Lucas", w: 1920, h: 1280 },
  bay: { src: "/images/cabo/cabo-san-lucas-bay.jpg", alt: "Cabo San Lucas bay and Land’s End rocks at golden hour", w: 1920, h: 1151 },
};
export const photo = (k: keyof typeof PHOTOS) => PHOTOS[k];

/** Decorative full-width photo strip shown above the page content. */
export function PageBanner({ which = "bay", priority = true }: { which?: keyof typeof PHOTOS; priority?: boolean }) {
  const p = PHOTOS[which];
  return (
    <div className="relative h-44 w-full overflow-hidden md:h-60">
      <Image src={p.src} alt={p.alt} fill priority={priority} sizes="100vw" className="object-cover object-[50%_65%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
    </div>
  );
}
