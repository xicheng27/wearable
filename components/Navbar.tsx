"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";

const navLinks = [
  { href: "/search", label: "Browse clothing" },
  { href: "/brands", label: "Brands" },
  { href: "/map", label: "Map" },
  { href: "/signin", label: "Sign in" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />

          <div className="hidden max-w-sm flex-1 md:flex">
            <SearchBar compact />
          </div>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quiz"
              className="ml-2 inline-flex items-center rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.98]"
            >
              Find my fit
            </Link>
          </nav>

          <button
            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
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
          <div className="animate-fade-in space-y-4 border-t border-gray-100 py-4 md:hidden">
            <SearchBar compact />
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/quiz"
                className="btn-primary mt-2 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Find my fit
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
