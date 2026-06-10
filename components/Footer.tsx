import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500">
                <span className="text-base font-black italic text-white">Xi</span>
                <span className="absolute bottom-1 right-1 text-[8px] font-bold text-white/70">
                  &apos;s
                </span>
              </div>
              <span className="text-xl font-black text-white">
                Xi<span className="text-primary-400">&apos;s</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Compare individual adaptive clothing pieces by style, function and
              accessibility need.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Shop clothing
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/search" className="hover:text-primary-400">Browse all items</Link></li>
              <li><Link href="/categories/shoes" className="hover:text-primary-400">Adaptive shoes</Link></li>
              <li><Link href="/categories/jeans" className="hover:text-primary-400">Wheelchair jeans</Link></li>
              <li><Link href="/categories/formalwear" className="hover:text-primary-400">Formal adaptive wear</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Shop by need
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/search?seated=true" className="hover:text-primary-400">Seated fit</Link></li>
              <li><Link href="/search?oneHanded=true" className="hover:text-primary-400">One-handed dressing</Link></li>
              <li><Link href="/search?sensory=true" className="hover:text-primary-400">Sensory-friendly</Link></li>
              <li><Link href="/search?disability=Orthotics" className="hover:text-primary-400">Orthotics and AFOs</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              About
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/" className="hover:text-primary-400">Our mission</Link></li>
              <li><Link href="/" className="hover:text-primary-400">Submit an item</Link></li>
              <li><Link href="/" className="hover:text-primary-400">Accessibility statement</Link></li>
              <li><Link href="/" className="hover:text-primary-400">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Xi&apos;s. Adaptive fashion discovery for everyone.</p>
          <p>Built with care for the disability community.</p>
        </div>
      </div>
    </footer>
  );
}
