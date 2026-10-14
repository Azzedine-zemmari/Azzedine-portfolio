import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp } from "lucide-react";
import { useContent, useT } from "../i18n";
import { SocialLinks } from "./Contact";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const t = useT();
  const { navSections, site } = useContent();
  const footerRef = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      footer.querySelectorAll(".footer-col"),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      0
    );

    tl.fromTo(
      footer.querySelector(".footer-bottom"),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      0.2
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="border-t border-line bg-abyss/60"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="footer-col max-w-sm">
            <a href="#home" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded border border-line-2 font-serif text-sm text-chalk">
                az
              </span>
              <span className="font-mono text-sm text-mist">
                {site.name.toLowerCase()}
                <span className="text-neon">.dev</span>
              </span>
            </a>
            <p className="mt-4 font-mono text-xs leading-relaxed text-dim">
              {t("footer.built")}
            </p>
          </div>

          <nav aria-label={t("footer.aria")} className="footer-col grid grid-cols-2 gap-x-10 gap-y-2">
            {navSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="font-mono text-sm text-mist transition-colors hover:text-neon"
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="footer-col space-y-4">
            <SocialLinks />
            <a className="btn" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </div>

        <div className="footer-bottom mt-10 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-dim">
            {t("footer.copyright", {
              year,
              name: site.name,
              location: site.location,
            })}
          </p>
          <a
            href="#home"
            className="btn btn-ghost"
            aria-label={t("footer.backToTop")}
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            {t("footer.backToTop")}
          </a>
        </div>
      </div>
    </footer>
  );
}