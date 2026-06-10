import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="animate-fade-up text-6xl" aria-hidden="true">
        👗
      </p>
      <h1 className="animate-fade-up mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl" style={{ animationDelay: "60ms" }}>
        Page not found
      </h1>
      <p className="animate-fade-up mt-3 max-w-md text-base text-gray-500" style={{ animationDelay: "120ms" }}>
        We couldn&apos;t find what you were looking for. Try searching for
        adaptive brands instead.
      </p>
      <div className="animate-fade-up mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "180ms" }}>
        <Link href="/" className="btn-primary">
          Go home
        </Link>
        <Link href="/search" className="btn-secondary">
          Browse brands
        </Link>
      </div>
    </div>
  );
}
