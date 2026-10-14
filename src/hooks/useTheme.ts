import { useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";
const listeners = new Set<() => void>();

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
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

/** Page background per theme — must match `--color-void` in src/index.css. */
const THEME_COLOR = { dark: "#080b11", light: "#f5f7f9" } as const;

function apply(theme: Theme, persist: boolean) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.setAttribute("data-theme", theme);
  el.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", THEME_COLOR[theme]);
  }
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable — the choice simply won't persist */
    }
  }
  emit();
}

export function setTheme(theme: Theme) {
  apply(theme, true);
}

export function toggleTheme() {
  apply(readTheme() === "light" ? "dark" : "light", true);
}

/**
 * `{ theme, setTheme, toggle }`. Reads the `data-theme` attribute set before
 * first paint (see index.html), so the correct palette is used without a
 * flash. The `false` server snapshot keeps SSR/prerender output stable — the
 * real value is read immediately after hydration.
 */
export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    readTheme,
    () => "dark" as Theme
  );
  const toggle = useCallback(() => toggleTheme(), []);
  return { theme, setTheme, toggle };
}

// Follow the OS preference live, unless the visitor has made an explicit
// choice. Attached once, client-side only.
if (typeof window !== "undefined") {
  const media = window.matchMedia("(prefers-color-scheme: light)");
  media.addEventListener?.("change", () => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (stored === "light" || stored === "dark") return;
    apply(media.matches ? "light" : "dark", false);
  });
}
