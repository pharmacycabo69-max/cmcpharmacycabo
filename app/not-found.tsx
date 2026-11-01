import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you are looking for doesn’t exist or has moved.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="btn btn-primary">Back home</Link>
        <Link href="/shop" className="btn btn-outline">Browse the shop</Link>
      </div>
    </div>
  );
}
