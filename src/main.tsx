import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Analytics } from "@vercel/analytics/react";

const container = document.getElementById("root")!;
const tree = (
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
);

// Hydrate prerendered markup when present (SEO), mount otherwise (dev).
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}

// Signal that the app booted, so the reveal failsafe in index.html keeps the
// pre-paint `.js` flag in place instead of un-hiding everything.
(window as Window & { __portfolioReady?: boolean }).__portfolioReady = true;
