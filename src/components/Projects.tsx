import { ArrowUpRight, Github, ChevronDown } from "lucide-react";
import { useContent, useRich, useT } from "../i18n";
import { projectEngineering } from "../data/engineering";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const STOPWORDS = new Set(["&", "and", "the", "of", "a", "an"]);

const engineeringByTitle = new Map(
  projectEngineering.map((e) => [e.title, e])
);

/** Two/three-letter monogram from a project title (no invented imagery). */
function monogram(title: string): string {
  const letters = title
    .split(/\s+/)
    .filter((word) => !STOPWORDS.has(word.toLowerCase()))
    .slice(0, 3)
    .map((word) => word[0])
    .join("");
  return letters.toUpperCase();
}

export function Projects() {
  const t = useT();
  const rich = useRich();
  const { projects } = useContent();
  return (
    <section id="projects" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="04"
          kicker={t("projects.kicker")}
          title={rich(t("projects.title"))}
          lead={t("projects.lead")}
        />

        <ol className="border-b border-line">
          {projects.map((project, index) => (
            <Reveal as="li" key={project.title} delay={index * 60}>
              <article className="group grid gap-6 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-14">
                {/* monogram + index */}
                <div className="flex items-center gap-5 md:col-span-3 md:flex-col md:items-start">
                  <span className="index-num text-sm text-dim">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="flex h-16 w-16 items-center justify-center border border-line-2 font-serif text-2xl text-mist transition-colors group-hover:border-neon group-hover:text-neon md:h-20 md:w-20 md:text-3xl"
                    aria-hidden="true"
                  >
                    {monogram(project.title)}
                  </span>
                </div>

                {/* body */}
                <div className="md:col-span-6">
                  <h3 className="display text-3xl text-chalk md:text-4xl">
                    {project.title}
                  </h3>
                  <p className="mt-4 max-w-2xl leading-relaxed text-mist text-pretty">
                    {project.summary}
                  </p>

                  <p className="eyebrow mt-8 mb-3">{t("projects.scope")}</p>
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

                  <EngineeringNotes eng={engineeringByTitle.get(project.title)} />
                </div>
                {/* meta */}
                <div className="flex flex-col md:col-span-3">
                  {project.year && (
                    <p className="eyebrow mb-4">{project.year}</p>
                  )}
                  <ul className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <li key={tech}>
                        <span className="tag">{tech}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    className="link-sweep mt-6 inline-flex w-fit items-center gap-1.5 font-mono text-xs tracking-widest text-chalk uppercase transition-colors hover:text-neon"
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("projects.source")}
                    <span className="sr-only">
                      {" "}
                      {t("projects.sourceFor", { title: project.title })}
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-md font-mono text-xs leading-relaxed text-dim">
            {t("projects.more")}
          </p>
          <a
            className="btn"
            href="https://github.com/Azzedine-zemmari?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            {t("projects.allRepos")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function EngineeringNotes({
  eng,
}: {
  eng: (typeof projectEngineering)[number] | undefined;
}) {
  const t = useT();
  if (!eng) return null;
  return (
    <details className="group/eng mt-8 border-t border-line pt-4">
      <summary className="flex cursor-pointer items-center gap-2 font-mono text-[11px] tracking-widest text-mist uppercase transition-colors hover:text-neon [&::-webkit-details-marker]:hidden">
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform group-open/eng:rotate-180"
          aria-hidden="true"
        />
        {t("projects.eng.notes")}
      </summary>
      <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <p className="eyebrow mb-1.5">{t("projects.eng.problem")}</p>
          <p className="text-[13px] leading-relaxed text-mist text-pretty">
            {eng.problem}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="eyebrow mb-1.5">{t("projects.eng.contribution")}</p>
          <p className="text-[13px] leading-relaxed text-mist text-pretty">
            {eng.contribution}
          </p>
        </div>
        <div>
          <p className="eyebrow mb-1.5">{t("projects.eng.backend")}</p>
          <ul className="flex flex-wrap gap-1.5">
            {eng.backend.map((tech) => (
              <li key={tech}>
                <span className="tag">{tech}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-1.5">{t("projects.eng.frontend")}</p>
          <ul className="flex flex-wrap gap-1.5">
            {eng.frontend.map((tech) => (
              <li key={tech}>
                <span className="tag">{tech}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-1.5">{t("projects.eng.data")}</p>
          <p className="text-[13px] leading-relaxed text-mist text-pretty">
            {eng.dataNotes}
          </p>
        </div>
        <div>
          <p className="eyebrow mb-1.5">{t("projects.eng.api")}</p>
          <p className="text-[13px] leading-relaxed text-mist text-pretty">
            {eng.apiNotes}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="eyebrow mb-1.5">{t("projects.eng.quality")}</p>
          <p className="text-[13px] leading-relaxed text-mist text-pretty">
            {eng.quality}
          </p>
        </div>
      </div>
    </details>
  );
}
