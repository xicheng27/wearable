"use client";

import Link from "next/link";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";

function XisLogo() {
  return (
    <Link
      href="/"
      className="group flex flex-shrink-0 items-center gap-2.5"
      aria-label="Xi's home"
    >
      <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-primary-500 shadow-sm transition-colors group-hover:bg-primary-600">
        <span className="select-none text-base font-black italic leading-none tracking-tight text-white">
          Xi
        </span>
        <span
          className="absolute bottom-1 right-1 text-[8px] font-bold leading-none text-white/70"
          aria-hidden="true"
        >
          &apos;s
        </span>
      </div>
      <span className="text-xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-primary-700">
        Xi<span className="text-primary-500">&apos;s</span>
      </span>
    </Link>
  );
}

const navItems = [
  { href: "/search", label: "Browse Clothing" },
  { href: "/categories/shoes", label: "Adaptive Shoes" },
  { href: "/search?sensory=true", label: "Sensory Picks" },
  { href: "/search?seated=true", label: "Seated Fit" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <XisLogo />

          <div className="hidden max-w-sm flex-1 md:flex">
            <SearchBar compact />
          </div>

          <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-gray-600 transition-colors hover:text-primary-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
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
          <div className="space-y-3 border-t border-gray-100 py-4 lg:hidden">
            <SearchBar compact />
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2 text-sm font-semibold text-gray-700 hover:text-primary-700"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
