import { useEffect, useRef, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** True when the device is likely low-powered (small screen or few cores). */
export function useLowPowerDevice(): boolean {
  const compute = () => {
    if (typeof window === "undefined") return false;
    const cores = navigator.hardwareConcurrency ?? 4;
    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
    return cores <= 4 || small || memory <= 2;
  };
  const [low] = useState(compute);
  return low;
}

type InViewOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: InViewOptions = {},
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0.15, rootMargin = "0px 0px -40px 0px", once = true } = options;
  const hasObserver =
    typeof window !== "undefined" &&
    typeof IntersectionObserver !== "undefined";
  const ref = useRef<T | null>(null);
  // Starts hidden so server + client markup match; the observer reveals it.
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No IntersectionObserver support: reveal immediately instead of leaving
    // content hidden behind the `.js` reveal styles.
    if (!hasObserver) {
      el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasObserver, threshold, rootMargin, once]);

  return [ref, inView];
}

export function useEscapeKey(enabled: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, onEscape]);
}
