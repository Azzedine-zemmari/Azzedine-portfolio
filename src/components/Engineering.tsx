import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useEngineering, useRich, useT } from "../i18n";
import { ArchitectureExplorer } from "./engineering/ArchitectureExplorer";
import { RequestLifecycle } from "./engineering/RequestLifecycle";
import { DatabaseDesignExplorer } from "./engineering/DatabaseDesignExplorer";
import { ApiPlayground } from "./engineering/ApiPlayground";
import { CaseStudies } from "./engineering/CaseStudies";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Engineering() {
  const t = useT();
  const rich = useRich();
  const { architectures } = useEngineering();
  const [archId, setArchId] = useState(architectures[0].id);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const arch = useMemo(
    () => architectures.find((a) => a.id === archId) ?? architectures[0],
    [archId, architectures]
  );

  const onSelect = useCallback((id: string | null) => setSelectedId(id), []);

  return (
    <section
      id="engineering"
      className="relative scroll-mt-20 py-20 md:py-28"
      aria-labelledby="engineering-title"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="engineering-title"
          index="03"
          kicker={t("eng.kicker")}
          title={rich(t("eng.title"))}
          lead={t("eng.lead")}
        />

        {/* shared project selector */}
        <Reveal className="mb-6">
          <p className="eyebrow mb-3">{t("eng.choose")}</p>
          <div
            className="flex flex-wrap gap-1.5"
            role="tablist"
            aria-label={t("eng.chooseAria")}
          >
            {architectures.map((a) => {
              const active = a.id === arch.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setArchId(a.id);
                    setSelectedId(null);
                  }}
                  className={`rounded-sm border px-3 py-2 text-start font-mono text-[11px] tracking-wide transition-colors ${
                    active
                      ? "border-neon/70 bg-panel-2 text-chalk"
                      : "border-line text-mist hover:border-line-2 hover:text-chalk"
                  }`}
                >
                  <span className="block">{a.name}</span>
                  <span className="block text-[10px] text-dim">
                    {a.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal>
          <ArchitectureExplorer
            arch={arch}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        </Reveal>

        <SubBlock
          id="request-lifecycle"
          index="03.1"
          kicker={t("eng.lifecycle.kicker")}
          title={t("eng.lifecycle.title")}
          lead={t("eng.lifecycle.lead")}
        >
          <Reveal>
            <RequestLifecycle
              arch={arch}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </Reveal>
        </SubBlock>

        <SubBlock
          id="database"
          index="03.2"
          kicker={t("eng.db.kicker")}
          title={t("eng.db.title")}
          lead={t("eng.db.lead")}
        >
          <Reveal>
            <DatabaseDesignExplorer />
          </Reveal>
        </SubBlock>

        <SubBlock
          id="api"
          index="03.3"
          kicker={t("eng.api.kicker")}
          title={t("eng.api.title")}
          lead={t("eng.api.lead")}
        >
          <Reveal>
            <ApiPlayground />
          </Reveal>
        </SubBlock>

        <SubBlock
          id="case-studies"
          index="03.4"
          kicker={t("eng.cases.kicker")}
          title={t("eng.cases.title")}
          lead={t("eng.cases.lead")}
        >
          <Reveal>
            <CaseStudies />
          </Reveal>
        </SubBlock>
      </div>
    </section>
  );
}

function SubBlock({
  id,
  index,
  kicker,
  title,
  lead,
  children,
}: {
  id: string;
  index: string;
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div id={id} className="mt-16 scroll-mt-24 md:mt-24">
      <Reveal className="mb-8">
        <p className="eyebrow mb-3 flex items-center gap-3">
          <span className="text-neon">{index}</span>
          <span className="h-px w-8 bg-line-2" aria-hidden="true" />
          <span>{kicker}</span>
        </p>
        <h3 className="display text-2xl text-chalk text-balance sm:text-3xl md:text-4xl">
          {title}
        </h3>
        {lead && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist text-pretty md:text-base">
            {lead}
          </p>
        )}
      </Reveal>
      {children}
    </div>
  );
}
