import { Terminal } from "./Terminal";
import { Hero } from "./Hero";
import { useRich, useT } from "../i18n";

export function HeroSection() {
  const t = useT();
  const rich = useRich();
  return (
    <section id="home" className="relative overflow-hidden">
      <Hero />

      <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 sm:pt-16 relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <p className="eyebrow">{t("shell.title")}</p>
          <p className="hidden font-mono text-[11px] text-dim sm:block">
            {rich(t("shell.hint"))}
          </p>
        </div>

      <Terminal />
    </div>
    </section>
  );
}