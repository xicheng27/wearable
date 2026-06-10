import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            "radial-gradient(55% 100% at 50% 0%, rgba(29, 158, 117, 0.07) 0%, rgba(29, 158, 117, 0) 100%)",
        }}
        aria-hidden="true"
      />

      <main className="relative flex w-full max-w-xs flex-col items-center text-center">
        <span
          className="animate-fade-up flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 shadow-md shadow-primary-600/20"
          aria-hidden="true"
        >
          <span className="select-none text-xl font-bold text-white">X</span>
        </span>

        <h1
          className="animate-fade-up mt-6 text-4xl font-bold tracking-tight text-gray-900"
          style={{ animationDelay: "60ms" }}
        >
          Xi<span className="text-primary-600">&apos;s</span>
        </h1>

        <p
          className="animate-fade-up mt-3 text-base leading-relaxed text-gray-500"
          style={{ animationDelay: "120ms" }}
        >
          Adaptive fashion that works for your body.
        </p>

        <div
          className="animate-fade-up mt-10 flex w-full flex-col gap-3"
          style={{ animationDelay: "200ms" }}
        >
          <Link href="/quiz" className="btn-primary w-full py-3.5">
            Create account
          </Link>
          <Link href="/signin" className="btn-secondary w-full py-3.5">
            Sign in
          </Link>
          <Link
            href="/quiz"
            className="mt-1 rounded-full py-2 text-sm font-medium text-gray-400 transition-colors duration-200 hover:text-gray-600"
          >
            Continue as guest
          </Link>
        </div>
      </main>

      <p
        className="animate-fade-up absolute bottom-6 text-xs text-gray-300"
        style={{ animationDelay: "300ms" }}
      >
        © 2025 Xi&apos;s · Made for the disability community
      </p>
    </div>
  );
}
