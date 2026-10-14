import { useCallback, useSyncExternalStore } from "react";

export type Locale = "en" | "ar";

export interface LocaleMeta {
  code: Locale;
  /** Native name, shown in the switcher. */
  label: string;
  /** Short code shown in the compact switcher trigger. */
  short: string;
  /** English name, for a11y labels. */
  english: string;
  dir: "ltr" | "rtl";
}

export const LOCALES: readonly LocaleMeta[] = [
  { code: "en", label: "English", short: "EN", english: "English", dir: "ltr" },
  { code: "ar", label: "العربية", short: "AR", english: "Arabic", dir: "rtl" },
];

export const DEFAULT_LOCALE: Locale = "en";

const STORAGE_KEY = "locale";
const listeners = new Set<() => void>();

export function dirFor(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "fr" || value === "ar";
}

function readLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const attr = document.documentElement.getAttribute("data-locale");
  return isLocale(attr) ? attr : DEFAULT_LOCALE;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function emit() {
  for (const listener of listeners) listener();
}

function apply(locale: Locale, persist: boolean) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.setAttribute("data-locale", locale);
  el.setAttribute("lang", locale);
  el.setAttribute("dir", dirFor(locale));
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* storage unavailable — the choice simply won't persist */
    }
  }
  emit();
}

export function setLocale(locale: Locale) {
  apply(locale, true);
}

/**
 * `{ locale, setLocale, dir, meta }`. Reads the `data-locale` attribute set
 * before first paint (see index.html), so the document language and direction
 * are correct without a flash. The `"en"` server snapshot keeps SSR/prerender
 * output stable — the real value is read immediately after hydration.
 */
export function useLocale() {
  const locale = useSyncExternalStore(
    subscribe,
    readLocale,
    () => DEFAULT_LOCALE
  );
  const set = useCallback((next: Locale) => setLocale(next), []);
  const meta = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
  const dir = dirFor(locale);
  return { locale, setLocale: set, dir, meta };
}
