import { useEffect, useRef, useState } from "react";
import { useContent, useT } from "../i18n";
import type { UiKey } from "../i18n";
import { answerQuestion } from "../lib/assistant";

type LineKind = "cmd" | "out" | "ok" | "err" | "dim" | "warn" | "link";

interface TermLine {
  kind: LineKind;
  text: string;
  href?: string;
}

const PROMPT = "visitor@portfolio";

type TFn = ReturnType<typeof useT>;

function makeBanner(t: TFn): TermLine[] {
  const inner = (text: string) => `│ ${text.padEnd(45)} │`;
  return [
    { kind: "ok", text: "┌───────────────────────────────────────────────┐" },
    { kind: "ok", text: inner("Z E M M A R I   A Z Z E D I N E") },
    { kind: "dim", text: inner(t("terminal.banner.subtitle")) },
    { kind: "ok", text: "└───────────────────────────────────────────────┘" },
  ];
}

function makeBootScript(t: TFn, siteName: string): Array<{ ok: boolean; text: string }> {
  return [
    { ok: true, text: t("terminal.boot.mount") },
    { ok: true, text: t("terminal.boot.profile", { name: siteName.toLowerCase() }) },
    { ok: true, text: t("terminal.boot.stack") },
    { ok: true, text: t("terminal.boot.assistant") },
  ];
}

function downloadCv() {
  const link = document.createElement("a");
  link.href = "/cv.pdf";
  link.download = "ZEMMARI_AZZEDINE_CV.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }
  return false;
}

function linkLine(label: string, href: string): TermLine {
  return { kind: "link", text: label, href };
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1,
            );
    }
  }
  return matrix[b.length][a.length];
}

const COMMANDS = [
  "help",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "contact",
  "socials",
  "whoami",
  "ls",
  "open",
  "ask",
  "cv",
  "banner",
  "date",
  "clear",
] as const;

function makeOpenTargets(email: string): Record<string, string> {
  return {
    about: "about",
    skills: "skills",
    projects: "projects",
    experience: "experience",
    contact: "contact",
    github: "https://github.com/Azzedine-zemmari",
    linkedin: "https://www.linkedin.com/in/zemmari-azzeddine-039a23210/",
    email: `mailto:${email}`,
    cv: "/cv.pdf",
  };
}

const HELP: Array<[string, UiKey]> = [
  ["help", "terminal.help.help"],
  ["about", "terminal.help.about"],
  ["skills", "terminal.help.skills"],
  ["projects", "terminal.help.projects"],
  ["experience", "terminal.help.experience"],
  ["education", "terminal.help.education"],
  ["contact", "terminal.help.contact"],
  ["socials", "terminal.help.socials"],
  ["whoami", "terminal.help.whoami"],
  ["ls", "terminal.help.ls"],
  ["open <section|url>", "terminal.help.open"],
  ["ask <question>", "terminal.help.ask"],
  ["cv", "terminal.help.cv"],
  ["banner", "terminal.help.banner"],
  ["date", "terminal.help.date"],
  ["clear", "terminal.help.clear"],
];

export function Terminal() {
  const t = useT();
  const { about, skills, projects, journey, site, socials } = useContent();
  const bannerLines = makeBanner(t);
  const bootScript = makeBootScript(t, site.name);
  const OPEN_TARGETS = makeOpenTargets(site.email);
  const [bootLines, setBootLines] = useState<TermLine[]>([]);
  const [booted, setBooted] = useState(false);
  const [lines, setLines] = useState<TermLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef(false);

  // Boot sequence — skippable, instant with reduced motion
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const printAll = () => {
      setBootLines(
        bootScript.map((l) => ({
          kind: (l.ok ? "ok" : "err") as LineKind,
          text: `[ ${l.ok ? "ok" : "fail"} ] ${l.text}`,
        })),
      );
      setBooted(true);
    };
    if (reduced) {
      printAll();
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      if (skipRef.current || i >= bootScript.length) {
        window.clearInterval(id);
        if (i < bootScript.length) printAll();
        else setBooted(true);
        return;
      }
      const l = bootScript[i];
      setBootLines((prev) => [
        ...prev,
        { kind: l.ok ? "ok" : "err", text: `[ ${l.ok ? "ok" : "fail"} ] ${l.text}` },
      ]);
      i++;
      if (i >= bootScript.length) {
        window.clearInterval(id);
        setBooted(true);
      }
    }, 130);
    const skip = () => {
      skipRef.current = true;
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      window.clearInterval(id);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  useEffect(() => {
    if (booted) {
      setLines([
        ...bannerLines,
        { kind: "dim", text: "" },
        { kind: "out", text: t("terminal.welcome.1") },
        { kind: "out", text: t("terminal.welcome.2") },
        { kind: "dim", text: "" },
      ]);
      inputRef.current?.focus();
    }
  }, [booted]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, bootLines]);

  const runCommand = (raw: string) => {
    const value = raw.trim();
    const echoed: TermLine[] = [
      { kind: "cmd", text: `${PROMPT}:~$ ${value}` },
    ];
    if (!value) {
      setLines((prev) => [...prev, { kind: "cmd", text: `${PROMPT}:~$` }]);
      return;
    }
    setHistory((prev) => [value, ...prev]);
    setHistoryIndex(null);

    const [command, ...args] = value.split(/\s+/);
    const out = execute(command.toLowerCase(), args.join(" "));
    setLines((prev) => [...prev, ...echoed, ...out]);
    setInput("");
  };

  const execute = (command: string, rest: string): TermLine[] => {
    switch (command) {
      case "help":
        return [
          { kind: "out", text: t("terminal.help.title") },
          ...HELP.map(([cmd, key]) => ({
            kind: "out" as LineKind,
            text: `  ${cmd.padEnd(21)}${t(key)}`,
          })),
        ];
      case "about":
        return [
          { kind: "out", text: about.summary },
          { kind: "dim", text: "" },
          ...about.paragraphs.flatMap((p) => [
            { kind: "out" as LineKind, text: p },
            { kind: "dim" as LineKind, text: "" },
          ]),
          { kind: "out", text: t("terminal.facts") },
          ...about.facts.map((f) => ({
            kind: "out" as LineKind,
            text: `  ${f.label.padEnd(12)} ${f.value}`,
          })),
        ];
      case "skills":
        return skills.flatMap((cat) => [
          { kind: "ok" as LineKind, text: cat.title.toUpperCase() },
          {
            kind: "out" as LineKind,
            text: `  ${cat.items
              .map((i) => (i.note ? `${i.name} (${i.note})` : i.name))
              .join(" · ")}`,
          },
          { kind: "dim" as LineKind, text: "" },
        ]);
      case "projects":
        return projects.flatMap((p, i) => [
          {
            kind: "ok" as LineKind,
            text: `${String(i + 1).padStart(2, "0")}  ${p.title}${
              p.year ? `  (${p.year})` : ""
            }`,
          },
          { kind: "out" as LineKind, text: `    ${p.stack.join(", ")}` },
          linkLine(`    ${p.repo}`, p.repo),
          { kind: "dim" as LineKind, text: "" },
        ]);
      case "experience":
      case "education":
        return journey.flatMap((j) => [
          {
            kind: "ok" as LineKind,
            text: `${j.period}  ${j.title} — ${j.org}`,
          },
          { kind: "out" as LineKind, text: `  ${j.description}` },
          { kind: "dim" as LineKind, text: "" },
        ]);
      case "contact":
        return [
          { kind: "out", text: t("terminal.contact.email", { email: site.email }) },
          { kind: "out", text: t("terminal.contact.location", { location: site.location }) },
          { kind: "dim", text: "" },
          ...socials.map((s) => linkLine(`  ${s.label}: ${s.href}`, s.href)),
          { kind: "dim", text: "" },
          linkLine(t("terminal.contact.form"), "#contact"),
        ];
      case "socials":
        return socials.map((s) => linkLine(`  ${s.label}: ${s.href}`, s.href));
      case "whoami":
        return [
          {
            kind: "out",
            text: `${site.name} — ${site.role} (${site.focus}), ${site.location}`,
          },
        ];
      case "ls":
        return [
          {
            kind: "out",
            text: "about/   skills/   projects/   experience/   contact/   ./cv.pdf",
          },
        ];
      case "open": {
        if (!rest) {
          return [
            {
              kind: "err",
              text: t("terminal.open.usage"),
            },
          ];
        }
        const target = OPEN_TARGETS[rest.toLowerCase()];
        if (!target) {
          return [
            { kind: "err", text: t("terminal.open.unknown", { target: rest }) },
            {
              kind: "out",
              text: t("terminal.open.try", {
                targets: Object.keys(OPEN_TARGETS).join(", "),
              }),
            },
          ];
        }
        if (target.startsWith("http") || target.startsWith("mailto:")) {
          window.open(target, "_blank", "noopener,noreferrer");
          return [{ kind: "ok", text: t("terminal.open.opening", { target }) }];
        }
        if (target === "/cv.pdf") {
          downloadCv();
          return [{ kind: "ok", text: t("terminal.open.downloadingCv") }];
        }
        const ok = scrollToSection(target);
        return ok
          ? [{ kind: "ok", text: t("terminal.open.navigating", { target }) }]
          : [{ kind: "err", text: t("terminal.open.notFound", { target }) }];
      }
      case "ask": {
        if (!rest) {
          return [
            { kind: "err", text: t("terminal.ask.usage") },
            {
              kind: "out",
              text: t("terminal.ask.example"),
            },
          ];
        }
        const answer = answerQuestion(rest);
        return [
          {
            kind: "out",
            text: answer.text.split("\n").join("\n"),
          },
          ...answer.links.map((l) => linkLine(`  → ${l.label}`, l.href)),
        ];
      }
      case "cv":
        downloadCv();
        return [{ kind: "ok", text: t("terminal.cv.downloading") }];
      case "banner":
        return [...bannerLines, { kind: "dim", text: "" }];
      case "date":
        return [{ kind: "out", text: new Date().toString() }];
      case "clear":
        setLines([]);
        return [];
      case "sudo":
        return [
          { kind: "warn", text: t("terminal.sudo") },
        ];
      default: {
        const close = [...COMMANDS]
          .map((c) => ({ c, d: levenshtein(command, c) }))
          .sort((a, b) => a.d - b.d)[0];
        const suggestion = close && close.d <= 3 ? close.c : null;
        return [
          { kind: "err", text: t("terminal.err.notFound", { command }) },
          suggestion
            ? {
                kind: "out",
                text: t("terminal.err.didYouMean", { suggestion }),
              }
            : { kind: "out", text: t("terminal.err.help") },
        ];
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(input);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next =
        historyIndex === null ? 0 : Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setInput(history[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex - 1;
      if (next < 0) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const value = input.trim().toLowerCase();
      if (!value) return;
      const matches = COMMANDS.filter((c) => c.startsWith(value));
      if (matches.length === 1) setInput(matches[0]);
      else if (matches.length > 1) {
        setLines((prev) => [
          ...prev,
          { kind: "cmd", text: `${PROMPT}:~$ ${value}` },
          { kind: "out", text: matches.join("   ") },
        ]);
      }
      return;
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      className="panel relative overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-abyss/80 px-4 py-3">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 bg-neon"
        />
        <span className="font-mono text-[11px] tracking-wider text-mist">
          {t("terminal.chrome.title")}
        </span>
        <span className="ms-auto hidden font-mono text-[10px] text-dim sm:block">
          {t("terminal.chrome.hint")}
        </span>
      </div>

      {/* screen */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label={t("terminal.aria.output")}
        className="h-[380px] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed sm:h-[420px]"
      >
        {bootLines.map((line, i) => (
          <TermLineView key={`boot-${i}`} line={line} />
        ))}
        {booted &&
          lines.map((line, i) => <TermLineView key={`line-${i}`} line={line} />)}

        {booted && (
          <div className="mt-1 flex items-center gap-2">
            <span className="shrink-0 text-cyan">
              {PROMPT}
              <span className="text-dim">:~$</span>
            </span>
            <label className="sr-only" htmlFor="terminal-input">
              {t("terminal.aria.input")}
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full bg-transparent font-mono text-[13px] text-chalk caret-neon outline-none"
              placeholder={t("terminal.placeholder")}
            />
          </div>
        )}

        {!booted && (
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-xs text-dim animate-pulse">
              {t("terminal.initializing")}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                skipRef.current = true;
              }}
              className="btn btn-ghost px-2 py-1 text-[10px]"
            >
              {t("terminal.skipIntro")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const KIND_CLASS: Record<LineKind, string> = {
  cmd: "text-chalk",
  out: "text-mist",
  ok: "text-neon",
  err: "text-danger",
  dim: "text-dim",
  warn: "text-amber",
  link: "text-cyan underline decoration-cyan/40 underline-offset-4 hover:decoration-cyan",
};

function TermLineView({ line }: { line: TermLine }) {
  if (line.kind === "cmd") {
    return (
      <div className="term-line" data-kind="cmd">
        <span className="text-cyan">{line.text}</span>
      </div>
    );
  }
  if (line.kind === "link" && line.href) {
    const external = line.href.startsWith("http") || line.href.startsWith("mailto:");
    return (
      <div className="term-line">
        <a
          href={line.href}
          className={KIND_CLASS.link}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {line.text}
        </a>
      </div>
    );
  }
  return <div className={`term-line ${KIND_CLASS[line.kind]}`}>{line.text || " "}</div>;
}
