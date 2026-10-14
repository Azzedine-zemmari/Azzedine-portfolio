import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Check,
} from "lucide-react";
import type { Architecture } from "../../data/engineering";
import { useT } from "../../i18n";
import { useReducedMotion } from "../../hooks/useUi";

gsap.registerPlugin(ScrollTrigger);

const STEP_MS = 2800;

export function RequestLifecycle({
  arch,
  selectedId,
  onSelect,
}: {
  arch: Architecture;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const steps = arch.lifecycle;
  const t = useT();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduced = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const step = steps[Math.min(index, steps.length - 1)];

  const go = useCallback(
    (next: number) => {
      setIndex(((next % steps.length) + steps.length) % steps.length);
    },
    [steps.length]
  );

  const restart = useCallback(() => {
    setIndex(0);
    setPlaying(true);
  }, []);

  // Keep the architecture diagram in sync with the active step (highlight).
  useEffect(() => {
    if (step) onSelect(step.node);
  }, [step, onSelect]);

  // Auto-advance while playing and visible.
  useEffect(() => {
    if (reduced || !playing) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % steps.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reduced, playing, steps.length]);

  // ScrollTrigger gates playback to when the section is actually on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => setPlaying(true),
      onEnterBack: () => setPlaying(true),
      onLeave: () => setPlaying(false),
      onLeaveBack: () => setPlaying(false),
    });
    return () => st.kill();
  }, [reduced, arch.id]);

  // Animate the detail card on each step change.
  useEffect(() => {
    if (reduced || !detailRef.current) return;
    const tween = gsap.fromTo(
      detailRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
    return () => {
      tween.kill();
    };
  }, [index, reduced, arch.id]);

  return (
    <div ref={sectionRef} className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* step rail */}
      <ol className="relative">
        <span
          className="absolute top-2 bottom-2 start-[7px] w-px bg-line"
          aria-hidden="true"
        />
        {steps.map((s, i) => {
          const active = i === index;
          const done = i < index;
          const nodeSelected = selectedId === s.node;
          return (
            <li key={s.title} className="relative">
              <button
                type="button"
                onClick={() => {
                  go(i);
                  setPlaying(false);
                }}
                aria-current={active ? "step" : undefined}
                className="group flex w-full items-start gap-3 py-2.5 text-start"
              >
                <span
                  className={`relative z-10 mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-colors ${
                    active
                      ? "border-neon bg-neon text-void"
                      : done
                        ? "border-neon/60 bg-neon/20 text-neon"
                        : "border-line-2 bg-void text-dim group-hover:border-neon/50"
                  }`}
                  aria-hidden="true"
                >
                  {done ? (
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block font-mono text-[11px] transition-colors ${
                      active ? "text-chalk" : "text-mist group-hover:text-chalk"
                    }`}
                  >
                    {s.title}
                  </span>
                  {nodeSelected && (
                    <span className="mt-0.5 block text-[10px] text-neon">
                      {t("eng.lifecycle.highlighted")}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* current step detail */}
      <div className="min-w-0">
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-3 border-b border-line bg-abyss/60 px-4 py-2.5">
            <span className="eyebrow">
              {t("eng.lifecycle.step", {
                current: String(index + 1).padStart(2, "0"),
                total: String(steps.length).padStart(2, "0"),
              })}
            </span>
            {step.status && (
              <span className="ms-auto flex flex-wrap items-center justify-end gap-x-2 gap-y-1 rounded-[2px] border border-line-2 px-2 py-0.5 font-mono text-[10px] text-cyan">
                {step.status}
              </span>
            )}
          </div>

          <div ref={detailRef} className="p-5">
            <h3 className="text-xl tracking-tight text-chalk text-pretty">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-chalk/90 text-pretty">
              {step.what}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mist text-pretty">
              {step.detail}
            </p>
            <p className="mt-4 flex items-center gap-2 font-mono text-[10px] text-dim">
              <span className="h-1.5 w-1.5 bg-neon" aria-hidden="true" />
              {t("eng.lifecycle.happensIn", { node: step.node })}
            </p>
          </div>

          {/* progress bar */}
          <div className="flex h-2 gap-px bg-line px-px" aria-hidden="true">
            {steps.map((s, i) => (
              <span
                key={s.title}
                className={`flex-1 ${i <= index ? "bg-neon" : "bg-transparent"}`}
              />
            ))}
          </div>
        </div>

          <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost px-2.5 py-1.5 text-[11px]"
            onClick={() => {
              go(index - 1);
              setPlaying(false);
            }}
          >
            <SkipBack className="h-3.5 w-3.5" aria-hidden="true" /> {t("eng.lifecycle.prev")}
          </button>
          <button
            type="button"
            className="btn btn-ghost px-2.5 py-1.5 text-[11px]"
            aria-pressed={playing}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? (
              <>
                <Pause className="h-3.5 w-3.5" aria-hidden="true" /> {t("eng.lifecycle.pause")}
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" aria-hidden="true" /> {t("eng.lifecycle.play")}
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-ghost px-2.5 py-1.5 text-[11px]"
            onClick={() => {
              go(index + 1);
              setPlaying(false);
            }}
          >
            {t("eng.lifecycle.next")} <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn btn-ghost px-2.5 py-1.5 text-[11px]"
            onClick={restart}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> {t("eng.lifecycle.replay")}
          </button>
        </div>

        <p className="mt-3 font-mono text-[10px] leading-relaxed text-dim">
          {t("eng.lifecycle.note")}
        </p>
      </div>
    </div>
  );
}
