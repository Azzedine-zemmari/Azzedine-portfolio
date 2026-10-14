import { Nav } from "./components/Nav";
import { SiteBackground } from "./components/SiteBackground";
import { HeroSection } from "./components/HeroSection";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Engineering } from "./components/Engineering";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Assistant } from "./components/Assistant";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { useT } from "./i18n";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const t = useT();
  useEffect(() => {
    gsap.config({
      nullTargetWarn: false,
    });

    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.globalTimeline.timeScale(0);
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      gsap.globalTimeline.timeScale(e.matches ? 0 : 1);
      ScrollTrigger.refresh();
    };
    mq.addEventListener("change", handler);

    return () => {
      mq.removeEventListener("change", handler);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      <SiteBackground />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <a
        href="#main"
        className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50"
      >
        {t("app.skip")}
      </a>

      <div className="relative min-h-screen">
        <Nav />

        <main id="main" className="pt-16">
          <HeroSection />
          <About />
          <Skills />
          <Engineering />
          <Projects />
          <Experience />
          <Contact />
        </main>

        <Footer />
        <Assistant />
      </div>
    </>
  );
}

export default App;