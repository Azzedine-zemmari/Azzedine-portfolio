import { useCallback } from "react";
import { useLocale } from "./locale";
import { UI, interpolate } from "./ui";
import type { UiKey } from "./ui";
import { CONTENT } from "./content";
import type { CoreContent } from "./content";
import { ENGINEERING } from "./engineering";
import type { EngineeringContent } from "./engineering";

/** Translate a UI chrome key for the active locale, with `{var}` interpolation. */
export function useT(): (
  key: UiKey,
  vars?: Record<string, string | number>,
) => string {
  const { locale } = useLocale();
  return useCallback(
    (key: UiKey, vars?: Record<string, string | number>) =>
      interpolate(UI[locale][key], vars),
    [locale],
  );
}

/** The localized portfolio content for the active locale. */
export function useContent(): CoreContent {
  const { locale } = useLocale();
  return CONTENT[locale];
}

/** The localized engineering content for the active locale. */
export function useEngineering(): EngineeringContent {
  const { locale } = useLocale();
  return ENGINEERING[locale];
}

export type { UiKey } from "./ui";
export type { CoreContent, SiteInfo, AboutContent, Fact } from "./content";
export type { EngineeringContent, DbModelContent } from "./engineering";
export { LOCALES, setLocale, useLocale, dirFor } from "./locale";
export type { Locale, LocaleMeta } from "./locale";
export { useRich } from "./rich";
