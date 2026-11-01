"use client";

import { useEffect, useRef, useState } from "react";
import { BookingWizard } from "@/components/BookingWizard";

/** "Book this drip" button + the drip's own booking modal (native <dialog>: focus trap, Esc, backdrop). */
export function BookDripButton({ id, label = "Book this drip", className = "btn btn-primary" }: { id: string; label?: string; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => { setOpen(true); ref.current?.showModal(); document.body.style.overflow = "hidden"; };
  const close = () => ref.current?.close();

  useEffect(() => {
    const el = ref.current;
    const onClose = () => {
      setOpen(false); document.body.style.overflow = "";
      if (location.hash === `#book-${id}`) history.replaceState(null, "", location.pathname + location.search);
    };
    const onHash = () => { if (location.hash === `#book-${id}` && !el?.open) show(); };
    el?.addEventListener("close", onClose);
    window.addEventListener("hashchange", onHash);
    onHash(); // deep link: /iv-therapy#book-<id>
    return () => { el?.removeEventListener("close", onClose); window.removeEventListener("hashchange", onHash); document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <button type="button" onClick={show} className={className}>{label}</button>
      <dialog
        ref={ref}
        aria-label="Book IV therapy online"
        onClick={(e) => { if (e.target === ref.current) close(); }} // click on the backdrop
        className="m-auto max-h-[94vh] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-slate-900/60 max-sm:mb-0 max-sm:mt-auto max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none"
      >
        {open && <BookingWizard drip={id} onClose={close} />}
      </dialog>
    </>
  );
}
