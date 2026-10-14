#!/usr/bin/env node
/**
 * Post-build guard for the palette migration.
 *
 * Run:  node scripts/verify-build.mjs
 *
 * Reads the emitted stylesheet from `dist/` and asserts that:
 *   1. every semantic token survived the Tailwind build in both themes,
 *   2. the utilities the components rely on were actually generated,
 *   3. no value from the retired palette leaked into the output.
 *
 * Exits non-zero on any failure so it can gate CI.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const assets = "dist/assets";
if (!existsSync(assets)) {
  console.error("dist/assets not found — run `npm run build` first.");
  process.exit(1);
}

const file = readdirSync(assets).find((f) => f.endsWith(".css"));
const css = readFileSync(join(assets, file), "utf8");

const count = (needle) => css.split(needle).length - 1;

const TOKENS = [
  "--color-void",
  "--color-abyss",
  "--color-panel",
  "--color-panel-2",
  "--color-line",
  "--color-line-2",
  "--color-chalk",
  "--color-mist",
  "--color-dim",
  "--color-neon",
  "--color-neon-dim",
  "--color-on-neon",
  "--color-cyan",
  "--color-violet",
  "--color-amber",
  "--color-danger",
  "--color-success",
  "--color-control",
  "--panel-highlight",
  "--panel-shadow",
  "--vignette-color",
  "--grain-opacity",
  "--focus-ring",
];

const UTILITIES = [
  ".bg-void",
  ".bg-abyss",
  ".bg-panel",
  ".bg-panel-2",
  ".bg-grid",
  ".text-chalk",
  ".text-mist",
  ".text-dim",
  ".text-neon",
  ".text-cyan",
  ".text-amber",
  ".text-danger",
  ".text-on-neon",
  ".border-line",
  ".border-line-2",
  ".border-neon",
  ".btn-primary",
  ".btn-ghost",
  ".field",
  ".tag",
  ".caret",
];

/** Every value from the retired "Ink & Signal" palette. */
const RETIRED = [
  "ff5b2e", "d8a95c", "c2411d", "ffb066", "ffaa44", "d64413", "a83410",
  "916a17", "8b8880", "9a9a92", "7fb0c8", "9ab6c8", "17171b",
  "0a0a0b", "0e0e10", "131316", "191920", "26262c", "3b3b43",
  "edeae3", "a7a49c", "6e6c65", "ff7a68",
  "f4f1ea", "ece8df", "fffdf9", "f3efe7", "ddd7ca", "c2bcac",
  "17150f", "55524a", "8a867c", "c0392b", "2a2620",
];

let failed = 0;
const check = (label, ok, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
};

console.log(`Inspecting dist/assets/${file}\n`);

for (const token of TOKENS) {
  const n = count(token);
  check(`token ${token}`, n >= 2, `${n} occurrence(s)`);
}

console.log("");
for (const utility of UTILITIES) {
  const n = count(utility);
  check(`utility ${utility}`, n >= 1);
}

console.log("");
// `@theme` emits a token once per theme, so >= 2 proves both are present.
const lightBlocks = count("[data-theme=light]");
check("light-theme override block", lightBlocks >= 2, `${lightBlocks} block(s)`);

// The `.btn` family must live inside @layer components so Tailwind utilities
// can still override it; the old stylesheet leaked these rules out of the
// layer because of a missing closing brace.
const btnIdx = css.indexOf(".btn{");
const layerIdx = css.indexOf("@layer components");
check(
  ".btn is inside @layer components",
  layerIdx !== -1 && btnIdx > layerIdx,
  `layer@${layerIdx}, .btn@${btnIdx}`
);

console.log("");
for (const value of RETIRED) {
  const n = count(value.toLowerCase());
  check(`no retired value #${value}`, n === 0, n ? `${n} leak(s)` : "");
}

console.log(
  failed === 0
    ? "\nBuild output verified: palette migrated cleanly."
    : `\n${failed} check(s) FAILED.`
);
process.exit(failed === 0 ? 0 : 1);
