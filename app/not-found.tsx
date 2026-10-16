import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-muted">The page you are looking for doesn’t exist.</p>
      <Link href="/" className="btn btn-mint mt-6">Back home</Link>
    </div>
  );
}
