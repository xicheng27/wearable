"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import PassportMatchBadge from "@/components/PassportMatchBadge";
import { usePassport } from "@/components/PassportProvider";
import { useSavedItems } from "@/components/SavedItemsProvider";
import { getProductById } from "@/data/products";

export default function SavedClient() {
  const { savedIds } = useSavedItems();
  const { passport, hydrated } = usePassport();
  const savedProducts = savedIds
    .map((id) => getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <div className="min-h-screen bg-ivory">
      <header className="paper-texture border-b border-ink/10 bg-paper py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Your shortlist</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            Saved items
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ink/68">
            Pieces you&apos;ve tapped the heart on, kept on this device so you can
            compare them later.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {savedProducts.length === 0 ? (
          <div className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] px-6 py-16 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Nothing saved yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/60">
              Tap the heart icon on any product to keep it here for later.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/quiz" className="btn-primary">
                Start quiz
              </Link>
              <Link href="/search" className="btn-secondary">
                Browse all clothing
              </Link>
            </div>
          </div>
        ) : (
          <>
            {hydrated && passport && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-200 bg-paper px-5 py-4">
                <p className="text-sm leading-6 text-ink/70">
                  Each saved item is checked against your{" "}
                  <span className="font-bold text-ink">Adaptive Fit Passport</span>{" "}
                  so you can see at a glance what still fits your needs.
                </p>
                <Link
                  href="/passport"
                  className="link-underline text-sm font-semibold text-primary-800"
                >
                  View / edit passport
                </Link>
              </div>
            )}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {savedProducts.map((product) => (
                <div key={product.id} className="flex flex-col">
                  <PassportMatchBadge product={product} />
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
