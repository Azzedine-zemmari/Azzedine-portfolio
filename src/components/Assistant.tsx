import { useEffect, useRef, useState } from "react";
import { MessageSquare, RotateCcw, Send, X } from "lucide-react";
import { answerQuestion } from "../lib/assistant";
import type { AssistantLink } from "../lib/assistant";
import { useContent, useT } from "../i18n";
import { useEscapeKey, useReducedMotion } from "../hooks/useUi";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  links?: AssistantLink[];
  followUps?: string[];
}

let nextId = 1;

export function Assistant() {
  const t = useT();
  const { suggestions } = useContent();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 0, role: "assistant", text: t("assistant.intro") },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [streamingId, setStreamingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  // Keep the intro in sync with the active locale while the chat is untouched.
  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].id === 0
        ? [{ ...prev[0], text: t("assistant.intro") }]
        : prev,
    );
  }, [t]);

  useEscapeKey(open, () => {
    setOpen(false);
    launcherRef.current?.focus();
  });

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking, open]);

  useEffect(
    () => () => {
      if (streamRef.current) window.clearInterval(streamRef.current);
    },
    [],
  );

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || thinking) return;
    const userMessage: ChatMessage = {
      id: nextId++,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setThinking(true);

    window.setTimeout(() => {
      const answer = answerQuestion(trimmed);
      const reply: ChatMessage = {
        id: nextId++,
        role: "assistant",
        text: reducedMotion ? answer.text : "",
        links: answer.links,
        followUps: answer.followUps,
      };
      setThinking(false);
      setMessages((prev) => [...prev, reply]);
      if (reducedMotion) return;

      // progressive reveal — word by word
      const words = answer.text.split(/(\s+)/);
      let cursor = 0;
      streamRef.current = window.setInterval(() => {
        cursor += 2; // word + space pairs per tick
        const partial = words.slice(0, cursor).join("");
        setMessages((prev) =>
          prev.map((m) => (m.id === reply.id ? { ...m, text: partial } : m)),
        );
        if (cursor >= words.length) {
          if (streamRef.current) window.clearInterval(streamRef.current);
          streamRef.current = null;
          setStreamingId(null);
        } else {
          setStreamingId(reply.id);
        }
      }, 28);
    }, 420);
  };

  const reset = () => {
    if (streamRef.current) window.clearInterval(streamRef.current);
    streamRef.current = null;
    setThinking(false);
    setStreamingId(null);
    setMessages([{ id: 0, role: "assistant", text: t("assistant.intro") }]);
  };

  const showSuggestions = messages.filter((m) => m.role === "user").length === 0;

  return (
    <>
      {/* launcher */}
      <button
        ref={launcherRef}
        type="button"
        aria-expanded={open}
        aria-controls="assistant-panel"
        onClick={() => setOpen((v) => !v)}
        className={`fixed end-4 bottom-4 z-50 flex h-12 items-center gap-2 rounded border px-4 font-mono text-xs tracking-widest uppercase shadow-[0_10px_30px_-10px_var(--panel-shadow)] transition-colors sm:end-6 sm:bottom-6 ${
          open
            ? "border-line-2 bg-panel-2 text-mist"
            : "border-neon bg-neon text-on-neon hover:bg-neon-dim hover:border-neon-dim"
        }`}
      >
        {open ? (
          <X className="h-4 w-4" aria-hidden="true" />
        ) : (
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
        )}
        {open ? t("assistant.close") : t("assistant.ask")}
      </button>

      {/* panel */}
      {open && (
        <section
          id="assistant-panel"
          aria-label={t("assistant.aria")}
          className="panel fixed inset-x-3 bottom-20 z-50 flex max-h-[75dvh] flex-col overflow-hidden shadow-[0_24px_60px_-20px_var(--panel-shadow)] sm:inset-x-auto sm:end-6 sm:bottom-22 sm:w-[390px]"
        >
          <header className="flex items-center gap-2.5 border-b border-line bg-abyss/80 px-4 py-2.5">
            <span className="h-1.5 w-1.5 bg-neon" aria-hidden="true" />
            <h2 className="font-mono text-xs text-mist">
              {t("assistant.header")}
              <span className="text-neon"> {t("assistant.headerSession")} </span>
              <span className="text-dim">{t("assistant.headerMemory")}</span>
            </h2>
            <button
              type="button"
              onClick={reset}
              className="ms-auto rounded p-1.5 text-dim hover:bg-line/60 hover:text-chalk"
              aria-label={t("assistant.reset")}
              title={t("assistant.reset")}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </header>

          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={message.role === "user" ? "text-end" : ""}
              >
                <p
                  className={
                    message.role === "user"
                      ? "inline-block rounded rounded-se-none border border-line-2 bg-panel-2 px-3 py-2 text-start whitespace-pre-wrap text-chalk"
                      : "whitespace-pre-wrap text-mist"
                  }
                >
                  {message.role === "assistant" && (
                    <span className="me-1.5 text-neon">az:</span>
                  )}
                  {message.text}
                  {streamingId === message.id && (
                    <span className="caret ms-0.5" aria-hidden="true" />
                  )}
                </p>

                {message.links && message.links.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {message.links.map((link) => {
                      const external = link.href.startsWith("http") || link.href.startsWith("mailto");
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          {...(external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="tag hover:text-neon"
                        >
                          {link.label} ↗
                        </a>
                      );
                    })}
                  </div>
                )}

                {message.followUps && message.followUps.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {message.followUps.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => ask(q)}
                        className="tag text-start hover:text-neon"
                      >
                        › {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {thinking && (
              <p className="text-mist">
                <span className="me-1.5 text-neon">az:</span>
                <span className="caret" aria-hidden="true" />
                <span className="sr-only">{t("assistant.typing")}</span>
              </p>
            )}

            {showSuggestions && (
              <div className="pt-2">
                <p className="eyebrow mb-2">{t("assistant.suggested")}</p>
                <div className="flex flex-col gap-1.5">
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => ask(q)}
                      className="tag text-start hover:text-neon"
                    >
                      › {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-line px-3 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <label htmlFor="assistant-input" className="sr-only">
              {t("assistant.inputLabel")}
            </label>
            <span className="font-mono text-sm text-neon" aria-hidden="true">
              ›
            </span>
            <input
              id="assistant-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("assistant.placeholder")}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-chalk placeholder:text-dim focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="rounded p-2 text-neon hover:bg-neon/10 disabled:text-dim disabled:hover:bg-transparent"
              aria-label={t("assistant.sendLabel")}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
