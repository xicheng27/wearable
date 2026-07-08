"use client";

import { useEffect, useId, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type AccessibilitySettings = {
  seniorMode: boolean;
  textSize: "default" | "large" | "larger";
  highContrast: boolean;
  reduceMotion: boolean;
  largeButtons: boolean;
};

const storageKey = "xis-accessibility-settings";

const defaultSettings: AccessibilitySettings = {
  seniorMode: false,
  textSize: "default",
  highContrast: false,
  reduceMotion: false,
  largeButtons: false,
};

function applySettings(settings: AccessibilitySettings) {
  const root = document.documentElement;
  root.dataset.senior = String(settings.seniorMode);
  root.dataset.textSize = settings.textSize;
  root.dataset.highContrast = String(settings.highContrast);
  root.dataset.reduceMotion = String(settings.reduceMotion);
  root.dataset.largeButtons = String(settings.largeButtons);
}

export default function AccessibilityPanel() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] =
    useState<AccessibilitySettings>(defaultSettings);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const next = { ...defaultSettings, ...JSON.parse(stored) };
        setSettings(next);
        applySettings(next);
        return;
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    applySettings(defaultSettings);
  }, []);

  useEffect(() => {
    applySettings(settings);
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const update = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => setSettings((current) => ({ ...current, [key]: value }));

  return (
    <div
      className="fixed bottom-4 left-4 z-[90] print:hidden"
      id="accessibility-tools"
      ref={panelRef}
    >
      {open && (
        <section
          id={panelId}
          aria-labelledby={`${panelId}-title`}
          className="mb-3 w-[min(calc(100vw-2rem),22rem)] rounded-2xl border border-ink/15 bg-paper p-4 text-ink shadow-lift"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2
                id={`${panelId}-title`}
                className="font-display text-2xl font-semibold"
              >
                Accessibility
              </h2>
              <p className="mt-1 text-sm leading-6 text-ink/70">
                Adjust the site for easier reading and tapping.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-xl leading-none text-ink/65 hover:bg-sand/60 hover:text-ink"
              aria-label="Close accessibility panel"
            >
              &times;
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <label className="flex min-h-[3.25rem] cursor-pointer items-center justify-between gap-3 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3">
              <span>
                <span className="block text-sm font-bold text-primary-900">
                  Caregiver / Senior mode
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-primary-800/80">
                  Bigger text, larger buttons and more spacing for easier
                  reading and tapping.
                </span>
              </span>
              <input
                type="checkbox"
                checked={settings.seniorMode}
                onChange={(event) => {
                  const on = event.target.checked;
                  update("seniorMode", on);
                  if (on) trackEvent("senior_mode_enabled");
                }}
                className="h-6 w-6 flex-shrink-0 rounded border-ink/25 text-primary-700 focus:ring-primary-500"
              />
            </label>

            <fieldset>
              <legend className="text-sm font-bold text-ink">
                Text size
              </legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["default", "large", "larger"] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => update("textSize", size)}
                    className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-bold ${
                      settings.textSize === size
                        ? "border-primary-800 bg-primary-700 text-white"
                        : "border-ink/15 bg-ivory text-ink"
                    }`}
                    aria-pressed={settings.textSize === size}
                  >
                    {size === "default"
                      ? "Normal"
                      : size === "large"
                        ? "Large"
                        : "Larger"}
                  </button>
                ))}
              </div>
            </fieldset>

            {(
              [
                ["highContrast", "High contrast mode"],
                ["reduceMotion", "Reduce motion"],
                ["largeButtons", "Larger buttons mode"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-xl border border-ink/10 bg-ivory px-3 py-2"
              >
                <span className="text-sm font-bold text-ink">{label}</span>
                <input
                  type="checkbox"
                  checked={Boolean(
                    settings[key]
                  )}
                  onChange={(event) =>
                    update(key, event.target.checked)
                  }
                  className="h-5 w-5 rounded border-ink/25 text-primary-700 focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full border border-ink/20 bg-primary-800 px-4 py-3 text-sm font-extrabold text-white shadow-lift hover:bg-primary-900"
        aria-expanded={open}
        aria-controls={panelId}
      >
        Accessibility
      </button>
    </div>
  );
}
