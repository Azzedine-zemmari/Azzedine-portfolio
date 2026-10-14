import { ExternalLink, GitBranch, Scale, ListChecks } from "lucide-react";
import { useEngineering, useT } from "../../i18n";

export function CaseStudies() {
  const t = useT();
  const { caseStudies } = useEngineering();
  return (
    <div className="space-y-6">
      {caseStudies.map((cs, i) => (
        <article key={cs.id} className="panel overflow-hidden">
          <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line bg-abyss/60 px-5 py-3.5">
            <span className="index-num text-xs text-neon">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h4 className="text-lg tracking-tight text-chalk text-balance">
              {cs.project}
            </h4>
            <span className="ms-auto hidden font-mono text-[11px] text-dim md:block">
              {t("eng.cases.caseStudy")}
            </span>
          </header>

          <div className="grid gap-x-10 gap-y-6 p-5 md:grid-cols-2">
            <p className="text-sm leading-relaxed text-chalk/90 text-pretty md:col-span-2">
              {cs.summary}
            </p>

            <div>
              <p className="eyebrow mb-2">{t("eng.cases.problem")}</p>
              <p className="text-sm leading-relaxed text-mist text-pretty">
                {cs.problem}
              </p>

              <p className="eyebrow mt-5 mb-2">{t("eng.cases.constraints")}</p>
              <ul className="space-y-1.5">
                {cs.constraints.map((c) => (
                  <li
                    key={c}
                    className="flex gap-2 text-sm leading-relaxed text-mist"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 bg-neon" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>

              <p className="eyebrow mt-5 mb-2">{t("eng.cases.architecture")}</p>
              <p className="text-sm leading-relaxed text-mist text-pretty">
                {cs.architecture}
              </p>
            </div>

            <div>
              <p className="eyebrow mb-2 flex items-center gap-2">
                <GitBranch className="h-3.5 w-3.5 text-neon" aria-hidden="true" />
                {t("eng.cases.decision")}
              </p>
              <p className="text-sm leading-relaxed text-chalk/90 text-pretty">
                {cs.decision}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-mist text-pretty">
                {cs.rationale}
              </p>

              <p className="eyebrow mt-5 mb-2 flex items-center gap-2">
                <Scale className="h-3.5 w-3.5 text-neon" aria-hidden="true" />
                {t("eng.cases.alternatives")}
              </p>
              <ul className="space-y-2.5">
                {cs.alternatives.map((alt) => (
                  <li key={alt.option} className="border-s border-line-2 ps-3">
                    <p className="font-mono text-[11px] text-chalk">{alt.option}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-mist text-pretty">
                      {alt.tradeoff}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <p className="eyebrow mb-2 flex items-center gap-2">
                <ListChecks className="h-3.5 w-3.5 text-neon" aria-hidden="true" />
                {t("eng.cases.quality")}
              </p>
              <dl className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                {cs.quality.map((q) => (
                  <div key={q.label} className="bg-void p-3">
                    <dt className="font-mono text-[10px] tracking-wide text-cyan uppercase">
                      {q.label}
                    </dt>
                    <dd className="mt-1.5 text-[13px] leading-relaxed text-mist text-pretty">
                      {q.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="md:col-span-2">
              <p className="eyebrow mb-2">{t("eng.cases.improvements")}</p>
              <ul className="flex flex-wrap gap-1.5">
                {cs.improvements.map((imp) => (
                  <li key={imp}>
                    <span className="tag">{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <footer className="border-t border-line px-5 py-3">
            <a
              href={cs.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 font-mono text-[11px] text-mist transition-colors hover:text-neon"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              {t("eng.cases.repository")}
            </a>
          </footer>
        </article>
      ))}
    </div>
  );
}
