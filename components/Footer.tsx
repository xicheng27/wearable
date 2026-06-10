import Link from "next/link";
import Logo from "./Logo";

const columns = [
  {
    heading: "Explore",
    links: [
      { href: "/search", label: "Browse all brands" },
      { href: "/map", label: "Stores & services map" },
      { href: "/quiz", label: "Find my fit quiz" },
      { href: "/search?feature=sensory", label: "Sensory-friendly" },
      { href: "/search?clothing=footwear", label: "Adaptive footwear" },
    ],
  },
  {
    heading: "Disability types",
    links: [
      { href: "/search?disability=mobility", label: "Mobility impairments" },
      { href: "/search?disability=limb", label: "Limb differences" },
      { href: "/search?disability=neurological", label: "Neurological conditions" },
      { href: "/search?disability=sensory", label: "Sensory processing" },
      { href: "/search?disability=stroke", label: "Stroke survivors" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/", label: "Our mission" },
      { href: "/", label: "Submit a brand" },
      { href: "/", label: "Accessibility statement" },
      { href: "/", label: "Privacy policy" },
      { href: "/", label: "Contact us" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
              Helping everyone find clothing that works for their body — with
              dignity, style, and ease.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 transition-colors duration-200 hover:text-primary-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-200/70 pt-8 text-sm text-gray-400 sm:flex-row">
          <p>© 2025 Xi&apos;s. Empowering adaptive fashion for everyone.</p>
          <p>
            Made with <span className="text-primary-600">♥</span> for the
            disability community
          </p>
        </div>
      </div>
    </footer>
  );
}
