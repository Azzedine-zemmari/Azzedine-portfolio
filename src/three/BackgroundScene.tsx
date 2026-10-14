"use client";

import { useEffect } from "react";
import * as THREE from "three";

interface BackgroundSceneProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Whole-page scroll progress, 0 → 1. Read every frame (no re-renders). */
  progressRef: { current: number };
}

/**
 * Site-wide Three.js background.
 *
 * Rendered into a viewport-fixed canvas behind all content. The camera drifts
 * with page scroll progress so the scene "travels" with you as you scroll.
 *
 * All renderer/scene state lives inside the effect and is fully disposed on
 * cleanup, so React StrictMode's mount → cleanup → mount cycle rebuilds the
 * whole scene on the second mount instead of short-circuiting on a stale
 * "initialized" flag (which previously left the canvas blank in dev).
 */
export function BackgroundScene({ canvasRef, progressRef }: BackgroundSceneProps) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      // WebGL unavailable — leave the canvas transparent; content stays readable.
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    camera.position.set(0, 0, 12);

    const centerpiece = createCenterpiece();
    scene.add(centerpiece);
    const rings = createOrbitRings(centerpiece);
    const orbs = createFloatingOrbs(centerpiece);
    const particles = createParticleField(scene);
    const stars = createStarField(scene);
    const ambient = createLighting(scene);
    const particleMaterial = particles.material as THREE.ShaderMaterial;
    const starMaterial = stars.material;

    let wireMaterial: THREE.Material | undefined;
    let glowMaterial: THREE.ShaderMaterial | undefined;
    centerpiece.children.forEach((child) => {
      if (child.userData.type === "wire") {
        wireMaterial = (child as THREE.Mesh).material as THREE.Material;
      } else if (child.userData.shader) {
        glowMaterial = (child as THREE.Mesh).material as THREE.ShaderMaterial;
      }
    });

    // Re-skin the scene for the active theme without rebuilding geometry.
    const applyTheme = (light: boolean) => {
      renderer.toneMappingExposure = light ? 1.15 : 1;
      ambient.intensity = light ? 1.1 : 0.5;
      if (wireMaterial) wireMaterial.opacity = light ? 0.3 : 0.15;
      const blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      if (glowMaterial) glowMaterial.blending = blending;
      particleMaterial.blending = blending;
      starMaterial.blending = blending;
      starMaterial.uniforms.uColor.value.set(light ? PAPER_STAR : 0xffffff);
    };
    applyTheme(document.documentElement.getAttribute("data-theme") === "light");

    const themeObserver = new MutationObserver(() => {
      applyTheme(document.documentElement.getAttribute("data-theme") === "light");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let raf = 0;
    let time = 0;
    let camY = 0;
    let camX = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      time += 0.01;

      if (!prefersReduced) {
        updateCenterpiece(centerpiece, time);
        updateOrbitRings(rings, time);
        updateFloatingOrbs(orbs, time);
      }

      particleMaterial.uniforms.uTime.value = time;
      if (!prefersReduced) {
        starMaterial.uniforms.uTime.value = time;
      }

      // Scroll parallax: the scene travels with the page.
      const progress = prefersReduced ? 0 : progressRef.current;
      camY += (progress * 4.5 - camY) * 0.05;
      camX += (progress * 1.2 - camX) * 0.05;
      camera.position.set(camX, camY, 12);
      camera.lookAt(0, camY * 0.45, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      themeObserver.disconnect();
      disposeObject(scene);
      renderer.dispose();
    };
  }, [canvasRef, progressRef]);

  return null;
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh | THREE.Points;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = (mesh as THREE.Mesh).material;
    if (Array.isArray(material)) {
      material.forEach((m) => m.dispose());
    } else if (material) {
      material.dispose();
    }
  });
}

/**
 * Decorative scene colours.
 *
 * This is an ambient background, not content, so these values are not
 * theme tokens — but they must still belong to the same palette as the UI
 * or the scene fights the interface. They mirror the dark-theme accent ramp
 * from `src/index.css`: electric teal core, cool blue support.
 *
 * The scene also re-skins itself per theme (see `applyTheme` below) because
 * additive blending and emissive intensity read very differently on a deep
 * blue-black background than on white paper.
 */
const ACCENT_CORE = 0x2fd8bd; // --color-neon (dark)
const ACCENT_WARM = 0x24b8a0; // --color-neon-dim (dark)
const ACCENT_COOL = 0x5fb3ea; // --color-cyan (dark)
const PAPER_STAR = 0x48586a; // --color-mist (light)

function createCenterpiece(): THREE.Group {
  const group = new THREE.Group();

  const coreGeometry = new THREE.IcosahedronGeometry(1.2, 3);
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: ACCENT_CORE,
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transmission: 0.3,
    thickness: 0.5,
    ior: 1.5,
    envMapIntensity: 1,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  core.userData = { type: "core", rotationSpeed: 0.001 };
  group.add(core);

  const innerGeometry = new THREE.OctahedronGeometry(0.6, 2);
  const innerMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.3,
    transmission: 0.8,
    thickness: 0.3,
    ior: 1.33,
    envMapIntensity: 0.5,
  });
  const inner = new THREE.Mesh(innerGeometry, innerMaterial);
  inner.userData = { type: "inner", rotationSpeed: -0.002 };
  group.add(inner);

  const wireGeometry = new THREE.IcosahedronGeometry(1.8, 1);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: ACCENT_CORE,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
    depthWrite: false,
  });
  const wire = new THREE.Mesh(wireGeometry, wireMaterial);
  wire.userData = { type: "wire", rotationSpeed: 0.0005 };
  group.add(wire);

  const glowGeometry = new THREE.SphereGeometry(2.2, 32, 32);
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(ACCENT_CORE) },
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec3 vNormal;
      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
        float pulse = sin(uTime * 2.0) * 0.15 + 0.85;
        vec3 color = uColor * fresnel * pulse;
        float alpha = fresnel * pulse * 0.4;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.userData = { type: "glow", shader: true };
  group.add(glow);

  return group;
}

function createParticleField(scene: THREE.Scene): THREE.Points {
  const count = 3000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const alphas = new Float32Array(count);
  const velocities = new Float32Array(count * 3);

  const color1 = new THREE.Color(ACCENT_CORE);
  const color2 = new THREE.Color(ACCENT_COOL);
  const color3 = new THREE.Color(0xffffff);

  for (let i = 0; i < count; i++) {
    const radius = 8 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    sizes[i] = Math.random() * 2 + 0.5;

    const colorChoice = Math.random();
    const color =
      colorChoice < 0.3 ? color1 : colorChoice < 0.6 ? color2 : color3;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    alphas[i] = Math.random() * 0.6 + 0.2;

    velocities[i * 3] = (Math.random() - 0.5) * 0.0005;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0005;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0005;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
  geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: `
      attribute float size;
      attribute float alpha;
      attribute vec3 aColor;
      attribute vec3 velocity;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        vAlpha = alpha;
        vColor = aColor;
        vec3 pos = position + velocity * uTime * 100.0;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  return particles;
}

/**
 * Small white stars on a far shell. Each star gently twinkles (frozen under
 * `prefers-reduced-motion` since the shader time is only advanced without it).
 */
function createStarField(scene: THREE.Scene): {
  points: THREE.Points;
  material: THREE.ShaderMaterial;
} {
  const count = 1800;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const radius = 30 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    sizes[i] = 0.5 + Math.random() * 1.4;
    phases[i] = Math.random() * Math.PI * 2;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColor: { value: new THREE.Color(0xffffff) },
    },
    vertexShader: `
      attribute float size;
      attribute float phase;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vAlpha;
      void main() {
        vAlpha = 0.5 + 0.5 * sin(uTime * 1.4 + phase);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * uPixelRatio * (130.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return { points, material };
}

function createOrbitRings(group: THREE.Group): THREE.Group {
  const rings = new THREE.Group();

  for (let i = 0; i < 3; i++) {
    const radius = 2.5 + i * 0.8;
    const ringGeometry = new THREE.RingGeometry(
      radius - 0.05,
      radius + 0.05,
      128
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      color:
        i === 0 ? ACCENT_CORE : i === 1 ? ACCENT_WARM : ACCENT_COOL,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2 - i * 0.05,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.y = Math.random() * Math.PI;
    ring.userData = {
      rotationSpeed: (0.0003 + i * 0.0001) * (Math.random() > 0.5 ? 1 : -1),
      tilt: Math.random() * 0.5,
    };
    rings.add(ring);

    const orbitGeometry = new THREE.TorusGeometry(radius + 0.3, 0.02, 16, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: ACCENT_CORE,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.random() * Math.PI;
    orbit.userData = {
      rotationSpeed: 0.0002 * (Math.random() > 0.5 ? 1 : -1),
    };
    rings.add(orbit);
  }

  group.add(rings);
  return rings;
}

function createFloatingOrbs(group: THREE.Group): THREE.Group {
  const orbs = new THREE.Group();

  for (let i = 0; i < 12; i++) {
    const size = 0.08 + Math.random() * 0.12;
    const geometry = new THREE.IcosahedronGeometry(size, 1);
    const material = new THREE.MeshPhysicalMaterial({
      // Hue band 0.44–0.54 walks from teal to sky blue, matching the accent
      // ramp in src/index.css, so the orbs sit inside the same palette.
      color: new THREE.Color().setHSL(
        0.44 + Math.random() * 0.1,
        0.75,
        0.5 + Math.random() * 0.25
      ),
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0,
      emissive: new THREE.Color(ACCENT_CORE),
      emissiveIntensity: 0.3,
    });
    const orb = new THREE.Mesh(geometry, material);

    const distance = 3 + Math.random() * 4;
    const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.5;
    const height = (Math.random() - 0.5) * 3;

    orb.position.set(
      Math.cos(angle) * distance,
      height,
      Math.sin(angle) * distance
    );

    orb.userData = {
      baseDistance: distance,
      baseAngle: angle,
      baseHeight: height,
      orbitSpeed: 0.0005 + Math.random() * 0.001,
      verticalSpeed: 0.001 + Math.random() * 0.002,
      verticalRange: 0.5 + Math.random() * 0.5,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
    };
    orbs.add(orb);
  }

  group.add(orbs);
  return orbs;
}

function createLighting(scene: THREE.Scene): THREE.AmbientLight {
  const ambient = new THREE.AmbientLight(0x222222, 0.5);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(ACCENT_CORE, 2);
  keyLight.position.set(5, 10, 7);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(ACCENT_COOL, 1);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
  rimLight.position.set(0, -10, -10);
  scene.add(rimLight);

  const pointLight1 = new THREE.PointLight(ACCENT_CORE, 2, 20);
  pointLight1.position.set(3, 3, 3);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 1, 15);
  pointLight2.position.set(-3, -3, 3);
  scene.add(pointLight2);

  return ambient;
}

function updateCenterpiece(group: THREE.Group, time: number) {
  group.children.forEach((child) => {
    if (child.userData.type === "core") {
      child.rotation.x += child.userData.rotationSpeed;
      child.rotation.y += child.userData.rotationSpeed * 0.7;
      child.scale.setScalar(1 + Math.sin(time * 0.5) * 0.02);
    } else if (child.userData.type === "inner") {
      child.rotation.x += child.userData.rotationSpeed;
      child.rotation.y += child.userData.rotationSpeed * 1.3;
      child.rotation.z += child.userData.rotationSpeed * 0.5;
    } else if (child.userData.type === "wire") {
      child.rotation.y += child.userData.rotationSpeed;
      child.rotation.x += child.userData.rotationSpeed * 0.3;
    } else if (
      child.userData.shader &&
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.ShaderMaterial
    ) {
      child.material.uniforms.uTime.value = time;
      child.rotation.y += 0.0001;
    }
  });
}

function updateOrbitRings(rings: THREE.Group, time: number) {
  rings.children.forEach((child) => {
    if (child.userData.rotationSpeed) {
      child.rotation.z += child.userData.rotationSpeed;
      if (child.userData.tilt) {
        child.rotation.x = Math.sin(time * child.userData.tilt) * 0.3;
      }
    }
  });
}

function updateFloatingOrbs(orbs: THREE.Group, time: number) {
  orbs.children.forEach((child) => {
    const data = child.userData;
    const angle = data.baseAngle + time * data.orbitSpeed;
    child.position.x = Math.cos(angle) * data.baseDistance;
    child.position.z = Math.sin(angle) * data.baseDistance;
    child.position.y =
      data.baseHeight + Math.sin(time * data.verticalSpeed) * data.verticalRange;
    child.rotation.x += data.rotationSpeed;
    child.rotation.y += data.rotationSpeed * 0.7;
  });
}
