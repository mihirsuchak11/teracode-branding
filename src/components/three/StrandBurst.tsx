"use client";

/**
 * Port of the original site's `StrandsThreeJS` Framer code component — the
 * radial strand burst behind the closing CTA.
 *
 * 1600 strands fire outward from near the origin along random directions: 90%
 * short (48 segments), 10% long (96). Each segment is a 3-sided tube ring, and
 * each strand ends in `tipLayers` billboard sprites.
 *
 * Positions live on the GPU. One N×2N half-float ping-pong target holds
 * position in its top half and velocity + a highlight value in its bottom half;
 * a matching N×2N float data texture holds each cell's rest position (top) and
 * its strand's tip position (bottom, used as the highlight reference). The sim
 * pass springs every point back to rest, pushes it away from the pointer, and
 * eases the highlight; the draw pass reads that texture in the vertex shader,
 * displaces by fbm noise along the strand, and extrudes the tube.
 *
 * `introProgress` sweeps 0 → 1.1 when the band is at least half on screen,
 * revealing each strand from its root outward, and back to 0 when it leaves —
 * the original sets `animateOnce: false`, so this replays on every pass.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

export type StrandBurstProps = {
  className?: string;
  tipTexture?: string;
  fallbackImage?: string;
  fallbackAlt?: string;
};

/** Exact props the original page passed to the CTA instance. */
const P = {
  tubeRadius: 0.01,
  tipLayers: 6,
  totalLines: 1600,
  shortLineRatio: 0.9,
  shortSegments: 48,
  longSegments: 96,
  minStart: { x: -1, y: 0.6, z: 0 },
  maxStart: { x: 1, y: -0.6, z: 1 },
  shortLengthMin: 1.4,
  shortLengthMax: 4,
  longLengthMin: 3,
  longLengthMax: 8,
  tipRadius: 0.02,
  noiseStrength: 0.35,
  noiseScale: 0.73,
  sizeVariance: 0.5,
  dispersionOffset: 0.385,
  dispersionBand: 0.9,
  dispersion: 0.8,
  strandOpacity: 0.25,
  highlightRadius: 2,
  highlightStrength: 2,
  highlightSpeed: 8,
  pulseStrength: 0.35,
  pulseSpeedBase: 0.03,
  pulseSpeedRandomMax: 0.1,
  simRadius: 2,
  simStrength: 15,
  simSpring: 45,
  simDamping: 6,
  simMaxVelocity: 14,
  cameraFov: 34,
  cameraZ: 16,
  cameraRotationX: 0.01,
  /** The "Visible" variant's value; the band animates 0 -> this on entry. */
  introTarget: 1.1,
};

const OFF = -9999;

/** Atlas regions: (scaleX, scaleY, offsetX, offsetY) into the N×2N textures. */
const REGION_TOP = new THREE.Vector4(1, 0.5, 0, 0);
const REGION_BOTTOM = new THREE.Vector4(1, 0.5, 0, 0.5);

const seedFragment = `
uniform sampler2D tData;
uniform vec4 uAtlasPos;
uniform vec4 uAtlasVel;
uniform vec4 uDataTarget;
varying vec2 vUv;

vec2 atlasUV(vec2 cellUv, vec4 region) { return cellUv * region.xy + region.zw; }
vec2 cellUVfromAtlas(vec2 atlasUv, vec4 region) { return (atlasUv - region.zw) / region.xy; }

void main() {
  if (vUv.y >= uAtlasVel.w) { gl_FragColor = vec4(0.0); return; }
  vec2 cellUv = cellUVfromAtlas(vUv, uAtlasPos);
  gl_FragColor = vec4(texture2D(tData, atlasUV(cellUv, uDataTarget)).rgb, 1.0);
}
`;

const simFragment = `
uniform sampler2D tPrev;
uniform sampler2D tData;
uniform vec2  uMouse;
uniform float uDelta;
uniform float uRadius;
uniform float uStrength;
uniform float uSpring;
uniform float uDamping;
uniform float uMaxVelocity;
uniform float uHighlightRadius;
uniform float uHighlightSpeed;
uniform vec4  uAtlasPos;
uniform vec4  uAtlasVel;
uniform vec4  uDataTarget;
uniform vec4  uDataHighlightRef;

// Half-float targets saturate at 65504 and the scene lives within a few dozen
// units of the origin, so anything past this is garbage.
const float SANE_SQ = 1.0e8;
// Past ~2.0 the explicit-Euler spring overshoots and diverges.
const float MAX_SPRING_STEP = 2.0;

varying vec2 vUv;

vec2 atlasUV(vec2 cellUv, vec4 region) { return cellUv * region.xy + region.zw; }
vec2 cellUVfromAtlas(vec2 atlasUv, vec4 region) { return (atlasUv - region.zw) / region.xy; }

void main() {
  bool isVelocity = vUv.y >= uAtlasVel.w;
  vec2 cellUv = isVelocity
    ? cellUVfromAtlas(vUv, uAtlasVel)
    : cellUVfromAtlas(vUv, uAtlasPos);

  vec3 pos = texture2D(tPrev, atlasUV(cellUv, uAtlasPos)).rgb;
  vec4 velData = texture2D(tPrev, atlasUV(cellUv, uAtlasVel));
  vec3 vel = velData.rgb;
  float highlight = velData.a;

  vec3 targetPos = texture2D(tData, atlasUV(cellUv, uDataTarget)).rgb;
  vec3 highlightRef = texture2D(tData, atlasUV(cellUv, uDataHighlightRef)).rgb;

  // One NaN entering a ping-pong buffer never leaves it — it is read back and
  // propagated every frame after, which under additive blending reads as a
  // solid white canvas. The NOT-less-than form is NaN-safe.
  if (!(dot(pos, pos) < SANE_SQ)) { pos = targetPos; vel = vec3(0.0); }
  if (!(dot(vel, vel) < SANE_SQ)) vel = vec3(0.0);
  if (!(highlight >= 0.0)) highlight = 0.0;

  // Pointer repulsion
  vec2 toCell = pos.xy - uMouse;
  float dist = length(toCell);
  float repulse = 1.0 - smoothstep(0.0, uRadius, dist);
  vec2 repelDir = dist > 0.0001 ? toCell / dist : vec2(0.0, 1.0);
  vel.xy += repelDir * repulse * uStrength * uDelta;

  float speed = length(vel);
  if (speed > uMaxVelocity) vel = vel / speed * uMaxVelocity;

  // Spring back to rest, impulse clamped against long-frame overshoot.
  vel -= (pos - targetPos) * min(uSpring * uDelta, MAX_SPRING_STEP);

  // exp(-x) instead of (1 - damping*dt), which flips sign once damping*dt > 1.
  vel *= exp(-uDamping * uDelta);

  pos += vel * uDelta;

  // Highlight tracks the pointer's distance to this strand's tip.
  float tipDist = length(uMouse - highlightRef.xy);
  float target = 1.0 - smoothstep(0.0, uHighlightRadius, tipDist);
  highlight = mix(highlight, target, clamp(uHighlightSpeed * uDelta, 0.0, 1.0));
  highlight = clamp(highlight, 0.0, 1.0);

  gl_FragColor = isVelocity ? vec4(vel, highlight) : vec4(pos, 1.0);
}
`;

const drawVertex = `
#define OCTAVES 1

vec3 rand(in vec3 p) {
  p = fract(p * vec3(443.897, 441.423, 437.195));
  p += dot(p, p.yxz + 19.19);
  return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
}

vec3 quintic(const in vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float perlin(in vec3 xyz) {
  vec3 gridUV = fract(xyz);
  vec3 gridID = floor(xyz);
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
  for(int i=0;i<OCTAVES;i++){
    result+=amp*perlin(xyz*freq); maxAmp+=amp; amp*=ampWeight; freq*=2.0;
  }
  return result/maxAmp;
}

attribute vec3  aDir;
attribute float aSide;
attribute vec2  aRandom;
attribute vec3  aUV;
attribute float aTip;
attribute float aLong;
attribute vec2  aSimCell;

uniform float uTime;
uniform float uNoiseStrength;
uniform float uNoiseScale;
uniform float uTubeRadius;
uniform float uTipRadius;
uniform float uSizeVariance;
uniform float uDispersionOffset;
uniform sampler2D tSim;
uniform vec4  uAtlasPos;
uniform vec4  uAtlasVel;

varying vec2  vRandom;
varying vec3  vUV;
varying float vTip;
varying float vHighlight;

vec2 atlasUV(vec2 cellUv, vec4 region) { return cellUv * region.xy + region.zw; }

void main() {
  vRandom = aRandom;
  vUV = aUV;
  vTip = aTip;

  vec3 worldPos = texture2D(tSim, atlasUV(aSimCell, uAtlasPos)).rgb;
  vHighlight = texture2D(tSim, atlasUV(aSimCell, uAtlasVel)).a;

  // Second line of defence: the sim self-heals, but a bad value would still be
  // visible for one frame, and a non-finite gl_Position produces undefined,
  // often screen-filling geometry. Collapse the vertex instead.
  if (!(dot(worldPos, worldPos) < 1.0e8)) {
    gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
    vHighlight = 0.0;
    return;
  }
  if (!(vHighlight >= 0.0)) vHighlight = 0.0;

  // Position along the strand: 0 at the root, 1 at the tip. Tip billboards use
  // aUV.xy for their own quad UV, so they count as sitting at 1.
  float strandFactor = aTip > 0.5 ? 1.0 : aUV.x;

  float lineOffset = aRandom.x * 1.8 + uTime * 0.03;
  vec3 coords = worldPos + vec3(lineOffset);
  float animFactor = -0.3;
  coords -= aDir * animFactor * uTime * aRandom.x;
  coords *= uNoiseScale;

  float dx = fractalBrownian(coords, 0.5);
  float dy = fractalBrownian(coords + vec3(3.963, 1.053, 5.263), 0.5);

  float dispScale = aLong > 0.5 ? 0.910 : 0.830;
  vec3 noiseDisp = vec3(dx, dy, dx * dy) * dispScale * uNoiseStrength * strandFactor;
  vec3 displacedPos = worldPos + noiseDisp;

  if (aTip > 0.5) {
    vec4 centerView = modelViewMatrix * vec4(displacedPos, 1.0);
    float sv = mix(1.0 - uSizeVariance, 1.0, aRandom.y);
    centerView.xy += vec2(
      (aUV.x - 0.5) * 2.0 * uTipRadius * sv,
      (aUV.y - 0.5) * -2.0 * uTipRadius * sv
    );
    float cycle = sin(uTime + aRandom.x * 6.28318) * 0.5 + 0.5;
    centerView.z += aUV.z * uDispersionOffset * cycle;
    gl_Position = projectionMatrix * centerView;
  } else {
    float angle = aSide * (2.0 * 3.14159265359 / 3.0);
    vec3 tangent = aDir;
    vec3 worldUp = abs(tangent.y) < 0.99 ? vec3(0,1,0) : vec3(1,0,0);
    vec3 right = normalize(cross(tangent, worldUp));
    vec3 up = normalize(cross(right, tangent));
    vec3 radial = cos(angle) * right + sin(angle) * up;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPos + radial * uTubeRadius, 1.0);
  }
}
`;

const drawFragment = `
precision highp float;

uniform float uTime;
uniform float uTipLayers;
uniform float uDispersionBand;
uniform float uDispersion;
uniform float uStrandOpacity;
uniform float uHighlightStrength;
uniform float uPulseStrength;
uniform float uPulseSpeedBase;
uniform float uPulseSpeedRandomMax;
uniform float uIntroProgress;
uniform sampler2D uTipTexture;

varying vec2  vRandom;
varying vec3  vUV;
varying float vTip;
varying float vHighlight;

void main() {
  vec3 color = vec3(0.0);

  // Reveal root-first: a point shows once 2x progress passes its own
  // position-plus-random threshold, so strands cross over at staggered times.
  float reveal = uIntroProgress * 2.0 > (vUV.x + vRandom.x) ? 1.0 : 0.0;

  float pulseSpeed = uPulseSpeedBase + vRandom.x * uPulseSpeedRandomMax;
  float pulsePos = fract(uTime * pulseSpeed);
  float pulseDist = abs(vUV.x * 0.2 + pulsePos);
  pulseDist = min(pulseDist, 1.0 - pulseDist);
  float pulse = exp(-pulseDist * pulseDist * mix(5000.0, 10000.0, vRandom.y)) * vUV.x * uPulseStrength;

  if (vTip > 0.5) {
    if (length(vUV.xy - vec2(0.5)) > 0.5) discard;
    float uvMin = 0.5 - uDispersionBand * 0.5;
    float uvMax = 0.5 + uDispersionBand * 0.5;
    color = texture2D(uTipTexture, vec2(mix(uvMin, uvMax, vUV.z), uDispersion * vRandom.x)).xyz;

    float a = clamp((vRandom.y / uTipLayers) * clamp(uIntroProgress, 0.0, 1.0), 0.0, 1.0);
    gl_FragColor = vec4(clamp(color, 0.0, 1.0) * a, a);
  } else {
    vec3 disperse = texture2D(uTipTexture, vec2(vUV.x * 2.0, uDispersion)).xyz;
    color = vec3(uStrandOpacity);
    color += pulse * mix(vec3(1.0, 0.85, 0.7), disperse, vRandom.y);
    color += vHighlight * disperse * vUV.x * vUV.x * uHighlightStrength * 0.5;

    float a = clamp((vRandom.x * vUV.x * vUV.x + pulse * 0.1
                     + vHighlight * vUV.x * vUV.x) * reveal, 0.0, 1.0);
    gl_FragColor = vec4(clamp(color, 0.0, 1.0) * a, a);
  }
}
`;

export function StrandBurst({
  className,
  tipTexture = "/art/hero-tip.png",
  fallbackImage = "/art/cta-burst.png",
  fallbackAlt = "",
}: StrandBurstProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const drawMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();

  // Reduced motion: skip the whole simulation and show the site's own fallback.
  const enabled = !reduced;

  const geo = useMemo(() => {
    const shortCount = Math.round(P.totalLines * P.shortLineRatio);
    const longCount = P.totalLines - shortCount;
    const vertsPerShort = P.shortSegments * 3 + 4 * P.tipLayers;
    const vertsPerLong = P.longSegments * 3 + 4 * P.tipLayers;
    const cellsPerShort = P.shortSegments + P.tipLayers;
    const cellsPerLong = P.longSegments + P.tipLayers;
    const vertexCount = shortCount * vertsPerShort + longCount * vertsPerLong;
    const indexCount =
      shortCount * ((P.shortSegments - 1) * 18 + 6 * P.tipLayers) +
      longCount * ((P.longSegments - 1) * 18 + 6 * P.tipLayers);
    const cellCount = shortCount * cellsPerShort + longCount * cellsPerLong;
    const n = Math.ceil(Math.sqrt(cellCount));
    return { shortCount, longCount, vertexCount, indexCount, cellCount, n };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !enabled) return;

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
      P.cameraFov,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, P.cameraZ);
    camera.rotation.x = P.cameraRotationX;

    const { shortCount, longCount, vertexCount, indexCount, n } = geo;
    const texH = n * 2;
    const half = n * n;

    // --- build every strand ---
    const aPosition = new Float32Array(vertexCount * 3);
    const aDir = new Float32Array(vertexCount * 3);
    const aSide = new Uint8Array(vertexCount);
    const aRandom = new Float32Array(vertexCount * 2);
    const aUV = new Float32Array(vertexCount * 3);
    const aTip = new Uint8Array(vertexCount);
    const aLong = new Uint8Array(vertexCount);
    const aSimCell = new Float32Array(vertexCount * 2);
    const indices = new Uint32Array(indexCount);
    const data = new Float32Array(n * texH * 4);

    const dir = new THREE.Vector3();
    const root = new THREE.Vector3();
    const tip = new THREE.Vector3();
    const ring = new THREE.Vector3();
    const corners = [0, 0, 1, 0, 0, 1, 1, 1];
    const cellUV = (i: number): [number, number] => [
      ((i % n) + 0.5) / n,
      (Math.floor(i / n) + 0.5) / n,
    ];

    let v = 0;
    let ix = 0;
    let cell = 0;

    const buildStrand = (segments: number, isLong: boolean) => {
      const rLen = Math.random();
      const r1 = Math.random();
      const r2 = Math.random();
      const vBase = v;
      const cBase = cell;

      dir
        .set(
          THREE.MathUtils.lerp(P.minStart.x, P.maxStart.x, Math.random()),
          THREE.MathUtils.lerp(P.minStart.y, P.maxStart.y, Math.random()),
          THREE.MathUtils.lerp(P.minStart.z, P.maxStart.z, Math.random()),
        )
        .normalize();

      root.copy(dir).multiplyScalar(THREE.MathUtils.lerp(0.3, 0.9, rLen));
      const length = isLong
        ? THREE.MathUtils.lerp(P.longLengthMin, P.longLengthMax, rLen)
        : THREE.MathUtils.lerp(P.shortLengthMin, P.shortLengthMax, rLen);
      const step = length / (segments - 1);
      tip.copy(root).addScaledVector(dir, length);

      for (let s = 0; s < segments; s++) {
        const factor = s / (segments - 1);
        ring.copy(root).addScaledVector(dir, s * step);
        const c = cBase + s;
        const [cu, cv] = cellUV(c);

        // top half = rest position, bottom half = this strand's tip
        data[c * 4] = ring.x;
        data[c * 4 + 1] = ring.y;
        data[c * 4 + 2] = ring.z;
        data[(half + c) * 4] = tip.x;
        data[(half + c) * 4 + 1] = tip.y;
        data[(half + c) * 4 + 2] = tip.z;

        for (let side = 0; side < 3; side++) {
          aPosition[v * 3] = ring.x;
          aPosition[v * 3 + 1] = ring.y;
          aPosition[v * 3 + 2] = ring.z;
          aDir[v * 3] = dir.x;
          aDir[v * 3 + 1] = dir.y;
          aDir[v * 3 + 2] = dir.z;
          aSide[v] = side;
          aRandom[v * 2] = r1;
          aRandom[v * 2 + 1] = r2;
          aUV[v * 3] = factor;
          aUV[v * 3 + 1] = side / 3;
          aUV[v * 3 + 2] = 0;
          aLong[v] = isLong ? 1 : 0;
          aSimCell[v * 2] = cu;
          aSimCell[v * 2 + 1] = cv;
          v++;
        }

        if (s < segments - 1) {
          for (let side = 0; side < 3; side++) {
            const a = vBase + s * 3 + side;
            const b = vBase + s * 3 + ((side + 1) % 3);
            const c2 = vBase + (s + 1) * 3 + side;
            const d = vBase + (s + 1) * 3 + ((side + 1) % 3);
            indices[ix++] = a;
            indices[ix++] = c2;
            indices[ix++] = b;
            indices[ix++] = c2;
            indices[ix++] = d;
            indices[ix++] = b;
          }
        }
      }

      for (let layer = 0; layer < P.tipLayers; layer++) {
        const layerFrac = P.tipLayers > 1 ? layer / (P.tipLayers - 1) : 0;
        const quadBase = vBase + segments * 3 + layer * 4;
        const c = cBase + segments + layer;
        const [cu, cv] = cellUV(c);

        data[c * 4] = tip.x;
        data[c * 4 + 1] = tip.y;
        data[c * 4 + 2] = tip.z;
        data[(half + c) * 4] = tip.x;
        data[(half + c) * 4 + 1] = tip.y;
        data[(half + c) * 4 + 2] = tip.z;

        for (let k = 0; k < 4; k++) {
          aPosition[v * 3] = tip.x;
          aPosition[v * 3 + 1] = tip.y;
          aPosition[v * 3 + 2] = tip.z;
          aDir[v * 3] = dir.x;
          aDir[v * 3 + 1] = dir.y;
          aDir[v * 3 + 2] = dir.z;
          aSide[v] = 0;
          aRandom[v * 2] = r1;
          aRandom[v * 2 + 1] = r2;
          aUV[v * 3] = corners[k * 2];
          aUV[v * 3 + 1] = corners[k * 2 + 1];
          aUV[v * 3 + 2] = layerFrac;
          aLong[v] = isLong ? 1 : 0;
          aTip[v] = 1;
          aSimCell[v * 2] = cu;
          aSimCell[v * 2 + 1] = cv;
          v++;
        }
        indices[ix++] = quadBase + 0;
        indices[ix++] = quadBase + 2;
        indices[ix++] = quadBase + 1;
        indices[ix++] = quadBase + 2;
        indices[ix++] = quadBase + 3;
        indices[ix++] = quadBase + 1;
      }

      cell += segments + P.tipLayers;
    };

    for (let i = 0; i < shortCount; i++) buildStrand(P.shortSegments, false);
    for (let i = 0; i < longCount; i++) buildStrand(P.longSegments, true);

    const dataTex = new THREE.DataTexture(data, n, texH, THREE.RGBAFormat, THREE.FloatType);
    dataTex.minFilter = THREE.NearestFilter;
    dataTex.magFilter = THREE.NearestFilter;
    dataTex.needsUpdate = true;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(aPosition, 3));
    geometry.setAttribute("aDir", new THREE.BufferAttribute(aDir, 3));
    geometry.setAttribute("aSide", new THREE.BufferAttribute(aSide, 1, false));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(aRandom, 2));
    geometry.setAttribute("aUV", new THREE.BufferAttribute(aUV, 3));
    geometry.setAttribute("aTip", new THREE.BufferAttribute(aTip, 1, false));
    geometry.setAttribute("aLong", new THREE.BufferAttribute(aLong, 1, false));
    geometry.setAttribute("aSimCell", new THREE.BufferAttribute(aSimCell, 2));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    // --- ping-pong sim ---
    const rtOpts = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    };
    let rtA = new THREE.WebGLRenderTarget(n, texH, rtOpts);
    let rtB = new THREE.WebGLRenderTarget(n, texH, rtOpts);

    const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadGeo = new THREE.PlaneGeometry(2, 2);
    const passVertex = `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `;

    // Seed both buffers with the rest positions.
    const seedMat = new THREE.ShaderMaterial({
      uniforms: {
        tData: { value: dataTex },
        uAtlasPos: { value: REGION_TOP.clone() },
        uAtlasVel: { value: REGION_BOTTOM.clone() },
        uDataTarget: { value: REGION_TOP.clone() },
      },
      vertexShader: passVertex,
      fragmentShader: seedFragment,
    });
    const seedScene = new THREE.Scene();
    seedScene.add(new THREE.Mesh(quadGeo, seedMat));
    renderer.setRenderTarget(rtA);
    renderer.render(seedScene, quadCamera);
    renderer.setRenderTarget(rtB);
    renderer.render(seedScene, quadCamera);
    renderer.setRenderTarget(null);
    seedScene.clear();
    seedMat.dispose();

    const simMat = new THREE.ShaderMaterial({
      uniforms: {
        tPrev: { value: rtA.texture },
        tData: { value: dataTex },
        uMouse: { value: new THREE.Vector2(OFF, OFF) },
        uDelta: { value: 0 },
        uRadius: { value: P.simRadius },
        uStrength: { value: P.simStrength },
        uSpring: { value: P.simSpring },
        uDamping: { value: P.simDamping },
        uMaxVelocity: { value: P.simMaxVelocity },
        uHighlightRadius: { value: P.highlightRadius },
        uHighlightSpeed: { value: P.highlightSpeed },
        uAtlasPos: { value: REGION_TOP.clone() },
        uAtlasVel: { value: REGION_BOTTOM.clone() },
        uDataTarget: { value: REGION_TOP.clone() },
        uDataHighlightRef: { value: REGION_BOTTOM.clone() },
      },
      vertexShader: passVertex,
      fragmentShader: simFragment,
    });
    const simScene = new THREE.Scene();
    simScene.add(new THREE.Mesh(quadGeo, simMat));

    const drawMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntroProgress: { value: 0 },
        uNoiseStrength: { value: P.noiseStrength },
        uNoiseScale: { value: P.noiseScale },
        uTubeRadius: { value: P.tubeRadius },
        uTipRadius: { value: P.tipRadius },
        uTipTexture: { value: textureRef.current },
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
        uAtlasPos: { value: REGION_TOP.clone() },
        uAtlasVel: { value: REGION_BOTTOM.clone() },
      },
      vertexShader: drawVertex,
      fragmentShader: drawFragment,
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
    drawMatRef.current = drawMat;

    const mesh = new THREE.Mesh(geometry, drawMat);
    scene.add(mesh);
    mesh.updateWorldMatrix(true, false);
    const meshInverse = mesh.matrixWorld.clone().invert();

    // --- pointer -> the mesh's own plane ---
    const pointer = new THREE.Vector2(OFF, OFF);
    const ndc = new THREE.Vector3();
    const camPos = new THREE.Vector3();
    const rayDir = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    const hit = new THREE.Vector3();
    const onMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      pointer.set(e.clientX - r.left, e.clientY - r.top);
    };
    const onLeave = () => pointer.set(OFF, OFF);
    mount.addEventListener("mousemove", onMove);
    mount.addEventListener("mouseleave", onLeave);

    // Intro sweep: critically damped, ~3s to settle, matching the original's
    // duration-3000 / bounce-0 spring on `introProgress`.
    let intro = 0;
    let introVel = 0;
    let introTarget = 0;
    const INTRO_OMEGA = 1.95;

    let last = 0;
    let elapsed = 0;
    let visible = document.visibilityState === "visible";
    let onScreen = false;

    const frame = (nowMs: number) => {
      const now = nowMs * 0.001;
      const dt = Math.min(now - last, 0.1);
      last = now;
      elapsed += dt;

      introVel += (introTarget - intro) * INTRO_OMEGA * INTRO_OMEGA * dt;
      introVel -= 2 * INTRO_OMEGA * introVel * dt;
      intro += introVel * dt;

      camera.updateWorldMatrix(true, false);
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (pointer.x <= OFF) {
        (simMat.uniforms.uMouse.value as THREE.Vector2).set(OFF, OFF);
      } else {
        ndc
          .set((pointer.x / w) * 2 - 1, -((pointer.y / h) * 2 - 1), 0.5)
          .applyMatrix4(camera.projectionMatrixInverse)
          .applyMatrix4(camera.matrixWorld);
        camPos.setFromMatrixPosition(camera.matrixWorld);
        rayDir.copy(ndc).sub(camPos).normalize();
        camera.getWorldDirection(camDir);
        const t = -camDir.dot(camPos) / camDir.dot(rayDir);
        hit.copy(camPos).addScaledVector(rayDir, t).applyMatrix4(meshInverse);
        (simMat.uniforms.uMouse.value as THREE.Vector2).set(hit.x, hit.y);
      }

      simMat.uniforms.tPrev.value = rtA.texture;
      simMat.uniforms.uDelta.value = dt;
      renderer.setRenderTarget(rtB);
      renderer.render(simScene, quadCamera);
      renderer.setRenderTarget(null);

      const swap = rtA;
      rtA = rtB;
      rtB = swap;

      drawMat.uniforms.tSim.value = rtA.texture;
      drawMat.uniforms.uTime.value = elapsed;
      drawMat.uniforms.uIntroProgress.value = intro;
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

    // Runs the loop whenever any part is on screen…
    const runObserver = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    runObserver.observe(mount);

    // …but the reveal itself only fires past half-visible, and replays,
    // because the original sets animateOnce: false.
    const introObserver = new IntersectionObserver(
      ([e]) => {
        introTarget = e.isIntersecting ? P.introTarget : 0;
      },
      { threshold: 0.5 },
    );
    introObserver.observe(mount);

    return () => {
      renderer.setAnimationLoop(null);
      mount.removeEventListener("mousemove", onMove);
      mount.removeEventListener("mouseleave", onLeave);
      resizeObserver.disconnect();
      runObserver.disconnect();
      introObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      drawMatRef.current = null;
      scene.clear();
      simScene.clear();
      geometry.dispose();
      drawMat.dispose();
      simMat.dispose();
      quadGeo.dispose();
      dataTex.dispose();
      rtA.dispose();
      rtB.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      setTimeout(() => renderer.forceContextLoss(), 1);
    };
  }, [geo, enabled]);

  useEffect(() => {
    let tex: THREE.Texture | null = null;
    new THREE.TextureLoader().load(tipTexture, (loaded) => {
      loaded.wrapS = THREE.ClampToEdgeWrapping;
      loaded.wrapT = THREE.ClampToEdgeWrapping;
      loaded.minFilter = THREE.LinearFilter;
      loaded.magFilter = THREE.LinearFilter;
      tex = loaded;
      textureRef.current = loaded;
      if (drawMatRef.current) drawMatRef.current.uniforms.uTipTexture.value = loaded;
    });
    return () => {
      tex?.dispose();
      textureRef.current = null;
    };
  }, [tipTexture]);

  if (failed || !enabled) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fallbackImage}
        alt={fallbackAlt}
        aria-hidden={!fallbackAlt}
        className={`${className ?? ""} object-cover`}
      />
    );
  }
  return <div ref={mountRef} className={className} aria-hidden />;
}
