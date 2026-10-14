import { useMemo, useState } from "react";
import { Play, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import type { ApiExample } from "../../data/engineering";
import { useEngineering, useT } from "../../i18n";

const METHOD_COLOR: Record<ApiExample["method"], string> = {
  GET: "text-cyan border-cyan/40",
  POST: "text-neon border-neon/40",
  PUT: "text-amber border-amber/40",
  DELETE: "text-neon border-neon/40",
};

function statusColor(status: number): string {
  if (status >= 200 && status < 300) return "text-cyan border-cyan/40";
  if (status >= 400 && status < 500) return "text-neon border-neon/40";
  return "text-neon border-neon/40";
}

export function ApiPlayground() {
  const t = useT();
  const { apiExamples } = useEngineering();
  const [exampleId, setExampleId] = useState(apiExamples[0].id);
  const [tab, setTab] = useState<"request" | "response">("response");
  const [showError, setShowError] = useState(false);
  const [sending, setSending] = useState(false);
  const [param, setParam] = useState("42");

  const example = useMemo(
    () => apiExamples.find((e) => e.id === exampleId) ?? apiExamples[0],
    [exampleId, apiExamples]
  );

  const hasParam = example.path.includes("{id}");
  const resolvedPath = example.path.replace("{id}", param || "{id}");
  const outcome =
    showError && example.errorCase ? example.errorCase : null;
  const status = outcome ? outcome.status : example.response.status;
  const statusText = outcome ? outcome.statusText : example.response.statusText;
  const body = outcome ? outcome.body : example.response.body;

  const send = () => {
    setSending(true);
    setTab("response");
    window.setTimeout(() => setSending(false), 650);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* endpoint list */}
      <div className="min-w-0">
        <ul className="space-y-1.5">
          {apiExamples.map((e) => {
            const active = e.id === exampleId;
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => {
                    setExampleId(e.id);
                    setShowError(false);
                    setTab("request");
                  }}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-2 rounded-sm border px-2.5 py-2 text-start transition-colors ${
                    active
                      ? "border-neon/70 bg-panel-2"
                      : "border-line hover:border-line-2"
                  }`}
                >
                  <span
                    className={`shrink-0 rounded-[2px] border px-1.5 py-0.5 font-mono text-[10px] ${METHOD_COLOR[e.method]}`}
                  >
                    {e.method}
                  </span>
                  <span className="min-w-0 truncate font-mono text-[11px] text-mist">
                    {e.path}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* request/response */}
      <div className="min-w-0">
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line bg-abyss/60 px-4 py-2.5">
            <span className={`rounded-[2px] border px-1.5 py-0.5 font-mono text-[10px] ${METHOD_COLOR[example.method]}`}>
              {example.method}
            </span>
            <span className="truncate font-mono text-[11px] text-chalk">
              {resolvedPath}
            </span>
            <span
              className={`ms-auto shrink-0 rounded-[2px] border px-2 py-0.5 font-mono text-[10px] ${statusColor(
                status
              )}`}
            >
              {status} {statusText}
            </span>
          </div>

          <div className="p-4">
            <h4 className="text-base tracking-tight text-chalk">{example.title}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-mist text-pretty">
              {example.description}
            </p>

            <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-dim">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan" aria-hidden="true" />
              <span>
                <span className="text-mist">{t("eng.api.auth")}</span> {example.auth}
              </span>
            </p>

            {hasParam && (
              <label className="mt-4 flex items-center gap-2 font-mono text-[11px] text-mist">
                <span className="force-ltr text-dim" dir="ltr">{"{id}"} =</span>
                <input
                  value={param}
                  onChange={(e) => setParam(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  className="field w-28 py-1"
                  aria-label={t("eng.api.pathParam")}
                />
              </label>
            )}

            {/* tabs */}
            <div className="mt-4 flex gap-1 border-b border-line" role="tablist">
              {(["request", "response"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={tab === value}
                  onClick={() => setTab(value)}
                  className={`-mb-px border-b-2 px-3 py-1.5 font-mono text-[11px] uppercase transition-colors ${
                    tab === value
                      ? "border-neon text-chalk"
                      : "border-transparent text-dim hover:text-mist"
                  }`}
                >
                  {t(value === "request" ? "eng.api.tabRequest" : "eng.api.tabResponse")}
                </button>
              ))}
            </div>

            <div className="mt-3">
              {tab === "request" ? (
                <div className="space-y-3">
                  {example.request?.headers && (
                    <div>
                      <p className="eyebrow mb-1.5">{t("eng.api.headers")}</p>
                      <pre className="overflow-x-auto rounded-sm border border-line bg-void p-3 font-mono text-[11px] leading-relaxed text-mist">
                        {Object.entries(example.request.headers)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join("\n")}
                      </pre>
                    </div>
                  )}
                  {example.request?.body !== undefined ? (
                    <div>
                      <p className="eyebrow mb-1.5">{t("eng.api.body")}</p>
                      <pre className="overflow-x-auto rounded-sm border border-line bg-void p-3 font-mono text-[11px] leading-relaxed text-mist">
                        {JSON.stringify(example.request.body, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <p className="font-mono text-[11px] text-dim">
                      {t("eng.api.noBody")}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  {outcome && (
                    <p className="mb-2 flex items-start gap-2 text-[11px] leading-relaxed text-neon">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{outcome.why}</span>
                    </p>
                  )}
                  <pre className="max-h-72 overflow-auto rounded-sm border border-line bg-void p-3 font-mono text-[11px] leading-relaxed text-chalk">
                    {sending ? "…" : JSON.stringify(body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-3">
            <button
              type="button"
              onClick={send}
              disabled={sending}
              className="btn btn-primary px-3 py-1.5 text-[11px] disabled:opacity-60"
            >
              {sending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {t("eng.api.send")}
            </button>
            {example.errorCase && (
              <button
                type="button"
                onClick={() => {
                  setShowError((s) => !s);
                  setTab("response");
                }}
                aria-pressed={showError}
                className="btn btn-ghost px-2.5 py-1.5 text-[11px]"
              >
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                {showError ? t("eng.api.showSuccess") : t("eng.api.simulateFailure")}
              </button>
            )}
            <span className="ms-auto font-mono text-[10px] text-dim">
              {t("eng.api.simulated")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
