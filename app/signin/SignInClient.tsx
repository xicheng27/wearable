"use client";

import Link from "next/link";
import { LogoMark } from "@/components/Logo";

/**
 * Xi's has no user accounts — nothing is stored on a server and there is no
 * authentication backend. This page previously rendered an email + password
 * form that just navigated to /search, which would have collected real
 * passwords into a form that does nothing. It is now a clear placeholder that
 * collects no credentials.
 */
export default function SignInClient() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2" aria-label="Xi's home">
          <LogoMark size={32} />
        </Link>
        <Link
          href="/"
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Back to home"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 pb-24">
        <div className="animate-fade-up text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            No sign-in needed
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            Xi&apos;s doesn&apos;t use accounts or passwords. Your quiz answers,
            Fit Passport and saved items are kept privately on your own device —
            just start using the app.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link href="/quiz" className="btn-primary w-full py-3.5">
              Take the fit quiz
            </Link>
            <Link
              href="/search"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Browse all clothing
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
