import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import * as THREE from "three";
import { Pause, Play, RotateCcw, MousePointer2 } from "lucide-react";
import {
  ARCH_LAYER_POS,
  type ArchEdge,
  type ArchNodeKind,
  type Architecture,
} from "../../data/engineering";
import { useEngineering, useT, type UiKey } from "../../i18n";
import { useLowPowerDevice, useReducedMotion } from "../../hooks/useUi";
import { TechIcon } from "../ui/TechIcon";

/**
 * Diagram palette.
 *
 * These are *content* colours — they distinguish node/edge categories in a
 * technical diagram, so they intentionally keep their own hues rather than
 * reusing the UI accent. They are CSS custom property references so the
 * categories stay legible in both themes instead of being tuned for one
 * background. The legend swatches use the same source, so a swatch always
 * matches the geometry it describes.
 *
 * The Three.js path cannot consume `var()` and resolves them to numbers via
 * `cssColorToNumber`, keeping the 3D scene on the identical palette.
 */
const KIND_VAR: Record<ArchNodeKind, string> = {
  client: "var(--color-cyan)",
  entry: "var(--color-neon)",
  security: "var(--color-neon-dim)",
  logic: "var(--color-cyan)",
  persistence: "var(--color-mist)",
  store: "var(--color-cyan)",
  ops: "var(--color-violet)",
};

const EDGE_VAR: Record<ArchEdge["kind"], string> = {
  request: "var(--color-neon)",
  response: "var(--color-cyan)",
  data: "var(--color-mist)",
  auth: "var(--color-neon-dim)",
  migration: "var(--color-violet)",
};

const EDGE_LEGEND: Array<{ kind: ArchEdge["kind"]; key: UiKey }> = [
  { kind: "request", key: "eng.arch.edge.request" },
  { kind: "response", key: "eng.arch.edge.response" },
  { kind: "data", key: "eng.arch.edge.data" },
  { kind: "auth", key: "eng.arch.edge.auth" },
  { kind: "migration", key: "eng.arch.edge.migration" },
];

const NODE_LEGEND: Array<{ kind: ArchNodeKind; key: UiKey }> = [
  { kind: "client", key: "eng.arch.node.client" },
  { kind: "entry", key: "eng.arch.node.entry" },
  { kind: "logic", key: "eng.arch.node.logic" },
  { kind: "persistence", key: "eng.arch.node.persistence" },
  { kind: "store", key: "eng.arch.node.store" },
  { kind: "security", key: "eng.arch.node.security" },
];

/** Does this browser expose a usable WebGL context? */
function detectWebgl(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * WebGL support is a client-only value, so it is read through
 * `useSyncExternalStore`: the server snapshot is `false` (matching prerendered
 * markup and giving a crawlable SVG fallback), and React swaps to the live
 * value after hydration without a mismatch.
 */
let webglCache: boolean | null = null;
function getWebglSnapshot(): boolean {
  if (webglCache === null) webglCache = detectWebgl();
  return webglCache;
}
function getServerWebglSnapshot(): boolean {
  return false;
}
function subscribeWebgl(): () => void {
  return () => {};
}

export function ArchitectureExplorer({
  arch,
  selectedId,
  onSelect,
}: {
  arch: Architecture;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const t = useT();
  const { archLayerLabel } = useEngineering();
  const [playing, setPlaying] = useState(true);
  const reduced = useReducedMotion();
  const lowPower = useLowPowerDevice();
  const webgl = useSyncExternalStore(
    subscribeWebgl,
    getWebglSnapshot,
    getServerWebglSnapshot
  );

  const use3d = webgl && !lowPower;
  const selected = arch.nodes.find((n) => n.id === selectedId) ?? null;

  const selectNode = useCallback(
    (id: string | null) => {
      onSelect(selectedId === id ? null : id);
    },
    [onSelect, selectedId]
  );

  const reset = useCallback(() => {
    onSelect(null);
    setPlaying(true);
  }, [onSelect]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* ---------------- stage ---------------- */}
      <div className="min-w-0">
        {/* the diagram */}
        <div className="panel relative overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line bg-abyss/60 px-4 py-2.5">
            <span className="h-1.5 w-1.5 bg-neon" aria-hidden="true" />
            <span className="eyebrow">{arch.name.toLowerCase().replace(/\s+/g, "-")}.arch</span>
            <span className="ms-auto hidden font-mono text-[10px] text-dim sm:block">
              {use3d ? t("eng.arch.hint3d") : t("eng.arch.hint")}
            </span>
          </div>

          {use3d ? (
            <ArchitectureCanvas
              key={arch.id}
              arch={arch}
              selectedId={selectedId}
              playing={playing && !reduced}
              reduced={reduced}
              onSelect={selectNode}
            />
          ) : (
            <ArchitectureSvgFallback
              arch={arch}
              selectedId={selectedId}
              onSelect={selectNode}
            />
          )}

          {/* legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line px-4 py-3">
            <span className="eyebrow">{t("eng.arch.legend")}</span>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {NODE_LEGEND.map((item) => (
                <li key={item.kind} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-[2px]"
                    style={{ background: KIND_VAR[item.kind] }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] text-mist">{t(item.key)}</span>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {EDGE_LEGEND.map((item) => (
                <li key={item.kind} className="flex items-center gap-1.5">
                  <span
                    className="h-[2px] w-4"
                    style={{ background: EDGE_VAR[item.kind] }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] text-dim">{t(item.key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* controls */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost px-2.5 py-1.5 text-[11px]"
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={playing}
          >
            {playing ? (
              <>
                <Pause className="h-3.5 w-3.5" aria-hidden="true" /> {t("eng.arch.pause")}
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" aria-hidden="true" /> {t("eng.arch.play")}
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-ghost px-2.5 py-1.5 text-[11px]"
            onClick={reset}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> {t("eng.arch.reset")}
          </button>
          <span className="ms-auto hidden items-center gap-1.5 font-mono text-[10px] text-dim sm:flex">
            <MousePointer2 className="h-3 w-3" aria-hidden="true" />
            {selected ? t("eng.arch.selected", { name: selected.short }) : t("eng.arch.none")}
          </span>
        </div>

        {/* accessible node list — also works without WebGL */}
        <ul className="mt-4 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {arch.nodes.map((node) => {
            const active = node.id === selectedId;
            return (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() => selectNode(node.id)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-2 rounded-sm border px-2.5 py-2 text-start transition-colors ${
                    active
                      ? "border-neon/70 bg-panel-2"
                      : "border-line hover:border-line-2"
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                    style={{ background: KIND_VAR[node.kind] }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-[11px] text-chalk">
                      {node.short}
                    </span>
                    <span className="block truncate text-[10px] text-dim">
                      {archLayerLabel[node.layer]}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---------------- detail panel ---------------- */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line bg-abyss/60 px-4 py-2.5">
            <span className="h-1.5 w-1.5 bg-cyan" aria-hidden="true" />
            <span className="eyebrow">{t("eng.arch.component")}</span>
          </div>
          {selected ? (
            <div className="p-4">
              <p className="font-mono text-[10px] tracking-widest text-dim uppercase">
                {archLayerLabel[selected.layer]}
              </p>
              <h4 className="mt-1.5 text-lg leading-snug tracking-tight text-chalk">
                {selected.label}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-mist text-pretty">
                {selected.responsibility}
              </p>
              <dl className="mt-4 space-y-2 border-t border-line pt-3 font-mono text-[11px]">
                <div className="flex gap-2">
                   <dt className="shrink-0 text-dim">{t("eng.arch.flow")}</dt>
                  <dd className="text-mist">{selected.io}</dd>
                </div>
              </dl>
              {selected.tech.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {selected.tech.map((t) => (
                    <li key={t}>
                      <span className="tag inline-flex items-center gap-1.5">
                        <TechIcon name={t} className="h-3.5 w-3.5 [&_svg]:h-full [&_svg]:w-full" />
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="p-4">
              <h4 className="text-base tracking-tight text-chalk">
                {t("eng.arch.emptyTitle")}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-mist text-pretty">
                {t("eng.arch.emptyBody")}
              </p>
              <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
                {arch.stack.map((t) => (
                  <li key={t} className="flex items-center gap-2 font-mono text-[11px] text-mist">
                    <TechIcon name={t} className="h-3.5 w-3.5 shrink-0 [&_svg]:h-full [&_svg]:w-full" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="mt-3 font-mono text-[10px] leading-relaxed text-dim">
          {arch.note}
        </p>
      </aside>
    </div>
  );
}

/**
 * Resolve a CSS custom property to a numeric colour for Three.js, which
 * cannot consume `var()` references. Falls back to the dark-theme value when
 * the stylesheet is not yet applied (SSR/prerender, or a non-browser DOM).
 */
function cssColorToNumber(cssVar: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const resolved = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar.replace(/^var\(|\)$/g, ""))
    .trim();
  if (!resolved.startsWith("#")) return fallback;
  const value = parseInt(resolved.slice(1), 16);
  return Number.isNaN(value) ? fallback : value;
}

/* ------------------------------------------------------------------ */
/* Three.js canvas                                                     */
/* ------------------------------------------------------------------ */

interface CanvasProps {
  arch: Architecture;
  selectedId: string | null;
  playing: boolean;
  reduced: boolean;
  onSelect: (id: string | null) => void;
}

function ArchitectureCanvas({
  arch,
  selectedId,
  playing,
  reduced,
  onSelect,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef(new Map<string, HTMLButtonElement>());
  const selectedRef = useRef<string | null>(selectedId);
  const playingRef = useRef(playing);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 460;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // Diagram colours come from the CSS custom properties so the 3D scene
    // uses exactly the same palette (and the same per-theme values) as the
    // legend and the SVG fallback. Three.js needs numeric colours, so the
    // var() references are resolved through the computed style.
    const DARK_KIND: Record<ArchNodeKind, number> = {
      client: 0x5fb3ea,
      entry: 0x2fd8bd,
      security: 0x24b8a0,
      logic: 0x5fb3ea,
      persistence: 0xa4b1c1,
      store: 0x5fb3ea,
      ops: 0x8a9bb0,
    };
    const DARK_EDGE: Record<ArchEdge["kind"], number> = {
      request: 0x2fd8bd,
      response: 0x5fb3ea,
      data: 0xa4b1c1,
      auth: 0x24b8a0,
      migration: 0x8a9bb0,
    };
    const kindColor = (kind: ArchNodeKind) =>
      cssColorToNumber(KIND_VAR[kind], DARK_KIND[kind]);
    const edgeColor = (kind: ArchEdge["kind"]) =>
      cssColorToNumber(EDGE_VAR[kind], DARK_EDGE[kind]);

    // Light and dark need genuinely different scene lighting: the deep
    // blue-black background absorbs light, while white paper reflects it and
    // washes out an emissive accent unless the key light is pulled back.
    const lightScene =
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-theme") === "light";

    // Node plates read as dark cards on the deep background in dark mode and
    // as light cards on paper in light mode, so they track the surface token.
    const nodeBodyColor = cssColorToNumber(
      "var(--color-panel-2)",
      lightScene ? 0xf2f5f8 : 0x18202b
    );
    const edgeStrokeColor = cssColorToNumber(
      "var(--color-control)",
      lightScene ? 0x74839a : 0x66768f
    );

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
    camera.position.set(0, 0.4, 13);

    const rig = new THREE.Group();
    scene.add(rig);

    scene.add(new THREE.AmbientLight(0xffffff, lightScene ? 1.15 : 0.65));
    const key = new THREE.DirectionalLight(
      kindColor("entry"),
      lightScene ? 1.1 : 1.6
    );
    key.position.set(6, 10, 8);
    scene.add(key);
    const fill = new THREE.DirectionalLight(
      cssColorToNumber("var(--color-cyan)", lightScene ? 0x0d5f96 : 0x5fb3ea),
      lightScene ? 0.55 : 0.9
    );
    fill.position.set(-7, 4, 6);
    scene.add(fill);

    const nodeVec: Record<string, THREE.Vector3> = {};
    const nodeMesh: Record<string, THREE.Mesh> = {};
    const nodeBase: Record<string, number> = {};
    const nodeMat: Record<string, THREE.MeshStandardMaterial> = {};

    // Nodes
    for (const node of arch.nodes) {
      const [x, y, z] = ARCH_LAYER_POS[node.layer];
      const geo = new THREE.BoxGeometry(2.05, 0.72, 0.16);
      const mat = new THREE.MeshStandardMaterial({
        color: nodeBodyColor,
        emissive: new THREE.Color(kindColor(node.kind)),
        emissiveIntensity: lightScene ? 0.5 : 0.35,
        metalness: 0.4,
        roughness: 0.35,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.userData.nodeId = node.id;
      rig.add(mesh);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({
          color: kindColor(node.kind),
          transparent: true,
          opacity: 0.9,
        })
      );
      mesh.add(edges);

      nodeVec[node.id] = new THREE.Vector3(x, y, z);
      nodeMesh[node.id] = mesh;
      nodeMat[node.id] = mat;
      nodeBase[node.id] = 0.35;
    }

    // Edges + flowing packets
    interface Packet {
      mesh: THREE.Mesh;
      curve: THREE.QuadraticBezierCurve3;
      t: number;
      speed: number;
      forward: boolean;
      edgeKind: ArchEdge["kind"];
      from: string;
      to: string;
    }
    const packets: Packet[] = [];
    const edgeLines: THREE.Line[] = [];
    const edgeMeta: { line: THREE.Line; baseMat: THREE.LineBasicMaterial; from: string; to: string }[] = [];

    for (const edge of arch.edges) {
      const a = nodeVec[edge.from];
      const b = nodeVec[edge.to];
      if (!a || !b) continue;
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.z += 0.9 + Math.abs(a.y - b.y) * 0.15;
      const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());

      const points = curve.getPoints(40);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const baseMat = new THREE.LineBasicMaterial({
        color: edgeStrokeColor,
        transparent: true,
        opacity: 0.28,
      });
      const line = new THREE.Line(lineGeo, baseMat);
      rig.add(line);
      edgeLines.push(line);
      edgeMeta.push({ line, baseMat, from: edge.from, to: edge.to });

      const forward = edge.kind !== "response";
      const count = 2;
      for (let i = 0; i < count; i++) {
        const pktMat = new THREE.MeshBasicMaterial({
          color: edgeColor(edge.kind),
          transparent: true,
          opacity: 0.95,
          // Additive blending only reads correctly on the deep background; on
          // light paper it would blow out to white, so packets use normal
          // blending there (same approach as the site background scene).
          blending: lightScene ? THREE.NormalBlending : THREE.AdditiveBlending,
        });
        const pkt = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), pktMat);
        rig.add(pkt);
        packets.push({
          mesh: pkt,
          curve,
          t: i / count,
          speed: 0.11 + (edge.kind === "response" ? -0.02 : 0.02),
          forward,
          edgeKind: edge.kind,
          from: edge.from,
          to: edge.to,
        });
      }
    }

    // Interaction state
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const drag = { active: false, lastX: 0, lastY: 0, rotY: 0, rotX: 0, moved: 0 };
    const target = { rotY: 0, rotX: 0 };
    let hoverId: string | null = null;
    const clock = new THREE.Clock();
    const focus = new THREE.Vector3(0, 0.4, 0);
    const lookAt = new THREE.Vector3(0, 0.4, 0);
    const widthRef = { w: width, h: height };

    const setPointerFromEvent = (e: PointerEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const pick = (): string | null => {
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(Object.values(nodeMesh), false);
      return hits.length ? (hits[0].object.userData.nodeId as string) : null;
    };

    const onPointerDown = (e: PointerEvent) => {
      drag.active = true;
      drag.moved = 0;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      setPointerFromEvent(e);
      if (drag.active) {
        const dx = e.clientX - drag.lastX;
        const dy = e.clientY - drag.lastY;
        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        drag.moved += Math.abs(dx) + Math.abs(dy);
        target.rotY += dx * 0.005;
        target.rotX = Math.max(-0.5, Math.min(0.5, target.rotX + dy * 0.003));
      } else {
        const id = pick();
        hoverId = id;
        canvas.style.cursor = id ? "pointer" : drag.active ? "grabbing" : "grab";
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      const wasDrag = drag.moved > 6;
      drag.active = false;
      canvas.releasePointerCapture?.(e.pointerId);
      if (!wasDrag) {
        setPointerFromEvent(e);
        onSelectRef.current(pick());
      }
    };
    const onLeave = () => {
      drag.active = false;
      hoverId = null;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onLeave);

    const projected = new THREE.Vector3();
    let raf = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const moving = playingRef.current && !reduced;

      // subtle auto sway when idle
      if (!drag.active && !reduced) {
        target.rotY += Math.sin(t * 0.35) * 0.0006;
      }
      drag.rotY += (target.rotY - drag.rotY) * 0.08;
      drag.rotX += (target.rotX - drag.rotX) * 0.08;
      rig.rotation.y = drag.rotY;
      rig.rotation.x = drag.rotX;

      // packets
      for (const p of packets) {
        if (moving) {
          p.t += p.speed * dt;
          if (p.t > 1) p.t -= 1;
        }
        const tt = p.forward ? p.t : 1 - p.t;
        p.curve.getPointAt(tt, p.mesh.position);
        const highlight = selectedRef.current === null || selectedRef.current === p.from || selectedRef.current === p.to;
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = highlight ? 0.95 : 0.16;
      }

      // node emphasis + hover
      for (const node of arch.nodes) {
        const mat = nodeMat[node.id];
        const isSel = selectedRef.current === node.id;
        const isHover = hoverId === node.id;
        const connected =
          selectedRef.current === null ||
          node.id === selectedRef.current ||
          arch.edges.some(
            (e) =>
              (e.from === selectedRef.current && e.to === node.id) ||
              (e.to === selectedRef.current && e.from === node.id)
          );
        const targetI = isSel ? 1.15 : isHover ? 0.75 : connected ? nodeBase[node.id] : 0.1;
        mat.emissiveIntensity += (targetI - mat.emissiveIntensity) * 0.15;
        const mesh = nodeMesh[node.id];
        const scaleTarget = isSel ? 1.08 : isHover ? 1.03 : 1;
        mesh.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), 0.15);
      }
      for (const e of edgeMeta) {
        const connected =
          selectedRef.current === null ||
          e.from === selectedRef.current ||
          e.to === selectedRef.current;
        e.baseMat.opacity += ((connected ? 0.34 : 0.06) - e.baseMat.opacity) * 0.12;
      }

      // camera focus on selection
      const selId = selectedRef.current;
      if (selId && nodeVec[selId]) {
        const p = nodeVec[selId];
        focus.set(p.x * 0.5, p.y * 0.5 + 0.3, p.z);
      } else {
        focus.set(0, 0.4, 0);
      }
      lookAt.lerp(focus, 0.06);
      const camGoal = new THREE.Vector3(focus.x * 0.22, focus.y * 0.22 + 0.4, 12.4);
      camera.position.lerp(camGoal, 0.05);
      camera.lookAt(lookAt);

      // project labels
      const w = widthRef.w;
      const h = widthRef.h;
      for (const node of arch.nodes) {
        const el = labelRefs.current.get(node.id);
        if (!el) continue;
        nodeMesh[node.id].getWorldPosition(projected);
        projected.project(camera);
        const x = (projected.x * 0.5 + 0.5) * w;
        const y = (-projected.y * 0.5 + 0.5) * h;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        el.style.opacity = projected.z > 1 ? "0" : "1";
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth || width;
      const h = container.clientHeight || height;
      widthRef.w = w;
      widthRef.h = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onLeave);
      rig.traverse((obj) => {
        const mesh = obj as THREE.Mesh | THREE.Line | THREE.LineSegments;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = (mesh as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      renderer.dispose();
    };
    // Structural inputs (arch) are handled by remounting via `key`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arch]);

  return (
    <div
      ref={containerRef}
      className="relative h-[420px] w-full sm:h-[480px]"
      style={{ touchAction: "none" }}
    >
      {/* faint grid backdrop — built from the line token so it stays a subtle
          hairline in both themes instead of a fixed dark grey that turns
          into harsh visible lines on light paper */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-40"
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0">
        {arch.nodes.map((node) => {
          const active = node.id === selectedId;
          return (
            <button
              key={node.id}
              type="button"
              ref={(el) => {
                if (el) labelRefs.current.set(node.id, el);
                else labelRefs.current.delete(node.id);
              }}
              onClick={() => onSelect(node.id)}
              aria-label={`${node.label}: ${node.responsibility}`}
              className={`pointer-events-auto absolute top-0 left-0 max-w-[8.5rem] rounded-[2px] border px-2 py-1 text-center font-mono text-[10px] leading-tight break-words backdrop-blur-sm transition-colors ${
                active
                  ? "border-neon bg-panel text-chalk"
                  : "border-line bg-panel/85 text-mist hover:border-neon/60 hover:text-chalk"
              }`}
              style={{ transform: "translate(-50%,-50%)", opacity: 0 }}
            >
              {node.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SVG fallback (no WebGL / low-power)                                 */
/* ------------------------------------------------------------------ */

function ArchitectureSvgFallback({
  arch,
  selectedId,
  onSelect,
}: {
  arch: Architecture;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const pos = useMemo(() => {
    const map: Record<string, { left: number; top: number }> = {};
    for (const node of arch.nodes) {
      const [x, y] = ARCH_LAYER_POS[node.layer];
      map[node.id] = { left: 50 + x * 8.5, top: 50 - y * 8.5 };
    }
    return map;
  }, [arch]);

  return (
    <div className="relative h-[420px] w-full sm:h-[480px]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {arch.edges.map((edge) => {
          const a = pos[edge.from];
          const b = pos[edge.to];
          if (!a || !b) return null;
          const connected =
            selectedId === null ||
            edge.from === selectedId ||
            edge.to === selectedId;
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={a.left}
              y1={a.top}
              x2={b.left}
              y2={b.top}
              stroke={EDGE_VAR[edge.kind]}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              opacity={connected ? 0.6 : 0.12}
              strokeDasharray="3 3"
              className="arch-flow"
            />
          );
        })}
      </svg>

      {arch.nodes.map((node) => {
        const p = pos[node.id];
        const active = node.id === selectedId;
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => onSelect(node.id)}
            aria-pressed={active}
            className={`absolute -translate-x-1/2 -translate-y-1/2 max-w-[8.5rem] rounded-[3px] border px-2.5 py-1.5 text-center font-mono text-[10px] leading-tight break-words transition-colors ${
              active
                ? "border-neon bg-void text-chalk"
                : "border-line bg-panel text-mist hover:border-neon/60 hover:text-chalk"
            }`}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              boxShadow: `0 0 0 1px color-mix(in srgb, ${KIND_VAR[node.kind]} 30%, transparent)`,
            }}
          >
            <span
              className="me-1.5 inline-block h-2 w-2 rounded-[2px] align-middle"
              style={{ background: KIND_VAR[node.kind] }}
            />
            {node.short}
          </button>
        );
      })}
    </div>
  );
}
