import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download } from "lucide-react";
import { useContent, useRich, useT } from "../i18n";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const t = useT();
  const rich = useRich();
  const { about, site } = useContent();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    });

    tl.fromTo(
      section.querySelectorAll(".about-paragraph"),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" },
      0
    );

    tl.fromTo(
      section.querySelector(".about-factsheet"),
      { x: 50, opacity: 0, rotationY: -15 },
      { x: 0, opacity: 1, rotationY: 0, duration: 1.2, ease: "power3.out" },
      0.2
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="scroll-mt-20 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="01"
          kicker={t("about.kicker")}
          title={rich(t("about.title"))}
          lead={about.summary}
        />

        <div className="grid gap-10 lg:grid-cols-[1.4fr_minmax(0,1fr)]">
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-mist text-pretty">
              {about.paragraphs.map((paragraph, i) => (
                <p key={i} className="about-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>

            <Reveal delay={120}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className="btn"
                  href="/cv.pdf"
                  download="ZEMMARI_AZZEDINE_CV.pdf"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("about.cv")}
                </a>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    document
                      .getElementById("terminal-input")
                      ?.focus({ preventScroll: true })
                  }
                >
                  {t("about.ask")}
                </button>
              </div>
            </Reveal>
          </Reveal>

          <Reveal delay={100}>
            <div className="about-factsheet panel sticky top-24 overflow-hidden">
              <div className="flex items-center gap-2.5 border-b border-line bg-abyss/60 px-4 py-2.5">
                <span className="h-1.5 w-1.5 bg-neon" aria-hidden="true" />
                <span className="eyebrow">{t("about.file")}</span>
              </div>
              <dl className="divide-y divide-line/60 font-mono text-sm">
                {about.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid grid-cols-[96px_1fr] gap-3 px-4 py-3"
                  >
                    <dt className="text-dim">{fact.label}</dt>
                    <dd className="text-chalk">{fact.value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[96px_1fr] gap-3 px-4 py-3">
                  <dt className="text-dim">{t("about.email")}</dt>
                  <dd>
                    <a
                      className="text-cyan underline decoration-cyan/40 underline-offset-4 hover:decoration-cyan"
                      href={`mailto:${site.email}`}
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}