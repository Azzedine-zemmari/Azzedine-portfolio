"use client";

import { useEffect, useRef } from "react";
import { BackgroundScene } from "../three/BackgroundScene";

/**
 * Fixed, full-viewport 3D background shared by the whole site.
 *
 * Sits behind all content (`-z-10`) and ignores pointer events, so links,
 * the terminal and forms keep working. A single rAF-throttled scroll listener
 * feeds whole-page progress into the scene, so the 3D travels with the page.
 */
export function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      progressRef.current =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
      <BackgroundScene canvasRef={canvasRef} progressRef={progressRef} />
    </div>
  );
}
