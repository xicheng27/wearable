import Link from "next/link";
import Logo from "@/components/Logo";

const groups = [
  ["Browse", [["All clothing", "/search"], ["Adaptive shoes", "/categories/shoes"], ["Seated-fit pants", "/search?seated=true"], ["Formal wear", "/categories/formalwear"]]],
  ["Find by need", [["One-handed dressing", "/search?oneHanded=true"], ["Sensory-friendly", "/search?sensory=true"], ["Orthotics and AFOs", "/search?disability=Orthotics"], ["Find my match", "/quiz"]]],
  ["Xi's", [["Our approach", "/"], ["Accessibility", "/"], ["Submit an item", "/"], ["Contact", "/"]]],
];

export default function Footer() {
  return (
    <footer className="paper-texture border-t border-paper/10 bg-[#29241F] text-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_2fr]">
          <div>
            <Logo dark size={44} />
            <p className="mt-5 max-w-sm font-display text-2xl leading-snug text-paper/90">
              Better clothing discovery, shaped around real bodies and real lives.
            </p>
            <p className="mt-5 font-hand text-xs text-sand">Made with care, checked with curiosity.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.map(([title, links]) => (
              <div key={title as string}>
                <h2 className="font-display text-lg font-semibold text-sand">{title as string}</h2>
                <ul className="mt-4 space-y-3 text-sm text-paper/65">
                  {(links as string[][]).map(([label, href]) => (
                    <li key={label}><Link href={href} className="transition-colors hover:text-paper hover:underline hover:underline-offset-4">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-paper/15 pt-7 text-xs text-paper/45 sm:flex-row sm:justify-between">
          <p>&copy; 2026 Xi&apos;s. Adaptive fashion discovery.</p>
          <p>Comfort, dignity, independence, style.</p>
        </div>
      </div>
    </footer>
  );
}
