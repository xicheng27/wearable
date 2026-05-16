import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-7xl mb-6" aria-hidden="true">👗</p>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Page not found</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        We couldn&apos;t find what you were looking for. Try searching for adaptive brands instead.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/" className="btn-primary">
          Go home
        </Link>
        <Link href="/search" className="btn-outline">
          Browse brands
        </Link>
      </div>
    </div>
  );
}
