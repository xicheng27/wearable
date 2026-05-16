import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="relative w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-sm group-hover:bg-primary-400 transition-colors overflow-hidden">
                <span className="text-white font-black text-base italic leading-none tracking-tight select-none" style={{ letterSpacing: "-0.03em" }}>
                  Xi
                </span>
                <span className="absolute bottom-1 right-1.5 text-white/60 font-bold text-[9px] leading-none select-none" aria-hidden="true">
                  ʼs
                </span>
              </div>
              <span className="text-xl font-black text-white tracking-tight" style={{ letterSpacing: "-0.04em" }}>
                Xi<span className="text-primary-400">&apos;s</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Helping everyone find clothing that works for their body — with dignity, style, and ease.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/search" className="hover:text-primary-400 transition-colors">Browse All Brands</Link></li>
              <li><Link href="/search?disability=wheelchair" className="hover:text-primary-400 transition-colors">Wheelchair Clothing</Link></li>
              <li><Link href="/search?feature=sensory" className="hover:text-primary-400 transition-colors">Sensory-Friendly</Link></li>
              <li><Link href="/search?clothing=footwear" className="hover:text-primary-400 transition-colors">Adaptive Footwear</Link></li>
              <li><Link href="/search?clothing=formal" className="hover:text-primary-400 transition-colors">Formal Wear</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Disability Types</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/search?disability=mobility" className="hover:text-primary-400 transition-colors">Mobility Impairments</Link></li>
              <li><Link href="/search?disability=limb" className="hover:text-primary-400 transition-colors">Limb Differences</Link></li>
              <li><Link href="/search?disability=neurological" className="hover:text-primary-400 transition-colors">Neurological Conditions</Link></li>
              <li><Link href="/search?disability=sensory" className="hover:text-primary-400 transition-colors">Sensory Processing</Link></li>
              <li><Link href="/search?disability=stroke" className="hover:text-primary-400 transition-colors">Stroke Survivors</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">About</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-primary-400 transition-colors">Our Mission</Link></li>
              <li><Link href="/" className="hover:text-primary-400 transition-colors">Submit a Brand</Link></li>
              <li><Link href="/" className="hover:text-primary-400 transition-colors">Accessibility Statement</Link></li>
              <li><Link href="/" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2025 Xi&apos;s. Empowering adaptive fashion for everyone.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-primary-400">♥</span> for the disability community
          </p>
        </div>
      </div>
    </footer>
  );
}
