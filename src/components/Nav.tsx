import { useEffect, useRef, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { useContent, useT } from "../i18n";
import { useEscapeKey } from "../hooks/useUi";
import { ThemeToggle } from "./ui/ThemeToggle";
import { LanguageSwitcher } from "./ui/LanguageSwitcher";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Nav() {
  const t = useT();
  const { navSections, site } = useContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const animateActiveLink = (newActive: string) => {
    const links = navLinksRef.current;
    links.forEach((link) => {
      if (!link) return;
      const href = link.getAttribute("href")?.slice(1);
      if (href === newActive) {
        gsap.to(link, { color: "var(--color-neon)", duration: 0.3, ease: "power2.out" });
        gsap.fromTo(
          link,
          { scale: 1 },
          { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut" }
        );
      } else {
        gsap.to(link, { color: "var(--color-mist)", duration: 0.3, ease: "power2.out" });
      }
    });
  };

  useEscapeKey(menuOpen, () => setMenuOpen(false));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const ids = navSections.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const newActive = visible.target.id;
          setActive(newActive);
          animateActiveLink(newActive);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-void/95 backdrop-blur-sm"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label={t("nav.aria")}
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <a
          href="#home"
          className="group flex items-center gap-2.5"
          aria-label={t("nav.home", { name: site.name })}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded border border-line-2 font-serif text-sm text-chalk transition-colors group-hover:border-neon group-hover:text-neon">
            az
          </span>
          <span className="font-mono text-sm text-mist transition-colors group-hover:text-chalk">
            {site.name.toLowerCase()}
            <span className="text-neon">.dev</span>
          </span>
        </a>

        <ul className="hidden items-center gap-0.5 xl:gap-1 lg:flex min-w-0">
          {navSections.slice(1).map((section, idx) => (
            <li key={section.id} className="min-w-0">
              <a
                ref={(el) => {
                  navLinksRef.current[idx] = el;
                }}
                href={`#${section.id}`}
                aria-current={active === section.id ? "true" : undefined}
                className={`relative rounded px-2 xl:px-3 py-2 font-mono text-[11px] xl:text-xs tracking-widest uppercase transition-colors after:absolute after:bottom-0 after:start-1/2 after:-translate-x-1/2 after:h-0.5 after:w-0 after:bg-neon after:transition-all hover:after:w-full ${
                  active === section.id
                    ? "text-neon after:w-full"
                    : "text-mist hover:text-chalk"
                }`}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <a
            className="btn hidden sm:inline-flex"
            href="/cv.pdf"
            download="ZEMMARI_AZZEDINE_CV.pdf"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {t("nav.cv")}
          </a>
          <a className="btn btn-primary hidden sm:inline-flex" href={`mailto:${site.email}`}>
            {t("nav.hire")}
          </a>
          <button
            type="button"
            className="btn btn-ghost px-2 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-b border-line bg-void/95 backdrop-blur-sm lg:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navSections.map((section) => (
              <li key={section.id} className="min-w-0">
                <a
                  href={`#${section.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded px-3 py-3 font-mono text-sm text-mist hover:bg-panel-2 hover:text-neon"
                >
                  {section.label}
                  <span className="text-dim" aria-hidden="true">
                    #{section.id}
                  </span>
                </a>
              </li>
            ))}
            <li className="mt-2 flex gap-2">
              <a className="btn flex-1" href="/cv.pdf" download="ZEMMARI_AZZEDINE_CV.pdf">
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                {t("nav.cv")}
              </a>
              <a
                className="btn btn-primary flex-1"
                href={`mailto:${site.email}`}
                onClick={() => setMenuOpen(false)}
              >
                {t("nav.hire")}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}