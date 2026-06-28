"use client";

import Link from "next/link";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Logo from "@/components/Logo";
import CurrencySelector from "@/components/CurrencySelector";
import CountrySelector from "@/components/CountrySelector";
import { useSavedItems } from "@/components/SavedItemsProvider";

const navItems = [
  { href: "/search", label: "Browse products" },
  { href: "/saved", label: "Saved items" },
  { href: "/how-it-works", label: "How it works" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { savedIds } = useSavedItems();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-ivory/95 shadow-[0_5px_20px_rgba(41,36,31,.05)] backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo size={38} />

          <div className="hidden max-w-sm flex-1 md:flex">
            <SearchBar compact />
          </div>

          <nav className="hidden items-center gap-5 xl:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-underline flex items-center gap-1.5 text-sm text-ink/70"
              >
                {item.label}
                {item.href === "/saved" && savedIds.length > 0 && (
                  <span className="rounded-full bg-primary-700 px-1.5 py-0.5 text-[11px] font-bold text-paper">
                    {savedIds.length}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <Link
            href="/quiz"
            className="btn-primary hidden whitespace-nowrap px-4 py-2 text-xs xl:inline-flex"
          >
            Find clothing for me
          </Link>
          <div className="hidden items-center gap-2 xl:flex">
            <CountrySelector />
            <CurrencySelector compact />
          </div>

          <button
            className="min-h-11 min-w-11 rounded-lg border border-ink/10 bg-paper p-2 text-ink hover:bg-sand/50 xl:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="space-y-3 border-t border-ink/10 py-4 xl:hidden">
            <SearchBar compact />
            <div className="flex items-center gap-2">
              <CountrySelector className="flex-1 justify-between" />
              <CurrencySelector className="rounded-xl border border-ink/10 bg-paper px-3 py-2" />
            </div>
            <Link
              href="/quiz"
              className="btn-primary flex w-full text-base"
              onClick={() => setMenuOpen(false)}
            >
              Find clothing for me
            </Link>
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-11 items-center gap-2 py-2 text-base font-semibold text-ink/75 hover:text-primary-700"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                  {item.href === "/saved" && savedIds.length > 0 && (
                    <span className="rounded-full bg-primary-700 px-2 py-0.5 text-xs font-bold text-paper">
                      {savedIds.length}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
