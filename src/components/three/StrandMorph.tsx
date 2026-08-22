"use client";

/**
 * Port of the original site's `PointShapeMorphThreeJS` Framer code component —
 * the strand glyph behind the pinned Features section that morphs between one
 * point cloud per feature as you scroll.
 *
 * How it works (same as the original):
 * - Every shape's target points are packed into ONE static RGBA float texture,
 *   laid out as an atlas of `cols × rows` sub-rectangles. `.rg` is the target
 *   xy, `.b` a per-cell random used to vary spring stiffness, `.a` the target
 *   opacity (0 for cells this shape doesn't use, so surplus points fade out).
 * - A ping-pong half-float render target holds live state: the top
 *   `rowsPerDataset` rows are position + opacity, the bottom the velocity. One
 *   fragment shader pass integrates both, springing each cell toward the active
 *   shape's sub-rect.
 * - The visible mesh is `tipLayers` billboard quads per cell, sampling that sim
 *   texture in the vertex shader and the tip texture for colour, drawn with
 *   additive One/One blending.
 *
 * Switching shape is just a change of `uActiveShapeTransform` — the springs do
 * the rest, which is why the morph reads as a swarm rather than a crossfade.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type MorphShape = {
  /** Comma-separated "x,y,x,y,…" point list, roughly normalised to ±0.5. */
  points: string;
  /** Fraction of points to keep (the original thins each cloud randomly). */
  threshold: number;
  scale: number;
};

export type StrandMorphProps = {
  className?: string;
  style?: React.CSSProperties;
  shapes: MorphShape[];
  currentShape: number;
  tipTexture?: string;
  fallbackImage?: string;
  cameraFov?: number;
  cameraPosition?: { x: number; y: number; z: number };
  tipRadius?: number;
  tipLayers?: number;
  sizeVariance?: number;
  dispersion?: number;
  dispersionBand?: number;
  dispersionOffset?: number;
  simSpring?: number;
  simDamping?: number;
  simMaxVelocity?: number;
  springVariance?: number;
  opacitySpeed?: number;
};

type Pt = { x: number; y: number };

function parsePoints(str: string, threshold: number): Pt[] {
  if (!str || !str.trim()) return [];
  const nums = str.split(",").map(Number);
  if (nums.length < 2 || nums.length % 2 !== 0 || nums.some(isNaN)) return [];
  const out: Pt[] = [];
  for (let i = 0; i < nums.length / 2; i++) {
    if (Math.random() > threshold) continue;
    out.push({ x: nums[i * 2], y: nums[i * 2 + 1] });
  }
  return out;
}

function shuffled(n: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Squarest sim RT that fits `count` cells in `datasets` stacked blocks. */
function simLayout(count: number, datasets: number) {
  let simW = 1;
  for (;;) {
    const rows = Math.ceil(count / simW);
    if (simW >= rows * datasets) break;
    simW++;
  }
  return { simW, rowsPerDataset: Math.ceil(count / simW) };
}

/** Squarest atlas grid holding `n` sub-rects of `cellW × cellH`. */
function atlasLayout(n: number, cellW: number, cellH: number) {
  let cols = 1;
  let rows = n;
  let best = Infinity;
  const even = n % 2 === 0 ? n : n + 1;
  for (let c = 1; c <= even; c++) {
    const r = Math.ceil(even / c);
    if (c * r < n) continue;
    const ratio = Math.max(c, r) / Math.min(c, r);
    if (ratio < best) {
      best = ratio;
      cols = c;
      rows = r;
    }
  }
  if ((cols * cellW) / (rows * cellH) > 4) rows++;
  return { cols, rows, staticTexWidth: cols * cellW, staticTexHeight: rows * cellH };
}

/**
 * Maps a dataset-0 cell UV into a sub-rect of another texture.
 * Returns (scaleX, scaleY, offsetX, offsetY) as a vec4.
 */
function uvTransform(
  cellW: number,
  cellH: number,
  srcW: number,
  srcH: number,
  offX: number,
  offY: number,
  subW: number,
  subH: number,
  dstW: number,
  dstH: number,
) {
  const sx = subW / dstW / (cellW / srcW);
  const sy = subH / dstH / (cellH / srcH);
  return new THREE.Vector4(
    sx,
    sy,
    (offX + 0.5) / dstW - (0.5 / srcW) * sx,
    (offY + 0.5) / dstH - (0.5 / srcH) * sy,
  );
}

const simFragment = `
uniform sampler2D tPrev;
uniform sampler2D tData;
uniform float uDelta;
uniform float uSimSpring;
uniform float uSimDamping;
uniform float uSimMaxVelocity;
uniform float uSpringVariance;
uniform float uOpacitySpeed;
uniform vec4  uActiveShapeTransform;
uniform vec4  uT_velocity;
uniform float uRtSize;
uniform float uRowsPerDataset;

// The render targets are half-float (saturates at 65504) and every shape lives
// within about half a unit of the origin, so anything past this is garbage.
const float SANE_SQ = 1.0e8;
// Beyond ~2.0 the explicit-Euler spring overshoots and diverges.
const float MAX_SPRING_STEP = 2.0;

varying vec2 vFragUV;

vec2 transformUV(vec2 uv, vec4 m) { return uv * m.xy + m.zw; }

void main() {
  float rowF = floor(vFragUV.y * uRtSize);
  bool isVelocity = rowF >= uRowsPerDataset;

  // Address of the same logical cell in dataset-0 space. For position
  // fragments that IS vFragUV; for velocity fragments we subtract the row
  // offset. This is the input space both UV transforms expect.
  vec2 cellUV = isVelocity
    ? vec2(vFragUV.x, (rowF - uRowsPerDataset + 0.5) / uRtSize)
    : vFragUV;

  if (isVelocity) {
    vec2 pos = texture2D(tPrev, cellUV).rg;
    vec2 vel = texture2D(tPrev, vFragUV).rg;
    vec4 target = texture2D(tData, transformUV(cellUV, uActiveShapeTransform));
    vec2 targetPos = target.rg;

    // A single NaN entering a ping-pong buffer never leaves it — it is read
    // back and propagated every frame after. The NOT-less-than form is
    // NaN-safe where a greater-than test would not be.
    if (!(dot(pos, pos) < SANE_SQ)) pos = targetPos;
    if (!(dot(vel, vel) < SANE_SQ)) vel = vec2(0.0);

    // Per-cell spring variance: .b holds a [0,1] random remapped to [-1,1].
    float effectiveSpring = uSimSpring + (target.b * 2.0 - 1.0) * uSpringVariance;

    // Clamping to [0, MAX_SPRING_STEP] handles both a negative effective
    // spring (variance > stiffness) and Euler overshoot on a long frame.
    vec2 displacement = pos - targetPos;
    vel -= displacement * clamp(effectiveSpring * uDelta, 0.0, MAX_SPRING_STEP);

    // exp(-x) matches (1 - damping*dt) to first order but stays stable when
    // damping*dt exceeds 1, where the naive form flips the velocity sign.
    vel *= exp(-uSimDamping * uDelta);

    float speed = length(vel);
    if (speed > uSimMaxVelocity) vel = vel / speed * uSimMaxVelocity;

    gl_FragColor = vec4(vel, 0.0, 1.0);
  } else {
    vec4 posData = texture2D(tPrev, vFragUV);
    vec2 pos = posData.rg;
    float opacity = posData.a;
    vec2 vel = texture2D(tPrev, transformUV(cellUV, uT_velocity)).rg;
    vec4 target = texture2D(tData, transformUV(cellUV, uActiveShapeTransform));

    if (!(dot(pos, pos) < SANE_SQ)) pos = target.rg;
    if (!(dot(vel, vel) < SANE_SQ)) vel = vec2(0.0);
    if (!(opacity >= 0.0)) opacity = 0.0;

    pos += vel * uDelta;
    opacity += (target.a - opacity) * clamp(uOpacitySpeed * uDelta, 0.0, 1.0);
    opacity = clamp(opacity, 0.0, 1.0);

    gl_FragColor = vec4(pos, 0.0, opacity);
  }
}
`;

const tipVertex = `
attribute vec2 aRandom;
attribute vec2 aSimUV;
attribute vec3 aUV;

uniform sampler2D tSim;
uniform float uTipRadius;
uniform float uSizeVariance;
uniform float uDispersionOffset;
uniform float uTime;

varying vec2 vRandom;
varying vec3 vUV;
varying float vOpacity;

void main() {
  vRandom = aRandom;
  vUV = aUV;

  vec4 simData = texture2D(tSim, aSimUV);
  // Negate Y: the point clouds are in SVG space (Y down).
  vec2 worldPos = vec2(simData.r, -simData.g);
  vOpacity = simData.a;

  // Second line of defence — the sim self-heals, but a poisoned value would
  // still produce one frame of undefined, often screen-filling geometry.
  if (!(dot(worldPos, worldPos) < 1.0e8)) {
    gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
    vOpacity = 0.0;
    return;
  }
  if (!(vOpacity >= 0.0)) vOpacity = 0.0;

  vec4 centerView = modelViewMatrix * vec4(worldPos, 0.0, 1.0);
  float sv = mix(1.0 - uSizeVariance, 1.0, aRandom.y);
  centerView.xy += vec2(
    (aUV.x - 0.5) * 2.0 * uTipRadius * sv,
    (aUV.y - 0.5) * 2.0 * uTipRadius * sv
  );

  // Spread the tip layers in depth on an animated cycle.
  float cycle = sin(uTime + aRandom.x * 6.28318) * 0.5 + 0.5;
  centerView.z += aUV.z * uDispersionOffset * cycle;

  gl_Position = projectionMatrix * centerView;
}
`;

const tipFragment = `
precision highp float;

uniform float uTipLayers;
uniform float uDispersionBand;
uniform float uDispersion;
uniform sampler2D uTipTexture;

varying vec2 vRandom;
varying vec3 vUV;
varying float vOpacity;

void main() {
  if (length(vUV.xy - vec2(0.5)) > 0.5) discard;

  float uvMin = 0.5 - uDispersionBand * 0.5;
  float uvMax = 0.5 + uDispersionBand * 0.5;
  vec3 color = texture2D(
    uTipTexture,
    vec2(mix(uvMin, uvMax, vUV.z), uDispersion * vRandom.x)
  ).xyz;

  float alpha = vOpacity * (vRandom.y / uTipLayers);
  gl_FragColor = vec4(color * alpha, alpha);
}
`;

export function StrandMorph({
  className,
  style,
  shapes,
  currentShape,
  tipTexture = "/art/hero-tip.png",
  fallbackImage = "/art/feature-morph-fallback.png",
  cameraFov = 34,
  cameraPosition = { x: 0, y: 0, z: 1.8 },
  tipRadius = 0.003,
  tipLayers = 8,
  sizeVariance = 0.5,
  dispersion = 0.8,
  dispersionBand = 0.9,
  dispersionOffset = 0.05,
  simSpring = 60,
  simDamping = 12,
  simMaxVelocity = 5,
  springVariance = 5,
  opacitySpeed = 2,
}: StrandMorphProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const simMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const tipMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const transformsRef = useRef<THREE.Vector4[]>([]);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [failed, setFailed] = useState(false);

  // Thin each cloud once. Re-running this would rebuild the whole sim, so the
  // parsed result is the effect's only geometry input.
  const parsed = useMemo(() => shapes.map((s) => parsePoints(s.points, s.threshold)), [shapes]);
  const shapeCount = Math.max(1, parsed.length);
  const cellCount = Math.max(1, ...parsed.map((p) => p.length));

  const live = useRef({
    simSpring,
    simDamping,
    simMaxVelocity,
    springVariance,
    opacitySpeed,
    tipRadius,
    sizeVariance,
    dispersion,
    dispersionBand,
    dispersionOffset,
  });
  useEffect(() => {
    live.current = {
      simSpring,
      simDamping,
      simMaxVelocity,
      springVariance,
      opacitySpeed,
      tipRadius,
      sizeVariance,
      dispersion,
      dispersionBand,
      dispersionOffset,
    };
  }, [
    simSpring,
    simDamping,
    simMaxVelocity,
    springVariance,
    opacitySpeed,
    tipRadius,
    sizeVariance,
    dispersion,
    dispersionBand,
    dispersionOffset,
  ]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        premultipliedAlpha: true,
      });
    } catch {
      setFailed(true);
      return;
    }
    // The tip vertex shader samples the sim texture, so vertex texture units
    // are non-negotiable.
    if (renderer.capabilities.maxVertexTextures < 1) {
      renderer.dispose();
      setFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      cameraFov,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    scene.add(camera);

    const { simW, rowsPerDataset } = simLayout(cellCount, 2);
    const rtSize = simW;
    const { cols, staticTexWidth, staticTexHeight } = atlasLayout(
      shapeCount,
      simW,
      rowsPerDataset,
    );

    // --- static target atlas: one sub-rect per shape ---
    const data = new Float32Array(staticTexWidth * staticTexHeight * 4);
    const cellRandom = new Float32Array(cellCount);
    for (let i = 0; i < cellCount; i++) cellRandom[i] = Math.random();

    const transforms: THREE.Vector4[] = [];
    for (let s = 0; s < shapeCount; s++) {
      const gx = (s % cols) * simW;
      const gy = Math.floor(s / cols) * rowsPerDataset;
      transforms.push(
        uvTransform(
          simW,
          rowsPerDataset,
          rtSize,
          rtSize,
          gx,
          gy,
          simW,
          rowsPerDataset,
          staticTexWidth,
          staticTexHeight,
        ),
      );

      const scale = shapes[s]?.scale ?? 1;
      const pts = parsed[s] || [];
      // Shuffle which cell gets which point so the surplus cells that fade out
      // are scattered through the cloud instead of clustered at the tail.
      const order = shuffled(cellCount);
      for (let i = 0; i < cellCount; i++) {
        const cell = order[i];
        const x = gx + (cell % simW);
        const y = gy + Math.floor(cell / simW);
        const o = (y * staticTexWidth + x) * 4;
        if (i < pts.length) {
          data[o] = pts[i].x * scale;
          data[o + 1] = pts[i].y * scale;
          data[o + 2] = cellRandom[cell];
          data[o + 3] = 1;
        } else {
          data[o] = Math.random() - 0.5;
          data[o + 1] = Math.random() - 0.5;
          data[o + 2] = cellRandom[cell];
          data[o + 3] = 0;
        }
      }
    }
    transformsRef.current = transforms;

    const dataTex = new THREE.DataTexture(
      data,
      staticTexWidth,
      staticTexHeight,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    dataTex.minFilter = THREE.NearestFilter;
    dataTex.magFilter = THREE.NearestFilter;
    dataTex.needsUpdate = true;

    const velocityTransform = uvTransform(
      simW,
      rowsPerDataset,
      rtSize,
      rtSize,
      0,
      rowsPerDataset,
      simW,
      rowsPerDataset,
      rtSize,
      rtSize,
    );

    // --- tip quads: `tipLayers` billboards per cell ---
    const vertsPerCell = 4 * tipLayers;
    const vertexCount = cellCount * vertsPerCell;
    const indexCount = cellCount * 6 * tipLayers;
    const aPosition = new Float32Array(vertexCount * 3);
    const aRandom = new Float32Array(vertexCount * 2);
    const aSimUV = new Float32Array(vertexCount * 2);
    const aUV = new Float32Array(vertexCount * 3);
    const indices = new Uint32Array(indexCount);
    const corners = [0, 0, 1, 0, 0, 1, 1, 1];

    let v = 0;
    let ix = 0;
    for (let c = 0; c < cellCount; c++) {
      const su = ((c % simW) + 0.5) / rtSize;
      const sv = (Math.floor(c / simW) + 0.5) / rtSize;
      const r1 = Math.random();
      const r2 = Math.random();
      for (let layer = 0; layer < tipLayers; layer++) {
        const layerFrac = tipLayers > 1 ? layer / (tipLayers - 1) : 0;
        const base = v;
        for (let k = 0; k < 4; k++) {
          aPosition[v * 3] = 0;
          aPosition[v * 3 + 1] = 0;
          aPosition[v * 3 + 2] = 0;
          aRandom[v * 2] = r1;
          aRandom[v * 2 + 1] = r2;
          aSimUV[v * 2] = su;
          aSimUV[v * 2 + 1] = sv;
          aUV[v * 3] = corners[k * 2];
          aUV[v * 3 + 1] = corners[k * 2 + 1];
          aUV[v * 3 + 2] = layerFrac;
          v++;
        }
        indices[ix++] = base + 0;
        indices[ix++] = base + 1;
        indices[ix++] = base + 2;
        indices[ix++] = base + 2;
        indices[ix++] = base + 1;
        indices[ix++] = base + 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(aPosition, 3));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(aRandom, 2));
    geometry.setAttribute("aSimUV", new THREE.BufferAttribute(aSimUV, 2));
    geometry.setAttribute("aUV", new THREE.BufferAttribute(aUV, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    // --- ping-pong sim ---
    const rtOpts = {
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      depthBuffer: false,
    };
    let rtA = new THREE.WebGLRenderTarget(rtSize, rtSize, rtOpts);
    let rtB = new THREE.WebGLRenderTarget(rtSize, rtSize, rtOpts);

    const start = Math.max(0, Math.min(currentShape, transforms.length - 1));
    const simScene = new THREE.Scene();
    const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const simGeo = new THREE.PlaneGeometry(2, 2);
    const simMat = new THREE.ShaderMaterial({
      uniforms: {
        tPrev: { value: rtA.texture },
        tData: { value: dataTex },
        uDelta: { value: 0.016 },
        uSimSpring: { value: live.current.simSpring },
        uSimDamping: { value: live.current.simDamping },
        uSimMaxVelocity: { value: live.current.simMaxVelocity },
        uSpringVariance: { value: live.current.springVariance },
        uOpacitySpeed: { value: live.current.opacitySpeed },
        uActiveShapeTransform: { value: transforms[start].clone() },
        uT_velocity: { value: velocityTransform.clone() },
        uRtSize: { value: rtSize },
        uRowsPerDataset: { value: rowsPerDataset },
      },
      vertexShader: `
        varying vec2 vFragUV;
        void main() { vFragUV = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: simFragment,
    });
    simMatRef.current = simMat;
    simScene.add(new THREE.Mesh(simGeo, simMat));

    const tipMat = new THREE.ShaderMaterial({
      uniforms: {
        tSim: { value: rtA.texture },
        uTipTexture: { value: textureRef.current },
        uTipRadius: { value: live.current.tipRadius },
        uTipLayers: { value: tipLayers },
        uSizeVariance: { value: live.current.sizeVariance },
        uDispersionBand: { value: live.current.dispersionBand },
        uDispersion: { value: live.current.dispersion },
        uDispersionOffset: { value: live.current.dispersionOffset },
        uTime: { value: 0 },
      },
      vertexShader: tipVertex,
      fragmentShader: tipFragment,
      transparent: true,
      depthTest: false,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendEquationAlpha: THREE.AddEquation,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneFactor,
    });
    tipMatRef.current = tipMat;
    scene.add(new THREE.Mesh(geometry, tipMat));

    let last = 0;
    let visible = document.visibilityState === "visible";
    let onScreen = false;

    const frame = (nowMs: number) => {
      const now = nowMs * 0.001;
      const dt = Math.min(now - last, 0.1);
      last = now;

      simMat.uniforms.tPrev.value = rtA.texture;
      simMat.uniforms.uDelta.value = dt;
      simMat.uniforms.uSimSpring.value = live.current.simSpring;
      simMat.uniforms.uSimDamping.value = live.current.simDamping;
      simMat.uniforms.uSimMaxVelocity.value = live.current.simMaxVelocity;
      simMat.uniforms.uSpringVariance.value = live.current.springVariance;
      simMat.uniforms.uOpacitySpeed.value = live.current.opacitySpeed;
      renderer.setRenderTarget(rtB);
      renderer.render(simScene, simCamera);
      renderer.setRenderTarget(null);

      const swap = rtA;
      rtA = rtB;
      rtB = swap;

      tipMat.uniforms.tSim.value = rtA.texture;
      tipMat.uniforms.uTime.value = now;
      tipMat.uniforms.uTipRadius.value = live.current.tipRadius;
      tipMat.uniforms.uSizeVariance.value = live.current.sizeVariance;
      tipMat.uniforms.uDispersionBand.value = live.current.dispersionBand;
      tipMat.uniforms.uDispersion.value = live.current.dispersion;
      tipMat.uniforms.uDispersionOffset.value = live.current.dispersionOffset;
      renderer.render(scene, camera);
    };

    const sync = () => renderer.setAnimationLoop(visible && onScreen ? frame : null);
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const resizeObserver = new ResizeObserver(() => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    });
    resizeObserver.observe(mount);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(mount);

    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      simMatRef.current = null;
      tipMatRef.current = null;
      transformsRef.current = [];
      rtA.dispose();
      rtB.dispose();
      dataTex.dispose();
      simMat.dispose();
      simGeo.dispose();
      simScene.clear();
      geometry.dispose();
      tipMat.dispose();
      scene.clear();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      setTimeout(() => renderer.forceContextLoss(), 1);
    };
    // Geometry-defining inputs only — everything else is read off `live`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed, cellCount, shapeCount, tipLayers]);

  // Swapping shape is only a uniform change; the springs animate the morph.
  useEffect(() => {
    const mat = simMatRef.current;
    const transforms = transformsRef.current;
    if (!mat || !transforms.length) return;
    const i = Math.max(0, Math.min(currentShape, transforms.length - 1));
    mat.uniforms.uActiveShapeTransform.value = transforms[i];
  }, [currentShape]);

  useEffect(() => {
    let tex: THREE.Texture | null = null;
    new THREE.TextureLoader().load(tipTexture, (loaded) => {
      loaded.wrapS = THREE.ClampToEdgeWrapping;
      loaded.wrapT = THREE.ClampToEdgeWrapping;
      loaded.minFilter = THREE.LinearFilter;
      loaded.magFilter = THREE.LinearFilter;
      tex = loaded;
      textureRef.current = loaded;
      if (tipMatRef.current) tipMatRef.current.uniforms.uTipTexture.value = loaded;
    });
    return () => {
      tex?.dispose();
      textureRef.current = null;
    };
  }, [tipTexture]);

  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fallbackImage}
        alt=""
        aria-hidden
        className={`${className ?? ""} object-contain`}
        style={style}
      />
    );
  }
  return <div ref={mountRef} className={className} style={style} aria-hidden />;
}
