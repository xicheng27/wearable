import { Suspense } from "react";
import SearchResultsClient from "@/app/search/SearchResultsClient";

export const metadata = {
  title: "Browse Adaptive Clothing | Xi's",
  description:
    "Browse individual adaptive clothing pieces and filter by brand, accessibility need, feature, style, budget, size and availability.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-gray-500">
          Loading...
        </div>
      }
    >
      <SearchResultsClient />
    </Suspense>
  );
}
