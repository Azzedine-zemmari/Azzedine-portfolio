/**
 * Post-build prerender: renders <App /> to static HTML and injects it into
 * dist/index.html (plus JSON-LD) so all portfolio content is crawlable
 * without executing JavaScript. main.tsx hydrates the same tree.
 */
import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const vite = await createServer({
  root,
  appType: "custom",
  logLevel: "warn",
  server: { middlewareMode: true },
});

try {
  const [{ default: App }, { structuredDataScript }] = await Promise.all([
    vite.ssrLoadModule("/src/App.tsx"),
    vite.ssrLoadModule("/src/lib/seo.ts"),
  ]);

  const appHtml = renderToString(React.createElement(App));
  const distIndex = path.join(root, "dist", "index.html");
  const template = fs.readFileSync(distIndex, "utf8");

  const jsonLd = `<script type="application/ld+json">\n${structuredDataScript()}\n</script>`;

  const html = template
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace("</head>", `${jsonLd}\n</head>`);

  if (!html.includes("</head>")) {
    throw new Error("template does not contain </head> — injection failed");
  }

  fs.writeFileSync(distIndex, html);
  console.log(
    `prerender: ${(appHtml.length / 1024).toFixed(1)}KB of static content + JSON-LD injected into dist/index.html`,
  );
} catch (error) {
  console.error("prerender FAILED (client-only shell kept):", error);
  process.exitCode = 1;
} finally {
  await vite.close();
}
