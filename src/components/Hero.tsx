"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent, useT } from "../i18n";
import type { UiKey } from "../i18n";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero section content. The 3D element now lives in the site-wide
 * `SiteBackground`, so this only owns the text/terminal layout and the
 * scroll-out animation of the hero copy.
 */
export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    tl.fromTo(
      ".hero-content",
      { opacity: 1, y: 0, scale: 1 },
      { opacity: 0, y: -100, scale: 0.9, ease: "none" },
      0
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
      <div className="hero-content relative z-10 h-full flex flex-col justify-center">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <HeroContent />
        </div>
      </div>

      <ScrollIndicator />
    </div>
  );
}

function HeroContent() {
  const t = useT();
  const { site } = useContent();
  return (
    <div className="pt-28 pb-20 md:pt-36 lg:pt-44">
      <p className="rise rise-1 eyebrow mb-8 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="inline-block h-1.5 w-1.5 bg-neon animate-pulse" aria-hidden="true" />
        <span className="text-mist">{site.role}</span>
        <span aria-hidden="true">·</span>
        <span>{site.focus}</span>
        <span aria-hidden="true">·</span>
        <span>{site.location}</span>
      </p>

      <h1 className="rise rise-2 display text-chalk" style={{ fontSize: "clamp(3.5rem, 14vw, 10rem)" }}>
        Zemmari
        <span className="block">
          <span className="display-italic text-neon">Azzedine</span>
        </span>
      </h1>

      <p className="rise rise-3 mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-mist sm:text-sm">
        <span className="h-px w-8 bg-line-2" aria-hidden="true" />
        <span>Java / Spring Boot</span>
        <span className="text-dim" aria-hidden="true">·</span>
        <span>Angular / TypeScript</span>
        <span className="text-dim" aria-hidden="true">·</span>
        <span>{t("hero.stack.data")}</span>
      </p>

      <p className="rise rise-3 mt-8 max-w-xl text-lg leading-relaxed text-mist text-pretty">
        {t("hero.intro")}
      </p>

      <div className="rise rise-4 mt-10 flex flex-wrap items-center gap-3">
        <a className="btn btn-primary" href="#projects">
          {t("hero.cta.projects")}
        </a>
        <a className="btn" href="#contact">
          {t("hero.cta.contact")}
        </a>
        <a className="btn btn-ghost" href="/cv.pdf" download="ZEMMARI_AZZEDINE_CV.pdf">
          {t("hero.cta.cv")}
        </a>
      </div>

      <SectionIndex />
      <MetaStrip />
    </div>
  );
}

function SectionIndex() {
  const t = useT();
  const { navSections } = useContent();
  const labelFor = (id: string) =>
    navSections.find((section) => section.id === id)?.label ?? id;
  const INDEX: { id: string; note: string }[] = [
    { id: "about", note: t("hero.index.about") },
    { id: "skills", note: t("hero.index.skills") },
    { id: "projects", note: t("hero.index.projects") },
    { id: "experience", note: t("hero.index.experience") },
    { id: "contact", note: t("hero.index.contact") },
  ];

  return (
    <aside className="rise rise-3 mt-16 lg:mt-0 lg:absolute lg:end-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[280px] hidden lg:block">
      <p className="eyebrow mb-4">{t("hero.index")}</p>
      <ol className="border-t border-line">
        {INDEX.map((item, index) => (
          <li key={item.id} className="border-b border-line">
            <a
              href={`#${item.id}`}
              className="group flex items-baseline gap-4 py-3 transition-colors hover:text-neon"
            >
              <span className="index-num text-xs text-dim">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="link-sweep text-base text-chalk">
                {labelFor(item.id)}
              </span>
              <span className="ms-auto font-mono text-[11px] text-dim">
                {item.note}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function MetaStrip() {
  const t = useT();
  const stats: { key: UiKey; count: string }[] = [
    { key: "hero.meta.projects", count: "4" },
    { key: "hero.meta.tech", count: "25+" },
    { key: "hero.meta.profiles", count: "4" },
    { key: "hero.meta.languages", count: "3" },
  ];

  return (
    <dl className="rise rise-4 mt-16 grid grid-cols-2 gap-px overflow-hidden border-t border-line sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.key} className="flex items-baseline gap-3 py-5">
          <dt className="display text-3xl text-chalk sm:text-4xl">{stat.count}</dt>
          <dd className="eyebrow">{t(stat.key, { count: stat.count })}</dd>
        </div>
      ))}
    </dl>
  );
}

function ScrollIndicator() {
  const t = useT();
  return (
    <div className="absolute bottom-8 start-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dim animate-bounce">
      <span className="font-mono text-xs tracking-widest uppercase">{t("hero.scroll")}</span>
      <svg
        className="w-5 h-5 text-neon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  );
}
