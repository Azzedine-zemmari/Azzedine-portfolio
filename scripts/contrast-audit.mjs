#!/usr/bin/env node
/**
 * Contrast audit for the portfolio's semantic token system.
 *
 * Run:  node scripts/contrast-audit.mjs
 *
 * Recomputes every WCAG 2.1 contrast pair that the UI actually renders and
 * fails (non-zero exit) when an important combination drops below its target:
 *   - normal text .......... >= 4.5:1
 *   - large text (>=18.66px bold / 24px) .. >= 3.0:1
 *   - essential UI boundary / graphical control .. >= 3.0:1
 *
 * Token values live here as a single source of truth so the audit cannot drift
 * from `src/index.css`; `npm run check:palette` asserts the two files agree.
 */

const srgb = (hex) => {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
};

const luminance = (hex) => {
  const [r, g, b] = srgb(hex).map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG 2.1 contrast ratio between two opaque hex colors. */
export function contrast(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/* ------------------------------------------------------------------ */
/* Palette — mirrors @theme (dark, default) and :root[data-theme=light] */
/* ------------------------------------------------------------------ */

export const DARK = {
  void: "#080b11",
  abyss: "#0c1118",
  panel: "#111823",
  "panel-2": "#18202b",
  line: "#232d3a",
  "line-2": "#39485a",
  chalk: "#eef2f7",
  mist: "#a4b1c1",
  dim: "#8593a4",
  neon: "#2fd8bd",
  "neon-dim": "#24b8a0",
  "on-neon": "#04211d",
  cyan: "#5fb3ea",
  violet: "#8a9bb0",
  amber: "#e9b24c",
  success: "#3fd68c",
  danger: "#f79083",
  control: "#66768f",
};

export const LIGHT = {
  void: "#f5f7f9",
  abyss: "#eef1f5",
  panel: "#ffffff",
  "panel-2": "#f2f5f8",
  line: "#dce2e9",
  "line-2": "#a9b6c4",
  chalk: "#101a24",
  mist: "#48586a",
  dim: "#5d6c7e",
  neon: "#0c7263",
  "neon-dim": "#095a4e",
  "on-neon": "#ffffff",
  cyan: "#0d5f96",
  violet: "#55657a",
  amber: "#7a5200",
  success: "#10693a",
  danger: "#b0221b",
  control: "#74839a",
};

/** Text tokens that must clear the 4.5:1 normal-text bar on every surface. */
const TEXT_TOKENS = [
  "chalk",
  "mist",
  "dim",
  "neon",
  "cyan",
  "amber",
  "success",
  "danger",
];
/** Surfaces those tokens can realistically be painted on. */
const SURFACES = ["void", "abyss", "panel", "panel-2"];
/** Tokens used as a text/icon colour on an accent-filled control. */
const ACCENT_FILLS = ["neon", "neon-dim", "cyan"];

let failures = 0;
const report = (theme, tokens) => {
  console.log(`\n=== ${theme.toUpperCase()} ===`);
  const pad = (s, n) => String(s).padEnd(n);
  for (const tok of TEXT_TOKENS) {
    const cells = SURFACES.map((surface) => {
      const ratio = contrast(tokens[tok], tokens[surface]);
      const ok = ratio >= 4.5;
      if (!ok) failures++;
      return `${pad(surface, 8)} ${ok ? "PASS" : "FAIL"} ${ratio.toFixed(2).padStart(6)}`;
    });
    console.log(`${pad(tok, 9)} ${tokens[tok]}  ${cells.join(" | ")}`);
  }

  // Foreground on the accent-filled control (primary button / FAB).
  for (const bg of ACCENT_FILLS) {
    const ratio = contrast(tokens["on-neon"], tokens[bg]);
    const ok = ratio >= 4.5;
    if (!ok) failures++;
    console.log(
      `${pad("on-neon", 9)} on ${pad(bg, 9)} ${ok ? "PASS" : "FAIL"} ${ratio.toFixed(2)}`
    );
  }

  // Essential UI boundaries: the outline of an interactive control must be
  // distinguishable from the surface it sits on (WCAG 1.4.11).
  for (const surface of SURFACES) {
    const ratio = contrast(tokens.control, tokens[surface]);
    const ok = ratio >= 3;
    if (!ok) failures++;
    console.log(
      `${pad("control", 9)} vs ${pad(surface, 8)} ${ok ? "PASS" : "FAIL"} ${ratio.toFixed(2)} (>= 3)`
    );
  }

  // Decorative hairlines only need to be perceptible, not accessible.
  for (const surface of ["void", "panel"]) {
    const ratio = contrast(tokens.line, tokens[surface]);
    const ok = ratio >= 1.2;
    if (!ok) failures++;
    console.log(
      `${pad("line", 9)} vs ${pad(surface, 8)} ${ok ? "PASS" : "FAIL"} ${ratio.toFixed(2)} (>= 1.2)`
    );
  }
};

report("dark", DARK);
report("light", LIGHT);

console.log(
  failures === 0
    ? "\nAll contrast targets met."
    : `\n${failures} contrast target(s) FAILED.`
);
process.exit(failures === 0 ? 0 : 1);
