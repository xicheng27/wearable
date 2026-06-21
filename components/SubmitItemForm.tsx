"use client";

import { useId, useState } from "react";

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

const storageKey = "xis-submitted-items";

export default function SubmitItemForm() {
  const id = useId();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.productName.trim() || !form.brandName.trim()) {
      setError("Please add at least the product name and brand name.");
      return;
    }

    const existing = window.localStorage.getItem(storageKey);
    const submissions = existing ? JSON.parse(existing) : [];
    submissions.push({ ...form, submittedAt: new Date().toISOString() });
    window.localStorage.setItem(storageKey, JSON.stringify(submissions));
    setForm(emptyForm);
    setSuccess(
      "Thanks. Your suggestion was saved on this device for review."
    );
  }

  return (
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
          />
        </label>

        <label className="block" htmlFor={`${id}-contact`}>
          <span className="text-base font-bold text-ink">
            Your email, optional
          </span>
          <input
            id={`${id}-contact`}
            value={form.contact}
            onChange={(event) => updateField("contact", event.target.value)}
            className="mt-2 min-h-12 w-full rounded-xl border border-ink/20 bg-paper px-4 text-base text-ink"
            inputMode="email"
            autoComplete="email"
          />
        </label>

        <label className="block sm:col-span-2" htmlFor={`${id}-notes`}>
          <span className="text-base font-bold text-ink">
            Why should we add it?
          </span>
          <span className="mt-1 block text-sm leading-6 text-ink/65">
            For example: magnetic buttons, seated fit, sensory-friendly fabric,
            easy shoes, or local availability.
          </span>
          <textarea
            id={`${id}-notes`}
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            className="mt-2 min-h-32 w-full rounded-xl border border-ink/20 bg-paper px-4 py-3 text-base leading-7 text-ink"
          />
        </label>
      </div>

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

      <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
        Submit item
      </button>
    </form>
  );
}
