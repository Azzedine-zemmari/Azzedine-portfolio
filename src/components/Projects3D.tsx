"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../data/portfolio";
import { ArrowUpRight, Github } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Projects3DShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializedRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      initializedRef.current = true;
      return;
    }

    const cards = Array.from(container.querySelectorAll(".project-card-3d")) as HTMLElement[];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    });

    cards.forEach((card, i) => {
      tl.fromTo(
        card,
        { rotationY: 15, rotationX: -10, y: 100, opacity: 0, scale: 0.9 },
        { rotationY: 0, rotationX: 0, y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
        i * 0.15
      );
    });

    cards.forEach((card) => {
      const inner = card.querySelector(".project-card-inner") as HTMLElement;
      if (!inner) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -30;
        gsap.to(inner, { rotationY: x, rotationX: y, duration: 0.3, ease: "power2.out" });
      };

      const handleMouseLeave = () => {
        gsap.to(inner, { rotationY: 0, rotationX: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    });

    initializedRef.current = true;

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === container) st.kill();
      });
      initializedRef.current = false;
    };
  }, []);

  const STOPWORDS = new Set(["&", "and", "the", "of", "a", "an"]);

  function monogram(title: string): string {
    const letters = title
      .split(/\s+/)
      .filter((word) => !STOPWORDS.has(word.toLowerCase()))
      .slice(0, 3)
      .map((word) => word[0])
      .join("");
    return letters.toUpperCase();
  }

  return (
    <section id="projects" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal mb-10 md:mb-14">
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="text-neon">03</span>
            <span className="h-px w-8 bg-line-2" aria-hidden="true" />
            <span>Selected work</span>
          </p>
          <h2 className="display max-w-3xl text-4xl text-chalk text-balance sm:text-5xl md:text-6xl">
            Four systems, built <span className="display-italic text-neon">end to end</span>.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist text-pretty">
            Each project below is real engineering work with public source code — from database schema and REST contract to interface. No mockups, no invented metrics; the scope and stack are exactly what was built.
          </p>
        </div>

        <div
          ref={containerRef}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 perspective-1000 preserve-3d"
          style={{ perspective: "1000px" }}
        >
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="project-card-3d relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="project-card-inner panel panel-hover relative overflow-hidden preserve-3d"
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.3s ease-out",
                  transformOrigin: "center center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                <div className="relative p-6 md:p-8">
                  <div className="flex items-start gap-5 mb-6">
                    <span className="index-num text-sm text-dim shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="display text-2xl text-chalk md:text-3xl truncate">
                        {project.title}
                      </h3>
                      {project.year && (
                        <p className="mt-1 font-mono text-xs text-neon">{project.year}</p>
                      )}
                    </div>
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center border border-line-2 font-serif text-2xl text-mist transition-colors group-hover:border-neon group-hover:text-neon md:h-20 md:w-20 md:text-3xl"
                      aria-hidden="true"
                    >
                      {monogram(project.title)}
                    </div>
                  </div>

                  <p className="mb-6 max-w-xl leading-relaxed text-mist text-pretty">
                    {project.summary}
                  </p>

                  <div className="mb-6">
                    <p className="eyebrow mb-3">Scope</p>
                    <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                      {project.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-2.5 text-[13px] leading-relaxed text-mist"
                        >
                          <span className="mt-2 h-px w-3 shrink-0 bg-neon" aria-hidden="true" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.stack.map((tech) => (
                      <span key={tech} className="tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a
                    className="link-sweep inline-flex w-fit items-center gap-1.5 font-mono text-xs tracking-widest text-chalk uppercase transition-colors hover:text-neon"
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-3.5 w-3.5" aria-hidden="true" />
                    Source
                    <span className="sr-only"> for {project.title}</span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="reveal mt-12 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-md font-mono text-xs leading-relaxed text-dim">
            More repositories, including earlier experiments and training work,
            live on GitHub.
          </p>
          <a
            className="btn"
            href="https://github.com/Azzedine-zemmari?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            All repositories
          </a>
        </div>
      </div>
    </section>
  );
}