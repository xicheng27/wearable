/**
 * Internationalisation configuration.
 *
 * English is the default and the only fully-populated locale today; the others
 * are partially translated and fall back to English per-key at runtime (see
 * I18nProvider). The structure is deliberately simple so more locales — or
 * fuller translations of the existing ones — can be added by dropping another
 * JSON file in /locales and registering it here, with no component changes.
 *
 * This is a first-party i18n layer on purpose: we never rely on automatic
 * browser translation to localise the interface.
 */

export type Locale = "en" | "zh" | "ms" | "ta";

export const DEFAULT_LOCALE: Locale = "en";

export interface LocaleMeta {
  code: Locale;
  /** Language name in the language itself (used in the selector). */
  nativeName: string;
  /** Language name in English (for aria/labels). */
  englishName: string;
}

export const LOCALES: LocaleMeta[] = [
  { code: "en", nativeName: "English", englishName: "English" },
  { code: "zh", nativeName: "简体中文", englishName: "Simplified Chinese" },
  { code: "ms", nativeName: "Bahasa Melayu", englishName: "Malay" },
  { code: "ta", nativeName: "தமிழ்", englishName: "Tamil" },
];

export const LOCALE_CODES: Locale[] = LOCALES.map((l) => l.code);

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALE_CODES as string[]).includes(value);
}

/** localStorage key for the visitor's chosen language. */
export const LOCALE_STORAGE_KEY = "xis-locale";
