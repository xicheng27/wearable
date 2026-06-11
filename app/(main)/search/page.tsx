import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export const metadata = {
  title: "Browse Adaptive Clothing – Xi's",
  description:
    "Shop individual adaptive clothing items from every brand in one place — magnetic shirts, seated-fit jeans, easy-entry shoes and more.",
};

function BrowseSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-gray-50" aria-label="Loading items" role="status">
      <div className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-72 rounded-lg bg-gray-100" />
          <div className="mt-5 h-14 max-w-xl rounded-full bg-gray-100" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <div className="hidden w-60 flex-shrink-0 space-y-4 lg:block">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 rounded-lg bg-gray-100" />
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-6 h-5 w-32 rounded bg-gray-100" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                  <div className="aspect-[4/3] bg-gray-50" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-1/3 rounded bg-gray-100" />
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
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

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowseSkeleton />}>
      <ProductsClient />
    </Suspense>
  );
}
