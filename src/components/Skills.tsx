import { useContent, useRich, useT } from "../i18n";
import type { UiKey } from "../i18n";
import { TechIcon } from "./ui/TechIcon";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const FEATURED: Array<[string, UiKey]> = [
  ["Java", "skills.cat.languages"],
  ["TypeScript", "skills.cat.languages"],
  ["Spring Boot", "skills.cat.backend"],
  ["Laravel", "skills.cat.backend"],
  ["Angular", "skills.cat.frontend"],
  ["React", "skills.cat.frontend"],
  ["Vue.js", "skills.cat.frontend"],
  ["TailwindCSS", "skills.cat.frontend"],
  ["PostgreSQL", "skills.cat.databases"],
  ["MySQL", "skills.cat.databases"],
  ["MongoDB", "skills.cat.databases"],
  ["Docker", "skills.cat.devops"],
];

export function Skills() {
  const t = useT();
  const rich = useRich();
  const { skills } = useContent();
  return (
    <section
      id="skills"
      className="relative scroll-mt-20 border-y border-line bg-abyss/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="02"
          kicker={t("skills.kicker")}
          title={rich(t("skills.title"))}
          lead={t("skills.lead")}
        />

        <Reveal className="mb-16">
          <p className="eyebrow mb-4">{t("skills.featured")}</p>
          <ul className="grid grid-cols-3 gap-px border border-line bg-line sm:grid-cols-4 lg:grid-cols-6">
            {FEATURED.map(([name, categoryKey]) => (
              <li
                key={name}
                className="group flex flex-col items-center gap-3 bg-void px-2 py-6 transition-colors hover:bg-panel"
              >
                <TechIcon
                  name={name}
                  className="h-8 w-8 opacity-70 transition-opacity group-hover:opacity-100 [&_svg]:h-full [&_svg]:w-full"
                />
                <span className="font-mono text-[11px] text-mist transition-colors group-hover:text-chalk">
                  {name}
                </span>
                <span className="sr-only">{t(categoryKey)}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="grid gap-x-12 gap-y-9 md:grid-cols-2">
          {skills.map((category, index) => (
            <Reveal key={category.id} delay={index * 55}>
              <div className="border-t border-line pt-5">
                <header className="mb-4 flex items-baseline justify-between gap-4">
                  <h3 className="flex items-baseline gap-3">
                    <span className="index-num text-xs text-neon">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="tracking-tight text-chalk text-lg">
                      {category.title}
                    </span>
                  </h3>
                  <span className="index-num text-[11px] text-dim">
                    {String(category.items.length).padStart(2, "0")}
                  </span>
                </header>
                <ul className="flex flex-wrap gap-1.5">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <span className="tag">
                        {item.name}
                        {item.note && (
                          <span className="ms-1 text-dim">({item.note})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
