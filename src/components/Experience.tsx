import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent, useRich, useT } from "../i18n";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const t = useT();
  const rich = useRich();
  const { journey } = useContent();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const timeline = section.querySelector(".experience-timeline");
    const items = Array.from(timeline?.querySelectorAll(".timeline-item") || []) as HTMLElement[];

    if (items.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    });

    tl.fromTo(
      timeline,
      { scaleY: 0, transformOrigin: "top center" },
      { scaleY: 1, duration: 1, ease: "power3.out" },
      0
    );

    items.forEach((item, i) => {
      tl.fromTo(
        item,
        { x: -50, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
        i * 0.1
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="scroll-mt-20 border-y border-line/60 bg-abyss/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="05"
          kicker={t("experience.kicker")}
          title={rich(t("experience.title"))}
          lead={t("experience.lead")}
        />

        <ol className="experience-timeline relative ms-1 border-s border-line-2 ps-6 md:ms-3 md:ps-10">
          {journey.map((entry, index) => (
            <Reveal as="li" key={entry.title} delay={index * 80} className="timeline-item relative pb-10 last:pb-0">
              <span
                className="absolute top-2 -start-[calc(1.5rem+3px)] h-[7px] w-[7px] border border-neon bg-void md:-start-[calc(2.5rem+3px)]"
                aria-hidden="true"
              />

              <div className="panel panel-hover p-5 md:p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                <p className="eyebrow mb-2.5 text-neon relative z-10">{entry.period}</p>
                <h3 className="text-lg font-semibold tracking-tight text-chalk md:text-xl relative z-10">
                  {entry.title}
                </h3>
                <p className="mt-1 font-mono text-sm text-cyan relative z-10">{entry.org}</p>
                <p className="mt-3 text-sm leading-relaxed text-mist text-pretty relative z-10">
                  {entry.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}