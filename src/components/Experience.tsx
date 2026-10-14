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
            <Reveal as="li" key={`${entry.org}-${entry.period}`} delay={index * 80} className="timeline-item relative pb-10 last:pb-0">
              <span
                className={`absolute top-2 -start-[calc(1.5rem+3px)] h-[7px] w-[7px] border border-neon md:-start-[calc(2.5rem+3px)] ${entry.current ? "bg-neon" : "bg-void"
                  }`}
                aria-hidden="true"
              />

              <div className="panel panel-hover group relative overflow-hidden p-5 md:p-6">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-neon/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <p className="eyebrow relative z-10 mb-2.5 text-neon">{entry.period}</p>
                <h3 className="relative z-10 text-lg font-semibold tracking-tight text-chalk md:text-xl">
                  {entry.title}
                </h3>
                <p className="relative z-10 mt-1 font-mono text-sm text-cyan">{entry.org}</p>

                <ul className="relative z-10 mt-4 space-y-2 text-sm leading-relaxed text-mist">
                  {entry.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5">
                      <span className="mt-[0.15rem] text-neon" aria-hidden="true">›</span>
                      <span className="text-pretty">{h}</span>
                    </li>
                  ))}
                </ul>

                <ul className="relative z-10 mt-4 flex flex-wrap gap-1.5">
                  {entry.stack.map((tech) => (
                    <li key={tech} className="tag">{tech}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}