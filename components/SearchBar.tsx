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
      className={`flex w-full ${compact ? "h-9" : "h-14"}`}
      role="search"
      aria-label="Search adaptive clothing"
    >
      <div className="relative flex-1">
        <div
          className={`absolute inset-y-0 left-0 flex items-center pointer-events-none ${
            compact ? "pl-3" : "pl-4"
          }`}
          aria-hidden="true"
        >
          <svg
            className={`text-gray-400 ${compact ? "w-4 h-4" : "w-5 h-5"}`}
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
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={compact ? "Search brands…" : placeholder}
          className={`w-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent placeholder-gray-400 text-gray-900 ${
            compact
              ? "pl-9 pr-3 text-sm rounded-l-xl h-9"
              : "pl-12 pr-4 text-base rounded-l-2xl h-14"
          }`}
          aria-label="Search query"
        />
      </div>
      <button
        type="submit"
        className={`flex-shrink-0 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
          compact
            ? "px-4 text-sm rounded-r-xl h-9"
            : "px-8 text-base rounded-r-2xl h-14"
        }`}
      >
        {compact ? "Go" : "Search"}
      </button>
    </form>
  );
}
