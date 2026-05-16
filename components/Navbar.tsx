"use client";

import Link from "next/link";
import { useState } from "react";
import SearchBar from "./SearchBar";

function XisLogo({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 flex-shrink-0 group"
      aria-label="Xi's home"
    >
      <div className="relative w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-sm group-hover:bg-primary-600 transition-colors overflow-hidden">
        <span
          className="text-white font-black text-base italic leading-none tracking-tight select-none"
          style={{ fontStyle: "italic", letterSpacing: "-0.03em" }}
        >
          Xi
        </span>
        <span
          className="absolute bottom-1 right-1.5 text-white/60 font-bold text-[9px] leading-none select-none"
          aria-hidden="true"
        >
          ʼs
        </span>
      </div>
      <span
        className={`text-xl font-black tracking-tight transition-colors ${
          dark
            ? "text-white group-hover:text-primary-200"
            : "text-gray-900 group-hover:text-primary-600"
        }`}
        style={{ letterSpacing: "-0.04em" }}
      >
        Xi<span className="text-primary-500">&apos;s</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <XisLogo />

          <div className="hidden md:flex flex-1 max-w-md">
            <SearchBar compact />
          </div>

          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link
              href="/search"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              Browse Brands
            </Link>
            <Link
              href="/search?feature=sensory-friendly"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              Sensory
            </Link>
            <Link
              href="/search?disability=wheelchair"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              Wheelchair
            </Link>
            <Link href="/search" className="btn-primary text-sm py-2 px-4">
              Find My Fit
            </Link>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <SearchBar compact />
            <nav className="flex flex-col gap-2">
              <Link href="/search" className="text-sm font-medium text-gray-700 py-2 hover:text-primary-600" onClick={() => setMenuOpen(false)}>
                Browse Brands
              </Link>
              <Link href="/search?feature=sensory-friendly" className="text-sm font-medium text-gray-700 py-2 hover:text-primary-600" onClick={() => setMenuOpen(false)}>
                Sensory Clothing
              </Link>
              <Link href="/search?disability=wheelchair" className="text-sm font-medium text-gray-700 py-2 hover:text-primary-600" onClick={() => setMenuOpen(false)}>
                Wheelchair Clothing
              </Link>
              <Link href="/search" className="btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>
                Find My Fit
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
