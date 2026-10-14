import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LOCALES, useLocale, type Locale } from "../../i18n/locale";
import { useEscapeKey } from "../../hooks/useUi";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEscapeKey(open, () => setOpen(false));

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const choose = (code: Locale) => {
    setLocale(code);
    setOpen(false);
  };

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className="btn btn-ghost gap-1.5 px-2"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Change language — current: ${current.english}`}
        title="Language"
        onClick={() => setOpen((v) => !v)}
      >
        <Globe className="h-5 w-5" aria-hidden="true" />
        <span className="font-mono text-xs">{current.short}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="panel absolute end-0 z-50 mt-2 w-44 overflow-hidden p-1"
        >
          {LOCALES.map((meta) => {
            const active = meta.code === locale;
            return (
              <li key={meta.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  lang={meta.code}
                  onClick={() => choose(meta.code)}
                  className={`flex w-full items-center justify-between rounded px-3 py-2 text-start text-sm transition-colors hover:bg-panel-2 ${
                    active ? "text-neon" : "text-mist hover:text-chalk"
                  }`}
                >
                  <span className="flex flex-col">
                    <span>{meta.label}</span>
                    <span className="font-mono text-[0.65rem] text-dim">
                      {meta.english}
                    </span>
                  </span>
                  {active && <Check className="h-4 w-4" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
