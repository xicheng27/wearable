import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";

export const metadata = {
  title: "Browse Brands – Xi's",
  description:
    "Browse all adaptive fashion brands. Filter by disability type, clothing type, adaptive features and shipping location.",
};

function SearchSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-gray-50" aria-label="Loading brands" role="status">
      <div className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 rounded-lg bg-gray-100" />
          <div className="mt-5 h-14 max-w-xl rounded-full bg-gray-100" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <div className="hidden w-60 flex-shrink-0 space-y-4 lg:block">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 rounded-lg bg-gray-100" />
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-6 h-5 w-32 rounded bg-gray-100" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                  <div className="h-32 bg-gray-50" />
                  <div className="space-y-3 p-6">
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                    <div className="h-3 w-full rounded bg-gray-50" />
                    <div className="h-3 w-1/2 rounded bg-gray-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchResultsClient />
    </Suspense>
  );
}
