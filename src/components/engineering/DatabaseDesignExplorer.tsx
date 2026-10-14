import { useMemo, useState } from "react";
import { KeyRound, Link2 } from "lucide-react";
import type { DbEntity } from "../../data/engineering";
import { useEngineering, useT } from "../../i18n";

const BOX_W = 268;
const HEADER_H = 34;
const ROW_H = 20;
const PAD_B = 8;

function boxHeight(e: DbEntity): number {
  return HEADER_H + e.attributes.length * ROW_H + PAD_B;
}

export function DatabaseDesignExplorer() {
  const t = useT();
  const { dbModel } = useEngineering();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { entities, relations } = dbModel;

  const byId = useMemo(() => {
    const map: Record<string, DbEntity> = {};
    for (const e of entities) map[e.id] = e;
    return map;
  }, [entities]);

  const view = useMemo(() => {
    const maxX = Math.max(...entities.map((e) => e.x + BOX_W)) + 40;
    const maxY = Math.max(...entities.map((e) => e.y + boxHeight(e))) + 40;
    return { w: maxX, h: maxY };
  }, [entities]);

  const selected = selectedId ? (byId[selectedId] ?? null) : null;

  const related = useMemo(
    () =>
      relations.filter(
        (r) => r.from === selectedId || r.to === selectedId
      ),
    [relations, selectedId]
  );

  const isDim = (id: string) =>
    selectedId !== null &&
    id !== selectedId &&
    !related.some((r) => r.from === id || r.to === id);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0">
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line bg-abyss/60 px-4 py-2.5">
            <span className="h-1.5 w-1.5 bg-cyan" aria-hidden="true" />
            <span className="eyebrow">{dbModel.name.toLowerCase().replace(/\s+/g, "-")}.sql</span>
            <span className="ms-auto hidden font-mono text-[10px] text-dim sm:block">
              {t("eng.db.hint")}
            </span>
          </div>
            <div className="overflow-x-auto" dir="ltr">
            <svg
              viewBox={`0 0 ${view.w} ${view.h}`}
              className="h-auto w-full min-w-[720px]"
              fontFamily="var(--font-mono)"
            >
              {/* relations */}
              {relations.map((r) => {
                const a = byId[r.from];
                const b = byId[r.to];
                if (!a || !b) return null;
                const x1 = a.x + BOX_W / 2;
                const y1 = a.y + boxHeight(a) / 2;
                const x2 = b.x + BOX_W / 2;
                const y2 = b.y + boxHeight(b) / 2;
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2;
                const active =
                  selectedId === null ||
                  r.from === selectedId ||
                  r.to === selectedId;
                return (
                  <g key={`${r.from}-${r.to}`} opacity={active ? 0.95 : 0.2}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--color-line-2)"
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                    />
                    <rect
                      x={mx - 26}
                      y={my - 11}
                      width={52}
                      height={18}
                      rx={2}
                      fill="var(--color-void)"
                      stroke="var(--color-line-2)"
                    />
                    <text
                      x={mx}
                      y={my + 2}
                      textAnchor="middle"
                      fontSize={10}
                      fill="var(--color-cyan)"
                    >
                      {r.cardinality}
                    </text>
                  </g>
                );
              })}

              {/* entities */}
              {entities.map((e) => {
                const h = boxHeight(e);
                const active = e.id === selectedId;
                const dim = isDim(e.id);
                return (
                  <g
                    key={e.id}
                    transform={`translate(${e.x} ${e.y})`}
                    opacity={dim ? 0.35 : 1}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedId((prev) => (prev === e.id ? null : e.id))
                    }
                    role="button"
                    tabIndex={0}
                    aria-label={`${e.name}: ${e.purpose}`}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter" || ev.key === " ") {
                        ev.preventDefault();
                        setSelectedId((prev) =>
                          prev === e.id ? null : e.id
                        );
                      }
                    }}
                  >
                    <rect
                      width={BOX_W}
                      height={h}
                      rx={3}
                      fill="var(--color-panel)"
                      stroke={active ? "var(--color-neon)" : "var(--color-line-2)"}
                      strokeWidth={active ? 1.5 : 1}
                    />
                    <rect
                      width={BOX_W}
                      height={HEADER_H}
                      rx={3}
                      fill={active ? "rgba(255,91,46,0.14)" : "var(--color-panel-2)"}
                    />
                    <text
                      x={12}
                      y={22}
                      fontSize={13}
                      fill="var(--color-chalk)"
                      fontWeight={600}
                    >
                      {e.name}
                    </text>

                    {e.attributes.map((a, i) => {
                      const y = HEADER_H + (i + 1) * ROW_H - 6;
                      return (
                        <g key={a.name}>
                          {i > 0 && (
                            <line
                              x1={0}
                              y1={HEADER_H + i * ROW_H}
                              x2={BOX_W}
                              y2={HEADER_H + i * ROW_H}
                              stroke="var(--color-line)"
                              strokeWidth={0.5}
                            />
                          )}
                          <text x={16} y={y} fontSize={11} fill="var(--color-mist)">
                            {a.name}
                          </text>
                          <text
                            x={BOX_W - 12}
                            y={y}
                            fontSize={10}
                            textAnchor="end"
                            fill="var(--color-dim)"
                          >
                            {a.type}
                          </text>
                          {a.pk && (
                            <circle
                              cx={8}
                              cy={y - 3.5}
                              r={2.6}
                              fill="var(--color-amber)"
                            />
                          )}
                          {a.fk && (
                            <text
                              x={BOX_W - 60}
                              y={y}
                              fontSize={9}
                              textAnchor="start"
                              fill="var(--color-cyan)"
                            >
                              FK
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-dim">
          {dbModel.note}{" "}
          <KeyRound className="inline h-3 w-3 align-[-1px]" aria-hidden="true" />{" "}
          {t("eng.db.pk")} ·{" "}
          <Link2 className="inline h-3 w-3 align-[-1px]" aria-hidden="true" />{" "}
          {t("eng.db.fk")}.
        </p>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line bg-abyss/60 px-4 py-2.5">
            <span className="h-1.5 w-1.5 bg-amber" aria-hidden="true" />
            <span className="eyebrow">{t("eng.db.entity")}</span>
          </div>
          {selected ? (
            <div className="p-4">
              <h4 className="font-mono text-lg text-chalk">{selected.name}</h4>
              <p className="mt-2 text-sm leading-relaxed text-mist text-pretty">
                {selected.purpose}
              </p>
              <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
                {selected.attributes.map((a) => (
                  <li
                    key={a.name}
                    className="flex items-baseline justify-between gap-3 font-mono text-[11px]"
                  >
                    <span className="flex items-center gap-1.5 text-chalk">
                      {a.name}
                      {a.pk && <span className="text-[9px] text-amber">PK</span>}
                      {a.fk && (
                        <span className="text-[9px] text-cyan" title={`→ ${a.fk}`}>
                          FK
                        </span>
                      )}
                    </span>
                    <span className="text-dim">{a.type}</span>
                  </li>
                ))}
              </ul>
              {related.length > 0 && (
                <div className="mt-4 border-t border-line pt-3">
                  <p className="eyebrow mb-2">{t("eng.db.relations")}</p>
                  <ul className="space-y-1.5">
                    {related.map((r) => (
                      <li
                        key={`${r.from}-${r.to}`}
                        className="font-mono text-[11px] text-mist"
                      >
                        <span className="text-cyan">{r.cardinality}</span>{" "}
                        {r.from} <span className="text-dim">→</span> {r.to}{" "}
                        <span className="text-dim">({r.label})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <h4 className="text-base tracking-tight text-chalk">
                {t("eng.db.emptyTitle")}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-mist text-pretty">
                {t("eng.db.emptyBody")}
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
