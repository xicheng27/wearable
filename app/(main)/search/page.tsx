import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";

export const metadata = {
  title: "Browse Brands – Xi's",
  description:
    "Browse all adaptive fashion brands. Filter by disability type, clothing type, adaptive features and shipping location.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div
            className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-primary-600"
            role="status"
            aria-label="Loading"
          />
        </div>
      }
    >
      <SearchResultsClient />
    </Suspense>
  );
}
