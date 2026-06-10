"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  compact?: boolean;
  defaultValue?: string;
  placeholder?: string;
  basePath?: string;
}

export default function SearchBar({
  compact = false,
  defaultValue = "",
  placeholder = "Search individual adaptive clothing items...",
  basePath = "/search",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full ${compact ? "h-9" : "h-14"}`}
      role="search"
      aria-label="Search adaptive clothing items"
    >
      <div className="relative flex-1">
        <svg
          className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
            compact ? "left-3 h-4 w-4" : "left-4 h-5 w-5"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={compact ? "Search clothing..." : placeholder}
          className={`h-full w-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-400 ${
            compact
              ? "rounded-l-xl pl-9 pr-3 text-sm"
              : "rounded-l-2xl pl-12 pr-4 text-base"
          }`}
          aria-label="Search query"
        />
      </div>
      <button
        type="submit"
        className={`flex-shrink-0 bg-primary-500 font-semibold text-white transition-colors hover:bg-primary-600 ${
          compact
            ? "rounded-r-xl px-4 text-sm"
            : "rounded-r-2xl px-8 text-base"
        }`}
      >
        {compact ? "Go" : "Search"}
      </button>
    </form>
  );
}
