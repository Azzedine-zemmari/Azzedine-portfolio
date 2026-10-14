import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Resolve any GSAP target (selector, element, NodeList, array) to a single trigger element. */
function firstElement(target: gsap.TweenTarget): Element | undefined {
  return gsap.utils.toArray<Element>(target as gsap.DOMTarget)[0];
}

export function initScrollTrigger() {
  if (typeof window === "undefined") return;
  ScrollTrigger.refresh();
}

export function killAllScrollTriggers() {
  if (typeof window === "undefined") return;
  ScrollTrigger.getAll().forEach((st) => st.kill());
}

/* ------------------------------------------------------------------ */
/* Reveals                                                             */
/* ------------------------------------------------------------------ */

export function createRevealAnimation(
  elements: gsap.TweenTarget,
  options: {
    y?: number;
    opacity?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    ease?: string;
    scrollTrigger?: ScrollTrigger.Vars | false;
  } = {}
) {
  const {
    y = 40,
    opacity = 0,
    duration = 1,
    stagger = 0.1,
    delay = 0,
    ease = "power3.out",
    scrollTrigger = false,
  } = options;

  // Respect reduced motion: show content immediately, no animation.
  if (prefersReducedMotion()) {
    gsap.set(elements as gsap.DOMTarget, { clearProps: "all" });
    return gsap.timeline();
  }

  const tl = gsap.timeline({
    scrollTrigger: scrollTrigger
      ? {
          trigger: firstElement(elements),
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          ...(typeof scrollTrigger === "object" ? scrollTrigger : {}),
        }
      : undefined,
  });

  tl.fromTo(
    elements as gsap.DOMTarget,
    { y, opacity, filter: "blur(8px)" },
    {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration,
      stagger,
      delay,
      ease,
      // Leaving a filter on the element keeps it on its own layer and costs perf.
      clearProps: "filter",
    }
  );

  return tl;
}

export function createStaggeredTextReveal(
  elements: gsap.TweenTarget,
  options: {
    duration?: number;
    stagger?: number;
    delay?: number;
    ease?: string;
    scrollTrigger?: ScrollTrigger.Vars | false;
  } = {}
) {
  const {
    duration = 0.8,
    stagger = 0.03,
    delay = 0,
    ease = "power3.out",
    scrollTrigger = false,
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(elements as gsap.DOMTarget, { clearProps: "all" });
    return gsap.timeline();
  }

  const tl = gsap.timeline({
    scrollTrigger: scrollTrigger
      ? {
          trigger: firstElement(elements),
          start: "top 85%",
          toggleActions: "play none none reverse",
          ...(typeof scrollTrigger === "object" ? scrollTrigger : {}),
        }
      : undefined,
  });

  tl.fromTo(
    elements as gsap.DOMTarget,
    // rotateX has no visible depth without a perspective.
    { y: "100%", opacity: 0, rotateX: 20, transformPerspective: 600, transformOrigin: "50% 100%" },
    { y: "0%", opacity: 1, rotateX: 0, duration, stagger, delay, ease }
  );

  return tl;
}

/* ------------------------------------------------------------------ */
/* Scroll-driven                                                       */
/* ------------------------------------------------------------------ */

export function createParallaxAnimation(
  element: gsap.TweenTarget,
  options: {
    yPercent?: number;
    /** Scrub smoothing in seconds (higher = lazier follow). */
    speed?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  const { yPercent = 50, speed = 1, scrollTrigger: stOptions } = options;

  if (prefersReducedMotion()) return gsap.timeline();

  return gsap.to(element as gsap.DOMTarget, {
    yPercent,
    ease: "none",
    scrollTrigger: {
      trigger: firstElement(element),
      start: "top bottom",
      end: "bottom top",
      scrub: speed,
      ...stOptions,
    },
  });
}

export function createPinAnimation(
  element: gsap.TweenTarget,
  options: {
    pin?: boolean;
    pinSpacing?: boolean;
    start?: string;
    end?: string;
    scrub?: number | boolean;
    /** Optional animation to scrub while pinned. Without one, `scrub` does nothing. */
    animation?: gsap.core.Animation;
    onEnter?: () => void;
    onLeave?: () => void;
    onEnterBack?: () => void;
    onLeaveBack?: () => void;
  } = {}
) {
  const {
    pin = true,
    pinSpacing = true,
    start = "top top",
    end = "+=200%",
    scrub = 1,
    animation,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  } = options;

  return ScrollTrigger.create({
    trigger: firstElement(element),
    pin,
    pinSpacing,
    start,
    end,
    scrub: animation ? scrub : undefined,
    animation,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  });
}

export function createHorizontalScroll(
  container: gsap.TweenTarget,
  items: gsap.TweenTarget,
  options: {
    ease?: string;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  const { ease = "none", scrollTrigger: stOptions } = options;

  const itemArray = gsap.utils.toArray<HTMLElement>(items as gsap.DOMTarget);
  if (!itemArray.length) return gsap.timeline();

  // Measured lazily so it's correct after resizes / font + image loads.
  // Uses first-to-last span, so gaps and margins between items are counted.
  const getTotalWidth = () => {
    const first = itemArray[0];
    const last = itemArray[itemArray.length - 1];
    return last.offsetLeft + last.offsetWidth - first.offsetLeft;
  };
  const getDistance = () => Math.max(0, getTotalWidth() - window.innerWidth);

  return gsap.to(itemArray, {
    x: () => -getDistance(),
    ease,
    scrollTrigger: {
      trigger: firstElement(container),
      start: "top top",
      end: () => `+=${getDistance()}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true, // re-run the function values above on resize
      ...stOptions,
    },
  });
}

/* ------------------------------------------------------------------ */
/* Pointer effects                                                     */
/* ------------------------------------------------------------------ */

const noop = () => {};

export function createMagneticEffect(
  element: HTMLElement,
  options: { strength?: number; area?: number } = {}
) {
  const { strength = 0.3, area = 150 } = options;

  // No magnet on touch devices or for reduced motion.
  if (
    typeof window === "undefined" ||
    prefersReducedMotion() ||
    window.matchMedia("(hover: none)").matches
  ) {
    return noop;
  }

  let active = false;

  const reset = () => {
    if (!active) return;
    active = false;
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
  };

  // Listen on the window: a listener on the element itself only fires when the
  // cursor is already over it, which makes the `area` radius meaningless.
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    if (Math.hypot(x, y) < area) {
      active = true;
      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      reset();
    }
  };

  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  document.documentElement.addEventListener("mouseleave", reset);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    document.documentElement.removeEventListener("mouseleave", reset);
    gsap.killTweensOf(element);
    gsap.set(element, { x: 0, y: 0 });
  };
}

export function createHoverLift(element: HTMLElement, lift = -8) {
  if (typeof window === "undefined" || prefersReducedMotion()) return noop;

  const handleEnter = () => {
    gsap.to(element, { y: lift, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  };
  const handleLeave = () => {
    gsap.to(element, { y: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  };

  element.addEventListener("mouseenter", handleEnter);
  element.addEventListener("mouseleave", handleLeave);

  return () => {
    element.removeEventListener("mouseenter", handleEnter);
    element.removeEventListener("mouseleave", handleLeave);
    gsap.killTweensOf(element);
  };
}