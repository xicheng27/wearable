"use client";

import { useEffect, useMemo, useState } from "react";
import Stars from "./Stars";
import { getSeedReviews, Review } from "@/data/reviews";

const storageKey = (productId: string) => `xis-reviews-${productId}`;

function loadLocal(productId: string): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(productId));
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

export default function Reviews({ productId }: { productId: string }) {
  const seeded = useMemo(() => getSeedReviews(productId), [productId]);
  const [local, setLocal] = useState<Review[]>([]);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLocal(loadLocal(productId));
  }, [productId]);

  const reviews = useMemo(
    () =>
      [...local, ...seeded].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [local, seeded]
  );

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }
    if (text.trim().length < 4) {
      setError("Please add a short note about your experience.");
      return;
    }
    const review: Review = {
      id: `local-${Date.now()}`,
      productId,
      author: author.trim() || "Anonymous",
      rating,
      text: text.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    const next = [review, ...local];
    setLocal(next);
    try {
      window.localStorage.setItem(storageKey(productId), JSON.stringify(next));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
    setAuthor("");
    setRating(0);
    setText("");
    setError("");
  }

  return (
    <section className="card p-6 sm:p-8" aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="reviews-heading" className="text-lg font-semibold text-gray-900">
          Feedback &amp; reviews
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars value={average} />
            <span className="text-sm font-medium text-gray-700">
              {average.toFixed(1)} · {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        )}
      </div>

      {/* Leave a review */}
      <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-gray-50 p-5">
        <p className="text-base font-semibold text-gray-900">Leave your feedback</p>
        <div className="mt-3">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Your rating
          </label>
          <Stars value={rating} onChange={setRating} size="lg" />
        </div>
        <div className="mt-4">
          <label htmlFor="review-name" className="mb-1.5 block text-sm font-medium text-gray-700">
            Name (optional)
          </label>
          <input
            id="review-name"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Alex"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base text-gray-900 placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="review-text" className="mb-1.5 block text-sm font-medium text-gray-700">
            Your experience
          </label>
          <textarea
            id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="How did this item work for you or the person you care for?"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base text-gray-900 placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        {error && (
          <p className="mt-2 text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn-primary mt-4">
          Post review
        </button>
        <p className="mt-2 text-xs text-gray-500">
          Reviews you post are saved in this browser. Connecting an account will
          sync them everywhere.
        </p>
      </form>

      {/* Review list */}
      <ul className="mt-6 space-y-5">
        {reviews.length === 0 && (
          <li className="text-base text-gray-600">
            No reviews yet — be the first to share how this item worked for you.
          </li>
        )}
        {reviews.map((r) => (
          <li key={r.id} className="border-t border-gray-100 pt-5 first:border-t-0 first:pt-0">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-gray-900">{r.author}</p>
              <time className="text-sm text-gray-500" dateTime={r.date}>
                {new Date(r.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
            <Stars value={r.rating} size="sm" className="mt-1" />
            <p className="mt-2 leading-relaxed text-gray-700">{r.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
