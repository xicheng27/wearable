"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { SUBMISSION_LIMITS, validateSubmission } from "@/lib/security/submission";

type FormState = {
  productName: string;
  brandName: string;
  productUrl: string;
  country: string;
  notes: string;
  contact: string;
};

const emptyForm: FormState = {
  productName: "",
  brandName: "",
  productUrl: "",
  country: "",
  notes: "",
  contact: "",
};

export default function SubmitItemForm() {
  const id = useId();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const startedRef = useRef(false);
  // Honeypot: real users never fill a hidden field; bots usually do.
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAtRef = useRef<number>(Date.now());

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("submit_item_started");
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    // First-line client checks (the server re-checks all of these).
    if (honeypotRef.current?.value) return;
    if (Date.now() - mountedAtRef.current < 1500) {
      setError("Please take a moment to fill in the details, then submit again.");
      return;
    }

    // Validate client-side for instant feedback; the server validates again
    // and is the source of truth (never trust the client).
    const result = validateSubmission(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          company: honeypotRef.current?.value ?? "",
          elapsedMs: Date.now() - mountedAtRef.current,
        }),
      });

      let data: { ok?: boolean; error?: string; reference?: string } = {};
      try {
        data = await response.json();
      } catch {
        // Non-JSON response — fall through to the generic error below.
      }

      if (!response.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setForm(emptyForm);
      startedRef.current = false;
      mountedAtRef.current = Date.now();
      // Analytics: conversion only — never the entered values/email.
      trackEvent("submit_item_submitted", { hasContact: Boolean(form.contact.trim()) });
      setSuccess(
        data.reference
          ? `Thanks — your suggestion was securely submitted for review. Reference: ${data.reference}. Quote this reference if you'd like it deleted.`
          : "Thanks — your suggestion was securely submitted for review."
      );
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={submit}
        className="paper-panel rounded-[2rem_.9rem_2rem_2rem] p-6 sm:p-8"
        noValidate
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block" htmlFor={`${id}-product`}>
            <span className="text-base font-bold text-ink">Product name</span>
            <input
              id={`${id}-product`}
              value={form.productName}
              onChange={(event) => updateField("productName", event.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-ink/20 bg-paper px-4 text-base text-ink"
              autoComplete="off"
              maxLength={SUBMISSION_LIMITS.productName}
              required
            />
          </label>

          <label className="block" htmlFor={`${id}-brand`}>
            <span className="text-base font-bold text-ink">Brand name</span>
            <input
              id={`${id}-brand`}
              value={form.brandName}
              onChange={(event) => updateField("brandName", event.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-ink/20 bg-paper px-4 text-base text-ink"
              autoComplete="organization"
              maxLength={SUBMISSION_LIMITS.brandName}
              required
            />
          </label>

          <label className="block sm:col-span-2" htmlFor={`${id}-url`}>
            <span className="text-base font-bold text-ink">
              Official product link, if you have it
            </span>
            <input
              id={`${id}-url`}
              value={form.productUrl}
              onChange={(event) => updateField("productUrl", event.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-ink/20 bg-paper px-4 text-base text-ink"
              inputMode="url"
              placeholder="https://"
              autoComplete="url"
              maxLength={SUBMISSION_LIMITS.url}
            />
          </label>

          <label className="block" htmlFor={`${id}-country`}>
            <span className="text-base font-bold text-ink">
              Where is it available?
            </span>
            <input
              id={`${id}-country`}
              value={form.country}
              onChange={(event) => updateField("country", event.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-ink/20 bg-paper px-4 text-base text-ink"
              placeholder="Singapore, global, online only..."
              autoComplete="country-name"
              maxLength={SUBMISSION_LIMITS.country}
            />
          </label>

          <label className="block" htmlFor={`${id}-contact`}>
            <span className="text-base font-bold text-ink">
              Your email{" "}
              <span className="font-normal text-ink/55">(optional)</span>
            </span>
            <input
              id={`${id}-contact`}
              value={form.contact}
              onChange={(event) => updateField("contact", event.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-ink/20 bg-paper px-4 text-base text-ink"
              inputMode="email"
              autoComplete="email"
              maxLength={SUBMISSION_LIMITS.email}
              aria-describedby={`${id}-contact-help`}
            />
            <span
              id={`${id}-contact-help`}
              className="mt-1 block text-sm leading-6 text-ink/60"
            >
              Submitted with your suggestion and used only to follow up on it if
              needed — never for marketing, and never shared. Leave it blank if
              you prefer.
            </span>
          </label>

          <label className="block sm:col-span-2" htmlFor={`${id}-notes`}>
            <span className="text-base font-bold text-ink">
              Why should we add it?
            </span>
            <span className="mt-1 block text-sm leading-6 text-ink/65">
              For example: magnetic buttons, seated fit, sensory-friendly fabric,
              easy shoes, or local availability. Please don&apos;t include your
              name, contact details or any medical information here.
            </span>
            <textarea
              id={`${id}-notes`}
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              className="mt-2 min-h-32 w-full rounded-xl border border-ink/20 bg-paper px-4 py-3 text-base leading-7 text-ink"
              maxLength={SUBMISSION_LIMITS.notes}
            />
          </label>
        </div>

        {/* Honeypot — visually hidden, ignored by humans, often filled by bots. */}
        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Leave this field empty</label>
          <input
            id={`${id}-website`}
            ref={honeypotRef}
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <p className="mt-6 text-sm leading-6 text-ink/65">
          Your suggestion is securely submitted to us for manual review before
          anything is added to the catalogue. It is stored by our database
          provider (Upstash) and kept for up to 180 days, then automatically
          deleted. You&apos;ll get a reference you can quote to have it removed
          sooner. See exactly what is collected in our{" "}
          <Link href="/privacy" className="link-underline">
            privacy notice
          </Link>
          .
        </p>

        {error && (
          <p
            className="mt-5 rounded-xl border border-clay/40 bg-clay/10 px-4 py-3 text-base font-semibold text-ink"
            role="alert"
          >
            {error}
          </p>
        )}
        {success && (
          <p
            className="mt-5 rounded-xl border border-sage/50 bg-sage/15 px-4 py-3 text-base font-semibold text-ink"
            role="status"
          >
            {success}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary mt-6 w-full sm:w-auto"
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? "Submitting…" : "Submit item"}
        </button>
      </form>
    </>
  );
}
