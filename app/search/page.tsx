import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";

export const metadata = {
  title: "Search Brands – WearAble",
  description:
    "Browse all adaptive fashion brands. Filter by disability type, clothing type, adaptive features and shipping location.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading…
        </div>
      }
    >
      <SearchResultsClient />
    </Suspense>
  );
}
