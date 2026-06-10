"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  compact?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

export default function SearchBar({
  compact = false,
  defaultValue = "",
  placeholder = "Search adaptive clothing, features, disabilities…",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex w-full items-center"
      role="search"
      aria-label="Search adaptive clothing"
    >
      <span
        className={`pointer-events-none absolute text-gray-400 ${compact ? "left-3.5" : "left-5"}`}
        aria-hidden="true"
      >
        <svg
          className={compact ? "h-4 w-4" : "h-5 w-5"}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </span>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={compact ? "Search brands…" : placeholder}
        className={`w-full rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 transition-shadow duration-200 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 ${
          compact
            ? "h-10 pl-10 pr-4 text-sm"
            : "h-14 pl-12 pr-28 text-base shadow-sm hover:shadow-md focus:shadow-md sm:h-16 sm:pl-14 sm:pr-32"
        }`}
        aria-label="Search query"
      />
      {!compact && (
        <button
          type="submit"
          className="absolute right-2 inline-flex h-10 items-center justify-center rounded-full bg-primary-600 px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.97] sm:h-12 sm:px-7"
        >
          Search
        </button>
      )}
    </form>
  );
}
