"use client";

/**
 * Faithful port of the original site's `HeroThreeJSV2` Framer code component
 * (GPGPU strand renderer). Strand roots come from a 2D point cloud; each
 * strand is a 3-sided tube extruded toward an offset, simulated in ping-pong
 * float render targets (spring toward target, mouse repulsion, per-strand
 * stagger), displaced by Perlin noise in the vertex shader, with sprite tips
 * and a traveling pulse shimmer, additively blended.
 *
 * All parameter values below are the exact props the original page passed.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { HERO_POINTS } from "./heroPoints";
import { TERACODE_POINTS } from "./logoPoints";

export type StrandConfig = {
  points: string;
  threshold: number;
  scale: number;
  extrudeScale: number;
  extrudeOffset: { x: number; y: number; z: number };
  randomOffset: { x: number; y: number; z: number };
  steps: number;
  tubeRadius: number;
  tipLayers: number;
  tipRadius: number;
  noiseStrength: number;
  noiseScale: number;
  cameraFov: number;
  cameraPosition: { x: number; y: number; z: number };
  cameraRotationX: number;
  cameraRotationY: number;
  sizeVariance: number;
  dispersionOffset: number;
  dispersionBand: number;
  dispersion: number;
  simRadius: number;
  simStrength: number;
  /**
   * Pointer-motion sway applied to every strand, however far the pointer is.
   * Weighted toward each strand's free end, so the mark itself stays put.
   */
  swayStrength: number;
  swayMax: number;
  /** Ambient glow reach — wide enough to touch the whole cloud. */
  farRadius: number;
  farStrength: number;
  /** How fast the pointer-motion sway eases in and back out to rest. */
  pointerDamping: number;
  simSpring: number;
  simDamping: number;
  simMaxVelocity: number;
  opacitySpeed: number;
  maxDelay: number;
  highlightRadius: number;
  highlightSpeed: number;
  highlightStrength: number;
  strandOpacity: number;
  pulseStrength: number;
  pulseSpeedBase: number;
  pulseSpeedRandomMax: number;
  tipTexture: string;
  fallbackImage: string;
};

/** Exact props the original page passed to the hero graphic. */
export const HERO_CONFIG: StrandConfig = {
  points: HERO_POINTS,
  threshold: 0.4,
  scale: 1,
  extrudeScale: 0.95,
  extrudeOffset: { x: 0, y: 0.1, z: 0.4 },
  randomOffset: { x: 0.4, y: 0.2, z: 0.2 },
  steps: 32,
  tubeRadius: 0.0012,
  tipLayers: 8,
  tipRadius: 0.0035,
  noiseStrength: 0.15,
  noiseScale: 5,
  cameraFov: 36,
  cameraPosition: { x: 0, y: 0, z: 1.8 },
  cameraRotationX: 2,
  cameraRotationY: 0,
  sizeVariance: 0.49,
  dispersionOffset: 0.05,
  dispersionBand: 0.9,
  dispersion: 0.8,
  simRadius: 0.15,
  simStrength: 8,
  swayStrength: 0.14,
  swayMax: 0.16,
  farRadius: 1.3,
  farStrength: 0.45,
  pointerDamping: 5,
  simSpring: 60,
  simDamping: 6,
  simMaxVelocity: 5,
  opacitySpeed: 2,
  maxDelay: 1,
  highlightRadius: 0.3,
  highlightSpeed: 10,
  highlightStrength: 2,
  strandOpacity: 0.2,
  pulseStrength: 1,
  pulseSpeedBase: 0.1,
  pulseSpeedRandomMax: 0.1,
  tipTexture: "/art/hero-tip.png",
  fallbackImage: "/art/hero-fallback.png",
};

/**
 * Hero variant whose strand roots trace the TeraCode symbol (see
 * `scripts/generate-logo-points.mjs`). The mark is denser and more legible than
 * the knot, so it keeps more roots and softens the noise displacement to stop
 * the silhouette from smearing.
 */
export const HERO_LOGO_CONFIG: StrandConfig = {
  ...HERO_CONFIG,
  points: TERACODE_POINTS,
  threshold: 0.7,
  noiseStrength: 0.1,
  extrudeOffset: { x: 0, y: 0.08, z: 0.34 },
  randomOffset: { x: 0.3, y: 0.16, z: 0.16 },
};

const DEG = Math.PI / 180;

function parsePoints(str: string, threshold: number) {
  const nums = str.split(",").map(Number);
  if (nums.length < 2 || nums.length % 2 !== 0 || nums.some(isNaN)) {
    return { positions: null as Float32Array | null, numStrands: 0 };
  }
  const out: number[] = [];
  for (let i = 0; i < nums.length / 2; i++) {
    if (Math.random() > threshold) continue;
    out.push(nums[i * 2], nums[i * 2 + 1], 0);
  }
  return out.length
    ? { positions: new Float32Array(out), numStrands: out.length / 3 }
    : { positions: null, numStrands: 0 };
}

/* original: noiseCurve(e) = smoothstep(e) + .05 */
const noiseCurve = (e: number) => e * e * (3 - 2 * e) + 0.05;

const COPY_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

const SEED_FRAG = /* glsl */ `
uniform sampler2D tData;
uniform vec4 uAtlasPos; uniform vec4 uAtlasVel; uniform vec4 uDataStart;
varying vec2 vUv;
vec2 atlasUV(vec2 c, vec4 r) { return c * r.xy + r.zw; }
vec2 cellUVfromAtlas(vec2 a, vec4 r) { return (a - r.zw) / r.xy; }
void main() {
  bool isVelocity = vUv.y >= uAtlasVel.w;
  if (isVelocity) { gl_FragColor = vec4(0.0); return; }
  vec2 cellUv = cellUVfromAtlas(vUv, uAtlasPos);
  vec3 startPos = texture2D(tData, atlasUV(cellUv, uDataStart)).rgb;
  gl_FragColor = vec4(startPos, 0.0);
}
`;

const SIM_FRAG = /* glsl */ `
uniform sampler2D tPrev; uniform sampler2D tData;
uniform vec2 uMouse; uniform vec2 uMouseVel; uniform float uDelta;
uniform float uSway; uniform float uSwayMax;
uniform float uFarRadius; uniform float uFarStrength;
uniform float uRadius; uniform float uStrength; uniform float uSpring;
uniform float uDamping; uniform float uMaxVelocity;
uniform float uHighlightRadius; uniform float uHighlightSpeed;
uniform float uOpacitySpeed; uniform float uElapsed; uniform float uMaxDelay;
uniform vec4 uAtlasPos; uniform vec4 uAtlasVel;
uniform vec4 uDataTarget; uniform vec4 uDataStart; uniform vec4 uDataHighlightRef;

const float ACTIVATE_EASE = 0.35;
const float SANE_SQ = 1.0e8;
const float MAX_SPRING_STEP = 2.0;

varying vec2 vUv;
vec2 atlasUV(vec2 c, vec4 r) { return c * r.xy + r.zw; }
vec2 cellUVfromAtlas(vec2 a, vec4 r) { return (a - r.zw) / r.xy; }

void main() {
  bool isVelocity = vUv.y >= uAtlasVel.w;
  vec2 cellUv = isVelocity ? cellUVfromAtlas(vUv, uAtlasVel) : cellUVfromAtlas(vUv, uAtlasPos);

  vec4 posData = texture2D(tPrev, atlasUV(cellUv, uAtlasPos));
  vec3 pos = posData.rgb;
  float opacity = posData.a;

  vec4 velData = texture2D(tPrev, atlasUV(cellUv, uAtlasVel));
  vec3 vel = velData.rgb;
  float highlight = velData.a;

  vec4 targetData = texture2D(tData, atlasUV(cellUv, uDataTarget));
  vec3 targetPos = targetData.rgb;
  float rootAnchor = targetData.a; // 1 at the strand root, 0 at its free end
  vec3 highlightRef = texture2D(tData, atlasUV(cellUv, uDataHighlightRef)).rgb;
  float rStagger = texture2D(tData, atlasUV(cellUv, uDataStart)).a;

  if (!(dot(pos, pos) < SANE_SQ)) { pos = targetPos; vel = vec3(0.0); }
  if (!(dot(vel, vel) < SANE_SQ)) { vel = vec3(0.0); }
  if (!(opacity >= 0.0)) opacity = 0.0;
  if (!(highlight >= 0.0)) highlight = 0.0;

  float strandDelay = rStagger * uMaxDelay;
  float activeT = clamp((uElapsed - strandDelay) / ACTIVATE_EASE, 0.0, 1.0);

  vec2 toCell = pos.xy - uMouse;
  float dist = length(toCell);
  float repulse = 1.0 - smoothstep(0.0, uRadius, dist);
  vec2 repelDir = dist > 0.0001 ? toCell / dist : vec2(0.0, 1.0);
  vel.xy += repelDir * repulse * uStrength * uDelta;

  float speed = length(vel);
  if (speed > uMaxVelocity) vel = vel / speed * uMaxVelocity;

  float springStep = min(uSpring * uDelta, MAX_SPRING_STEP);
  // Pointer motion drags every strand's rest target, then it springs back. The
  // pull is weighted toward the free end (and varied per strand), so strands
  // bend individually instead of the whole mark sliding around.
  vec2 sway = clamp(uMouseVel * uSway, vec2(-uSwayMax), vec2(uSwayMax));
  float swayWeight = (1.0 - rootAnchor) * mix(0.55, 1.0, rStagger);
  vec3 swayTarget = targetPos + vec3(sway * swayWeight, 0.0);
  vel -= (pos - swayTarget) * springStep * activeT;
  vel *= exp(-uDamping * uDelta);

  pos += vel * uDelta;
  opacity += (activeT - opacity) * clamp(uOpacitySpeed * uDelta, 0.0, 1.0);
  opacity = clamp(opacity, 0.0, 1.0);

  float tipDist = length(uMouse - highlightRef.xy);
  float target = 1.0 - smoothstep(0.0, uHighlightRadius, tipDist);
  // Wide ambient falloff so no strand is ever fully unlit while the pointer moves.
  target = max(target, uFarStrength * (1.0 - smoothstep(0.0, uFarRadius, tipDist)));
  highlight = mix(highlight, target, clamp(uHighlightSpeed * uDelta, 0.0, 1.0));
  highlight = clamp(highlight, 0.0, 1.0);

  gl_FragColor = isVelocity ? vec4(vel, highlight) : vec4(pos, opacity);
}
`;

const STRAND_VERT = /* glsl */ `
#define OCTAVES 1

vec3 rand(in vec3 p) {
  p = fract(p * vec3(443.897, 441.423, 437.195));
  p += dot(p, p.yxz + 19.19);
  return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
}
vec3 quintic(const in vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
float perlin(in vec3 xyz) {
  vec3 gridUV = fract(xyz); vec3 gridID = floor(xyz);
  vec3 c000=vec3(0,0,0); vec3 c100=vec3(1,0,0);
  vec3 c010=vec3(0,1,0); vec3 c110=vec3(1,1,0);
  vec3 c001=vec3(0,0,1); vec3 c101=vec3(1,0,1);
  vec3 c011=vec3(0,1,1); vec3 c111=vec3(1,1,1);
  float r000=dot(gridUV-c000,rand(gridID+c000)); float r100=dot(gridUV-c100,rand(gridID+c100));
  float r010=dot(gridUV-c010,rand(gridID+c010)); float r110=dot(gridUV-c110,rand(gridID+c110));
  float r001=dot(gridUV-c001,rand(gridID+c001)); float r101=dot(gridUV-c101,rand(gridID+c101));
  float r011=dot(gridUV-c011,rand(gridID+c011)); float r111=dot(gridUV-c111,rand(gridID+c111));
  vec3 f=quintic(gridUV);
  float x0=mix(r000,r100,f.x); float x1=mix(r010,r110,f.x);
  float x2=mix(r001,r101,f.x); float x3=mix(r011,r111,f.x);
  float y0=mix(x0,x1,f.y); float y1=mix(x2,x3,f.y);
  return mix(y0,y1,f.z)*2.0;
}
float fractalBrownian(const in vec3 xyz, const in float ampWeight) {
  float result=0.0; float amp=1.0; float freq=1.0; float maxAmp=0.0;
  for(int i=0;i<OCTAVES;i++){ result+=amp*perlin(xyz*freq); maxAmp+=amp; amp*=ampWeight; freq*=2.0; }
  return result/maxAmp;
}

attribute vec3 aDir;
attribute float aSide;
attribute vec2 aRandom;
attribute vec3 aUV;
attribute float aTip;
attribute float aAdvect;
attribute vec2 aSimCell;

uniform float uTime;
uniform float uNoiseStrength; uniform float uNoiseScale;
uniform float uTubeRadius; uniform float uTipRadius;
uniform float uSizeVariance; uniform float uDispersionOffset;
uniform vec3 uDirection; uniform vec3 uRandomOffset;
uniform sampler2D tSim;
uniform vec4 uAtlasPos; uniform vec4 uAtlasVel;

varying vec2 vRandom; varying vec3 vUV;
varying float vTip; varying float vAdvect;
varying float vHighlight; varying float vOpacity;

vec2 atlasUV(vec2 c, vec4 r) { return c * r.xy + r.zw; }

void main() {
  vRandom = aRandom; vUV = aUV; vTip = aTip; vAdvect = aAdvect;

  vec4 posData = texture2D(tSim, atlasUV(aSimCell, uAtlasPos));
  vec3 worldPos = posData.rgb;
  vOpacity = posData.a;
  vHighlight = texture2D(tSim, atlasUV(aSimCell, uAtlasVel)).a;

  if (!(dot(worldPos, worldPos) < 1.0e8)) {
    gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
    vOpacity = 0.0;
    return;
  }
  if (!(vOpacity >= 0.0)) vOpacity = 0.0;
  if (!(vHighlight >= 0.0)) vHighlight = 0.0;

  vec3 coords = worldPos * uNoiseScale + uTime * -0.15 * uDirection + aRandom.yxy * uRandomOffset;
  float dx = fractalBrownian(coords, 0.5);
  float dy = fractalBrownian(coords + vec3(3.963, 1.053, 5.263), 0.5);
  vec3 noiseDisp = vec3(dx, dy, dx * dy) * aAdvect * uNoiseStrength;
  vec3 displacedPos = worldPos + noiseDisp;

  if (aTip > 0.5) {
    vec4 centerView = modelViewMatrix * vec4(displacedPos, 1.0);
    float sv = mix(1.0 - uSizeVariance, 1.0, aRandom.y);
    float ox = (aUV.x - 0.5) * 2.0 * uTipRadius * sv;
    float oy = (aUV.y - 0.5) * -2.0 * uTipRadius * sv;
    centerView.xy += vec2(ox, oy);
    float cycle = sin(uTime + aRandom.x * 6.28318) * 0.5 + 0.5;
    centerView.z += aUV.z * uDispersionOffset * cycle;
    gl_Position = projectionMatrix * centerView;
  } else {
    float sideIndex = round(aSide * 255.0);
    float angle = sideIndex * (2.0 * 3.14159265359 / 3.0);
    vec3 tangent = aDir;
    vec3 worldUp = abs(tangent.y) < 0.99 ? vec3(0,1,0) : vec3(1,0,0);
    vec3 right = normalize(cross(tangent, worldUp));
    vec3 up = normalize(cross(right, tangent));
    vec3 radial = cos(angle) * right + sin(angle) * up;
    vec3 extruded = displacedPos + radial * uTubeRadius;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(extruded, 1.0);
  }
}
`;

const STRAND_FRAG = /* glsl */ `
uniform float uTime;
uniform float uTipLayers; uniform float uDispersionBand; uniform float uDispersion;
uniform float uStrandOpacity; uniform float uHighlightStrength;
uniform float uPulseStrength; uniform float uPulseSpeedBase; uniform float uPulseSpeedRandomMax;
uniform sampler2D uTipTexture;

varying vec2 vRandom; varying vec3 vUV;
varying float vTip; varying float vHighlight; varying float vOpacity;

void main() {
  vec3 color = vec3(0.0);

  float pulseSpeed = uPulseSpeedBase + vRandom.x * uPulseSpeedRandomMax;
  float pulsePos = fract(uTime * pulseSpeed);
  float pulseDist = abs(vUV.x * 0.2 - pulsePos);
  pulseDist = min(pulseDist, 1.0 - pulseDist);
  float pulse = exp(-pulseDist * pulseDist * mix(5000.0, 10000.0, vRandom.y)) * vUV.x * uPulseStrength;

  if (vTip > 0.5) {
    vec2 centered = vUV.xy - vec2(0.5);
    if (length(centered) > 0.5) discard;
    float uvMin = 0.5 - uDispersionBand * 0.5;
    float uvMax = 0.5 + uDispersionBand * 0.5;
    float texU = mix(uvMin, uvMax, vUV.z);
    float texV = uDispersion * vRandom.x;
    color = texture2D(uTipTexture, vec2(texU, texV)).xyz;
    float a = clamp((vRandom.y / uTipLayers) * vOpacity, 0.0, 1.0);
    gl_FragColor = vec4(clamp(color, 0.0, 1.0) * a, a);
  } else {
    vec3 disperse = texture2D(uTipTexture, vec2(vUV.x * 2.0, uDispersion)).xyz;
    color = vec3(uStrandOpacity);
    color += pulse * mix(vec3(1.0, 0.85, 0.7), disperse, vRandom.y);
    color += vHighlight * disperse * vUV.x * vUV.x * uHighlightStrength * 0.5;
    float a = clamp((vRandom.x * vUV.x * vUV.x + pulse * 0.1 + vHighlight * vUV.x * vUV.x) * vOpacity, 0.0, 1.0);
    gl_FragColor = vec4(clamp(color, 0.0, 1.0) * a, a);
  }
}
`;

export function HeroStrands({
  className = "",
  config,
}: {
  className?: string;
  /** Partial overrides merged onto HERO_CONFIG (e.g. a different point cloud). */
  config?: Partial<StrandConfig>;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const P = useMemo<StrandConfig>(() => ({ ...HERO_CONFIG, ...config }), [config]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const { positions, numStrands } = parsePoints(P.points, P.threshold);
    if (!positions || !numStrands) {
      setFailed(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }

    const ringsPerStrand = P.steps + 1; // n
    const cellsPerStrand = ringsPerStrand + P.tipLayers; // i
    const totalCells = numStrands * cellsPerStrand; // a
    const texW = Math.ceil(Math.sqrt(totalCells)); // o
    const simH = texW * 2; // c
    const dataH = texW * 3; // l

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);
    const camera = new THREE.PerspectiveCamera(
      P.cameraFov,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(P.cameraPosition.x, P.cameraPosition.y, P.cameraPosition.z);
    cameraGroup.add(camera);
    cameraGroup.rotation.x = P.cameraRotationX * DEG;
    cameraGroup.rotation.y = P.cameraRotationY * DEG;

    const extrudeOffset = new THREE.Vector3(P.extrudeOffset.x, P.extrudeOffset.y, P.extrudeOffset.z);
    const randomOffset = new THREE.Vector3(P.randomOffset.x, P.randomOffset.y, P.randomOffset.z);

    const vertsPerStrand = ringsPerStrand * 3 + 4 * P.tipLayers; // S
    const totalVerts = numStrands * vertsPerStrand; // C
    const tubeIdx = (ringsPerStrand - 1) * 3 * 2 * 3; // Se
    const tipIdx = 6 * P.tipLayers; // we
    const totalIdx = numStrands * (tubeIdx + tipIdx); // Te

    const regionPos = new THREE.Vector4(1, 0.5, 0, 0);
    const regionVel = new THREE.Vector4(1, 0.5, 0, 0.5);
    const regionTarget = new THREE.Vector4(1, 1 / 3, 0, 0);
    const regionStart = new THREE.Vector4(1, 1 / 3, 0, 1 / 3);
    const regionHighlight = new THREE.Vector4(1, 1 / 3, 0, 2 / 3);

    const cellUV = (idx: number): [number, number] => [
      ((idx % texW) + 0.5) / texW,
      (Math.floor(idx / texW) + 0.5) / texW,
    ];

    const aPosition = new Float32Array(totalVerts * 3);
    const aDir = new Float32Array(totalVerts * 3);
    const aSide = new Uint8Array(totalVerts);
    const aRandom = new Float32Array(totalVerts * 2);
    const aUV = new Float32Array(totalVerts * 3);
    const aTip = new Uint8Array(totalVerts);
    const aAdvect = new Float32Array(totalVerts);
    const aSimCell = new Float32Array(totalVerts * 2);
    const indices = new Uint32Array(totalIdx);
    const data = new Float32Array(texW * dataH * 4);
    const secTarget = 0;
    const secStart = texW * texW;
    const secHighlight = texW * texW * 2;

    const lerped = new THREE.Vector3();
    const root = new THREE.Vector3(); // L
    const tipEnd = new THREE.Vector3(); // R
    const dir = new THREE.Vector3(); // B
    let vCount = 0;
    let iCount = 0;

    function buildStrand(s: number) {
      const t3 = s * 3;
      const r1 = Math.random();
      const r2 = Math.random();
      const stagger = Math.random();
      const vBase = s * vertsPerStrand;
      root.set(positions![t3], positions![t3 + 1], positions![t3 + 2]).multiplyScalar(P.scale);
      tipEnd.copy(root).multiplyScalar(P.extrudeScale).add(extrudeOffset);
      dir.subVectors(tipEnd, root).normalize();

      for (let ring = 0; ring < ringsPerStrand; ring++) {
        const frac = ring / (ringsPerStrand - 1);
        lerped.lerpVectors(root, tipEnd, frac);
        const inv = 1 - frac;
        const cell = s * cellsPerStrand + ring;
        const [cu, cv] = cellUV(cell);
        data[(secTarget + cell) * 4] = lerped.x;
        data[(secTarget + cell) * 4 + 1] = lerped.y;
        data[(secTarget + cell) * 4 + 2] = lerped.z;
        data[(secTarget + cell) * 4 + 3] = inv;
        data[(secStart + cell) * 4] = tipEnd.x;
        data[(secStart + cell) * 4 + 1] = tipEnd.y;
        data[(secStart + cell) * 4 + 2] = tipEnd.z;
        data[(secStart + cell) * 4 + 3] = stagger;
        data[(secHighlight + cell) * 4] = root.x;
        data[(secHighlight + cell) * 4 + 1] = root.y;
        data[(secHighlight + cell) * 4 + 2] = root.z;
        data[(secHighlight + cell) * 4 + 3] = 0;

        for (let side = 0; side < 3; side++) {
          const p3 = vCount * 3;
          const p2 = vCount * 2;
          aPosition[p3] = tipEnd.x;
          aPosition[p3 + 1] = tipEnd.y;
          aPosition[p3 + 2] = tipEnd.z;
          aDir[p3] = dir.x;
          aDir[p3 + 1] = dir.y;
          aDir[p3 + 2] = dir.z;
          aSide[vCount] = side;
          aRandom[p2] = r1;
          aRandom[p2 + 1] = r2;
          aUV[p3] = inv;
          aUV[p3 + 1] = side / 3;
          aUV[p3 + 2] = 0;
          aAdvect[vCount] = noiseCurve(1 - inv);
          aSimCell[p2] = cu;
          aSimCell[p2 + 1] = cv;
          vCount++;
        }
        if (ring < ringsPerStrand - 1) {
          for (let side = 0; side < 3; side++) {
            const a = vBase + ring * 3 + side;
            const b = vBase + ring * 3 + ((side + 1) % 3);
            const c = vBase + (ring + 1) * 3 + side;
            const d = vBase + (ring + 1) * 3 + ((side + 1) % 3);
            indices[iCount++] = a;
            indices[iCount++] = c;
            indices[iCount++] = b;
            indices[iCount++] = c;
            indices[iCount++] = d;
            indices[iCount++] = b;
          }
        }
      }

      const corners = [0, 0, 1, 0, 0, 1, 1, 1];
      for (let layer = 0; layer < P.tipLayers; layer++) {
        const layerFrac = P.tipLayers > 1 ? layer / (P.tipLayers - 1) : 0;
        const quadBase = vBase + ringsPerStrand * 3 + layer * 4;
        const cell = s * cellsPerStrand + ringsPerStrand + layer;
        const [cu, cv] = cellUV(cell);
        data[(secTarget + cell) * 4] = root.x;
        data[(secTarget + cell) * 4 + 1] = root.y;
        data[(secTarget + cell) * 4 + 2] = root.z;
        data[(secTarget + cell) * 4 + 3] = 1;
        data[(secStart + cell) * 4] = tipEnd.x;
        data[(secStart + cell) * 4 + 1] = tipEnd.y;
        data[(secStart + cell) * 4 + 2] = tipEnd.z;
        data[(secStart + cell) * 4 + 3] = stagger;
        data[(secHighlight + cell) * 4] = root.x;
        data[(secHighlight + cell) * 4 + 1] = root.y;
        data[(secHighlight + cell) * 4 + 2] = root.z;
        data[(secHighlight + cell) * 4 + 3] = 0;

        for (let corner = 0; corner < 4; corner++) {
          const p3 = vCount * 3;
          const p2 = vCount * 2;
          aPosition[p3] = tipEnd.x;
          aPosition[p3 + 1] = tipEnd.y;
          aPosition[p3 + 2] = tipEnd.z;
          aDir[p3] = dir.x;
          aDir[p3 + 1] = dir.y;
          aDir[p3 + 2] = dir.z;
          aSide[vCount] = 0;
          aRandom[p2] = r1;
          aRandom[p2 + 1] = r2;
          aUV[p3] = corners[corner * 2];
          aUV[p3 + 1] = corners[corner * 2 + 1];
          aUV[p3 + 2] = layerFrac;
          aAdvect[vCount] = noiseCurve(0);
          aTip[vCount] = 255;
          aSimCell[p2] = cu;
          aSimCell[p2 + 1] = cv;
          vCount++;
        }
        indices[iCount++] = quadBase + 0;
        indices[iCount++] = quadBase + 2;
        indices[iCount++] = quadBase + 1;
        indices[iCount++] = quadBase + 2;
        indices[iCount++] = quadBase + 3;
        indices[iCount++] = quadBase + 1;
      }
    }
    for (let s = 0; s < numStrands; s++) buildStrand(s);

    const dataTex = new THREE.DataTexture(data, texW, dataH, THREE.RGBAFormat, THREE.FloatType);
    dataTex.minFilter = THREE.NearestFilter;
    dataTex.magFilter = THREE.NearestFilter;
    dataTex.needsUpdate = true;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(aPosition, 3));
    geometry.setAttribute("aDir", new THREE.BufferAttribute(aDir, 3));
    geometry.setAttribute("aSide", new THREE.BufferAttribute(aSide, 1, true));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(aRandom, 2));
    geometry.setAttribute("aUV", new THREE.BufferAttribute(aUV, 3));
    geometry.setAttribute("aTip", new THREE.BufferAttribute(aTip, 1, true));
    geometry.setAttribute("aAdvect", new THREE.BufferAttribute(aAdvect, 1));
    geometry.setAttribute("aSimCell", new THREE.BufferAttribute(aSimCell, 2));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const rtOpts = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    } as const;
    let rtA = new THREE.WebGLRenderTarget(texW, simH, rtOpts);
    let rtB = rtA.clone();

    const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadGeo = new THREE.PlaneGeometry(2, 2);

    // Seed pass: park every cell at the strand's far end, velocity zero.
    const seedMat = new THREE.ShaderMaterial({
      uniforms: {
        tData: { value: dataTex },
        uAtlasPos: { value: regionPos.clone() },
        uAtlasVel: { value: regionVel.clone() },
        uDataStart: { value: regionStart.clone() },
      },
      vertexShader: COPY_VERT,
      fragmentShader: SEED_FRAG,
    });
    const seedScene = new THREE.Scene();
    seedScene.add(new THREE.Mesh(quadGeo, seedMat));
    renderer.setRenderTarget(rtA);
    renderer.render(seedScene, quadCam);
    renderer.setRenderTarget(rtB);
    renderer.render(seedScene, quadCam);
    renderer.setRenderTarget(null);
    seedScene.clear();
    seedMat.dispose();

    const simScene = new THREE.Scene();
    const simMat = new THREE.ShaderMaterial({
      uniforms: {
        tPrev: { value: rtA.texture },
        tData: { value: dataTex },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseVel: { value: new THREE.Vector2(0, 0) },
        uSway: { value: P.swayStrength },
        uSwayMax: { value: P.swayMax },
        uFarRadius: { value: P.farRadius },
        uFarStrength: { value: P.farStrength },
        uDelta: { value: 0 },
        uRadius: { value: P.simRadius },
        uStrength: { value: P.simStrength },
        uSpring: { value: P.simSpring },
        uDamping: { value: P.simDamping },
        uMaxVelocity: { value: P.simMaxVelocity },
        uHighlightRadius: { value: P.highlightRadius },
        uHighlightSpeed: { value: P.highlightSpeed },
        uOpacitySpeed: { value: P.opacitySpeed },
        uElapsed: { value: 0 },
        uMaxDelay: { value: P.maxDelay },
        uAtlasPos: { value: regionPos.clone() },
        uAtlasVel: { value: regionVel.clone() },
        uDataTarget: { value: regionTarget.clone() },
        uDataStart: { value: regionStart.clone() },
        uDataHighlightRef: { value: regionHighlight.clone() },
      },
      vertexShader: COPY_VERT,
      fragmentShader: SIM_FRAG,
    });
    simScene.add(new THREE.Mesh(quadGeo, simMat));

    const strandMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDirection: { value: extrudeOffset.clone().normalize() },
        uNoiseStrength: { value: P.noiseStrength },
        uNoiseScale: { value: P.noiseScale },
        uRandomOffset: { value: randomOffset },
        uTubeRadius: { value: P.tubeRadius },
        uTipRadius: { value: P.tipRadius },
        uTipTexture: { value: null as THREE.Texture | null },
        uTipLayers: { value: P.tipLayers },
        uSizeVariance: { value: P.sizeVariance },
        uDispersionOffset: { value: P.dispersionOffset },
        uDispersionBand: { value: P.dispersionBand },
        uDispersion: { value: P.dispersion },
        uStrandOpacity: { value: P.strandOpacity },
        uHighlightStrength: { value: P.highlightStrength },
        uPulseStrength: { value: P.pulseStrength },
        uPulseSpeedBase: { value: P.pulseSpeedBase },
        uPulseSpeedRandomMax: { value: P.pulseSpeedRandomMax },
        tSim: { value: rtA.texture },
        uAtlasPos: { value: regionPos.clone() },
        uAtlasVel: { value: regionVel.clone() },
      },
      vertexShader: STRAND_VERT,
      fragmentShader: STRAND_FRAG,
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

    new THREE.TextureLoader().load(P.tipTexture, (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      strandMat.uniforms.uTipTexture.value = tex;
    });

    const mesh = new THREE.Mesh(geometry, strandMat);
    mesh.rotateX(Math.PI); // point cloud is y-down image space
    scene.add(mesh);
    mesh.updateWorldMatrix(true, false);
    const meshInverse = mesh.matrixWorld.clone().invert();

    // Mouse → strand-local plane (z=0) intersection
    const OFFSCREEN = -9999;
    const mouse = new THREE.Vector2(OFFSCREEN, OFFSCREEN);
    const ndc = new THREE.Vector3();
    const camPos = new THREE.Vector3();
    const rayDir = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    const hit = new THREE.Vector3();
    const pointerVel = new THREE.Vector2(0, 0);
    const instVel = new THREE.Vector2(0, 0);
    const prevHit = new THREE.Vector2(OFFSCREEN, OFFSCREEN);
    // Tracked on the window, not the canvas: the graphic sits in a corner, and
    // every pointer move anywhere on the page should move every strand.
    const onMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.set(e.clientX - rect.left, e.clientY - rect.top);
    };
    const onLeave = () => {
      mouse.set(OFFSCREEN, OFFSCREEN);
      prevHit.set(OFFSCREEN, OFFSCREEN);
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    let last = 0;
    let elapsed = 0;
    let intersecting = false;

    function frame(nowMs: number) {
      const now = nowMs * 0.001;
      const dt = Math.min(now - last, 0.1);
      last = now;
      elapsed += dt;
      camera.updateWorldMatrix(true, false);

      const w = mount!.clientWidth;
      const h = mount!.clientHeight;
      // Pointer velocity and camera tilt ease back to rest whenever the pointer
      // stops, so the whole cloud settles instead of freezing mid-lean.
      const decay = Math.exp(-P.pointerDamping * dt);
      pointerVel.multiplyScalar(decay);

      if (mouse.x <= OFFSCREEN) {
        simMat.uniforms.uMouse.value.set(OFFSCREEN, OFFSCREEN);
        prevHit.set(OFFSCREEN, OFFSCREEN);
      } else {
        const nx = (mouse.x / w) * 2 - 1;
        const ny = -((mouse.y / h) * 2 - 1);
        ndc.set(nx, ny, 0.5).applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
        camPos.setFromMatrixPosition(camera.matrixWorld);
        rayDir.copy(ndc).sub(camPos).normalize();
        camera.getWorldDirection(camDir);
        const t = -camDir.dot(camPos) / camDir.dot(rayDir);
        hit.copy(camPos).addScaledVector(rayDir, t).applyMatrix4(meshInverse);
        if (prevHit.x > OFFSCREEN && dt > 0) {
          instVel.set((hit.x - prevHit.x) / dt, (hit.y - prevHit.y) / dt);
          pointerVel.lerp(instVel, 1 - decay); // ease in as well as out
        }
        prevHit.set(hit.x, hit.y);
        simMat.uniforms.uMouse.value.set(hit.x, hit.y);
      }
      simMat.uniforms.uMouseVel.value.copy(pointerVel);

      simMat.uniforms.tPrev.value = rtA.texture;
      simMat.uniforms.uDelta.value = dt;
      simMat.uniforms.uElapsed.value = elapsed;
      renderer.setRenderTarget(rtB);
      renderer.render(simScene, quadCam);
      renderer.setRenderTarget(null);

      const swap = rtA;
      rtA = rtB;
      rtB = swap;
      strandMat.uniforms.tSim.value = rtA.texture;
      strandMat.uniforms.uTime.value = now;
      renderer.render(scene, camera);
    }

    // Paint one frame right away so the hero never sits empty: the
    // IntersectionObserver callback is async, and in a hidden/occluded tab
    // (background open, macOS window occlusion) the animation loop cannot run
    // at all until the tab is shown. The browser already throttles
    // requestAnimationFrame for hidden documents, so the loop itself only needs
    // the on-screen gate.
    frame(performance.now());

    const updateLoop = () => {
      renderer.setAnimationLoop(intersecting ? frame : null);
    };

    const resizeObserver = new ResizeObserver(() => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    });
    resizeObserver.observe(mount);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        updateLoop();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(mount);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      scene.clear();
      geometry.dispose();
      strandMat.dispose();
      simMat.dispose();
      dataTex.dispose();
      rtA.dispose();
      rtB.dispose();
      quadGeo.dispose();
      (strandMat.uniforms.uTipTexture.value as THREE.Texture | null)?.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      setTimeout(() => renderer.forceContextLoss(), 1);
    };
  }, [P]);

  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={P.fallbackImage} alt="" aria-hidden className={`${className} object-cover`} />
    );
  }
  return <div ref={mountRef} className={className} aria-hidden />;
}
