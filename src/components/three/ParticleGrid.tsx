"use client";

/**
 * Faithful port of the original site's `ParticleGridThreeJSV2` Framer code
 * component — the drifting point-cloud wave that sits behind the Statement
 * section's chat mock.
 *
 * A 256×256 grid of THREE.Points, repeated over `layers` sheets, displaced on Y
 * by 3D fbm Perlin noise. Two extra fbm taps give the tangent-plane normal,
 * which is dotted against a light direction for per-point alpha. Point size
 * grows with distance from the focal plane (a cheap bokeh), and energy is
 * divided back out so bigger points don't get brighter. Additive One/One
 * blending, no depth test.
 *
 * `waveHeightScale` / `noiseFrequency` ease over 2s and `timeScale` over 1s
 * whenever the props change — that's how the original swells the wave when the
 * chat goes from idle to thinking.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useMotionValue, useSpring } from "framer-motion";
import * as THREE from "three";

export type ParticleGridProps = {
  className?: string;
  dispersionMap?: string;
  fallbackImage?: string;
  /** Y amplitude of the wave. Animated over 2s on change. */
  waveHeightScale?: number;
  /** Coordinate scale of octave 0. Animated over 2s on change. */
  noiseFrequency?: number;
  /** How fast the noise field drifts. Animated over 1s on change. */
  timeScale?: number;
  octaves?: number;
  layers?: number;
  ampWeight?: number;
  noiseLayerSpread?: number;
  noiseOffset?: [number, number, number];
  light?: [number, number, number];
  cameraPosition?: [number, number, number];
  cameraRotation?: [number, number, number];
  pointSize?: number;
  focalDistance?: number;
  focalRange?: number;
  blurStrength?: number;
  intensity?: number;
};

const GRID_SIZE = 5;
const GRID_DIVISIONS = 256;
const DISPERSION_OFFSET = 0.8;
const MOUSE_SCALE = 0.1;

function buildGrid(size: number, divisions: number, layers: number) {
  const perLayer = divisions * divisions;
  const count = perLayer * layers;
  const positions = new Float32Array(count * 3);
  const random = new Float32Array(count * 4);
  const shared = new Float32Array(perLayer * 3);
  const half = size / 2;
  const step = size / (divisions - 1);

  for (let layer = 0; layer < layers; layer++) {
    // -1..1 across the layers; feeds both the per-layer noise slice and the
    // dispersion (colour) lookup, so each sheet gets its own hue band.
    const slice = layers > 1 ? -1 + (2 * layer) / (layers - 1) : 0;
    let i = 0;
    for (let x = 0; x < divisions; x++) {
      for (let z = 0; z < divisions; z++) {
        const idx = layer * perLayer + i;
        const p3 = idx * 3;
        const r4 = idx * 4;
        positions[p3] = -half + x * step;
        positions[p3 + 1] = 0;
        positions[p3 + 2] = -half + z * step;
        if (layer === 0) {
          shared[i * 3] = Math.random();
          shared[i * 3 + 1] = Math.random();
          shared[i * 3 + 2] = Math.random();
        }
        random[r4] = shared[i * 3];
        random[r4 + 1] = shared[i * 3 + 1];
        random[r4 + 2] = shared[i * 3 + 2];
        random[r4 + 3] = slice;
        i++;
      }
    }
  }
  return { positions, random, count };
}

const vertexShader = (octaves: number) => `
precision highp float;

#define OCTAVES ${octaves}

attribute vec4 random;

varying vec4 vRandom;
varying vec3 vNormal;
varying vec3 vColor;
varying float vFactor;
varying float vBlur;

uniform float uTime;
uniform float uGridSize;
uniform float uPointSize;
uniform sampler2D uDispersionMap;
uniform float uDispersionOffset;
uniform float uNoiseFrequency;
uniform float uWaveHeightScale;
uniform float uAmpWeight;
uniform float uNoiseLayerSpread;
uniform vec3 uNoiseOffset;
uniform float uFocalDistance;
uniform float uFocalRange;
uniform float uBlurStrength;
uniform vec2 uMouse;
uniform float uMouseScale;

vec3 rand(in vec3 p) {
  p = fract(p * vec3(443.897, 441.423, 437.195));
  p += dot(p, p.yxz + 19.19);
  return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
}

vec3 quintic(const in vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float perlin(in vec3 xyz) {
  vec3 gridUV = fract(xyz);
  vec3 gridID = floor(xyz);
  vec3 c000 = vec3(0, 0, 0); vec3 c100 = vec3(1, 0, 0);
  vec3 c010 = vec3(0, 1, 0); vec3 c110 = vec3(1, 1, 0);
  vec3 c001 = vec3(0, 0, 1); vec3 c101 = vec3(1, 0, 1);
  vec3 c011 = vec3(0, 1, 1); vec3 c111 = vec3(1, 1, 1);
  float r000 = dot(gridUV - c000, rand(gridID + c000));
  float r100 = dot(gridUV - c100, rand(gridID + c100));
  float r010 = dot(gridUV - c010, rand(gridID + c010));
  float r110 = dot(gridUV - c110, rand(gridID + c110));
  float r001 = dot(gridUV - c001, rand(gridID + c001));
  float r101 = dot(gridUV - c101, rand(gridID + c101));
  float r011 = dot(gridUV - c011, rand(gridID + c011));
  float r111 = dot(gridUV - c111, rand(gridID + c111));
  vec3 f = quintic(gridUV);
  float x0 = mix(r000, r100, f.x); float x1 = mix(r010, r110, f.x);
  float x2 = mix(r001, r101, f.x); float x3 = mix(r011, r111, f.x);
  float y0 = mix(x0, x1, f.y); float y1 = mix(x2, x3, f.y);
  return mix(y0, y1, f.z) * 2.0;
}

float fractalBrownian(const in vec3 xyz, const in float ampWeight, const in float frequency, const in vec3 offset, in float t) {
  float result = 0.0; float amp = 1.0; float freq = 1.0; float maxAmp = 0.0;
  for (int i = 0; i < OCTAVES; i++) {
    result += amp * perlin(xyz * freq * frequency + offset * t);
    maxAmp += amp;
    amp *= ampWeight;
    freq *= 2.0;
  }
  return result / maxAmp;
}

const float NOISE_EPS = 0.015;

void main() {
  vRandom = random;

  vec2 uv = position.xz / uGridSize * 2.0;
  float factor = clamp(1.0 - distance(uv, vec2(0.0)), 0.0, 1.0);
  vFactor = factor * factor;

  vec2 planeXZ = position.xz - vec2(uMouse.x * uMouseScale, 0.0);

  // Static per-layer separation: each sheet samples its own slice of the field.
  float layerSlice = random.w * uNoiseLayerSpread;

  vec3 baseCoord = vec3(planeXZ, layerSlice);
  vec3 coordT = vec3(planeXZ + vec2(NOISE_EPS, 0.0), layerSlice);
  vec3 coordB = vec3(planeXZ + vec2(0.0, NOISE_EPS), layerSlice);

  float h  = fractalBrownian(baseCoord, uAmpWeight, uNoiseFrequency, uNoiseOffset, uTime) * uWaveHeightScale;
  float hT = fractalBrownian(coordT, uAmpWeight, uNoiseFrequency, uNoiseOffset, uTime) * uWaveHeightScale;
  float hB = fractalBrownian(coordB, uAmpWeight, uNoiseFrequency, uNoiseOffset, uTime) * uWaveHeightScale;

  float dhdx = (hT - h) / NOISE_EPS;
  float dhdz = (hB - h) / NOISE_EPS;

  vNormal = normalize(vec3(-dhdx * factor, 1.0, -dhdz * factor));

  vec3 dispPosition = position + vec3(0.0, h * factor, 0.0);

  vec2 dispersionUV = vec2((random.w * 0.7 + 1.0) / 2.0, uDispersionOffset);
  vColor = texture2D(uDispersionMap, dispersionUV).xyz;

  vec4 mvPosition = modelViewMatrix * vec4(dispPosition, 1.0);

  float cameraDist = length(mvPosition.xyz);
  float blur = clamp(abs(cameraDist - uFocalDistance) / uFocalRange, 0.0, 1.0);
  vBlur = blur;

  gl_PointSize = uPointSize * (1.0 + blur * uBlurStrength) * (1.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
precision highp float;

varying vec4 vRandom;
varying vec3 vNormal;
varying vec3 vColor;
varying float vFactor;
varying float vBlur;

uniform float uTime;
uniform float uNumLayers;
uniform float uIntensity;
uniform float uBlurStrength;
uniform vec3 uLightDirection;

void main() {
  vec2 quadUV = gl_PointCoord - 0.5;
  if (length(quadUV) > 0.5) discard;

  vec3 normal = normalize(vNormal);
  float alpha = clamp(dot(normal, normalize(uLightDirection)) * vFactor, 0.0, 1.0);

  // Energy spreads as the point grows out of focus — dim it back down.
  float enlargedSize = 1.0 + vBlur * uBlurStrength;
  alpha *= 1.3 / (enlargedSize * enlargedSize);

  alpha = clamp(alpha / uNumLayers * uIntensity, 0.0, 1.0);
  gl_FragColor = vec4(vColor * alpha, alpha);
}
`;

export function ParticleGrid({
  className,
  dispersionMap = "/art/hero-tip.png",
  fallbackImage = "/art/statement-waves.png",
  waveHeightScale = 0.1,
  noiseFrequency = 2,
  timeScale = 0.05,
  octaves = 2,
  layers = 3,
  ampWeight = 0.5,
  noiseLayerSpread = 0.005,
  noiseOffset = [1.97, 0, 0],
  light = [1, 0.2, 0],
  cameraPosition = [-1, 0.4, 1.3],
  cameraRotation = [-0.1, -0.5, 0.1],
  pointSize = 2,
  focalDistance = 1.6,
  focalRange = 0.54,
  blurStrength = 5,
  intensity = 10,
}: ParticleGridProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [failed, setFailed] = useState(false);

  const octaveCount = Math.min(3, Math.max(1, Math.round(octaves)));
  const layerCount = Math.min(8, Math.max(1, Math.round(layers)));

  // The three props the chat animation swings between states get eased;
  // everything else is read straight off a ref each frame.
  const waveMv = useMotionValue(waveHeightScale);
  const freqMv = useMotionValue(noiseFrequency);
  const timeMv = useMotionValue(timeScale);

  const mouseXMv = useMotionValue(0);
  const mouseYMv = useMotionValue(1);
  const mouseX = useSpring(mouseXMv, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(mouseYMv, { stiffness: 50, damping: 20 });

  const live = useRef({
    wave: waveHeightScale,
    freq: noiseFrequency,
    time: timeScale,
    ampWeight,
    noiseLayerSpread,
    pointSize,
    focalDistance,
    focalRange,
    blurStrength,
    intensity,
  });

  const noiseVec = useMemo(
    () => new THREE.Vector3(noiseOffset[0], noiseOffset[1], noiseOffset[2]),
    [noiseOffset],
  );
  const lightVec = useMemo(() => new THREE.Vector3(light[0], light[1], light[2]), [light]);
  const camPos = useMemo(
    () => new THREE.Vector3(cameraPosition[0], cameraPosition[1], cameraPosition[2]),
    [cameraPosition],
  );
  const camRot = useMemo(
    () => new THREE.Vector3(cameraRotation[0], cameraRotation[1], cameraRotation[2]),
    [cameraRotation],
  );
  const vectors = useRef({ noise: noiseVec, light: lightVec, camPos, camRot });

  // The render loop reads these off refs every frame, so just keep them synced.
  useEffect(() => {
    vectors.current = { noise: noiseVec, light: lightVec, camPos, camRot };
  }, [noiseVec, lightVec, camPos, camRot]);

  useEffect(() => {
    live.current.ampWeight = ampWeight;
    live.current.noiseLayerSpread = noiseLayerSpread;
    live.current.pointSize = pointSize;
    live.current.focalDistance = focalDistance;
    live.current.focalRange = focalRange;
    live.current.blurStrength = blurStrength;
    live.current.intensity = intensity;
  }, [
    ampWeight,
    noiseLayerSpread,
    pointSize,
    focalDistance,
    focalRange,
    blurStrength,
    intensity,
  ]);

  useEffect(() => waveMv.on("change", (v) => (live.current.wave = v)), [waveMv]);
  useEffect(() => freqMv.on("change", (v) => (live.current.freq = v)), [freqMv]);
  useEffect(() => timeMv.on("change", (v) => (live.current.time = v)), [timeMv]);

  useEffect(() => {
    const c = animate(waveMv, waveHeightScale, { duration: 2, ease: "easeOut" });
    return () => c.stop();
  }, [waveHeightScale, waveMv]);
  useEffect(() => {
    const c = animate(freqMv, noiseFrequency, { duration: 2, ease: "easeOut" });
    return () => c.stop();
  }, [noiseFrequency, freqMv]);
  useEffect(() => {
    const c = animate(timeMv, timeScale, { duration: 1, ease: "easeOut" });
    return () => c.stop();
  }, [timeScale, timeMv]);

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
    // The vertex shader samples the dispersion map — no vertex textures, no show.
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
      30,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    const { camPos: cp, camRot: cr } = vectors.current;
    camera.position.set(cp.x, cp.y, cp.z);
    camera.rotation.set(cr.x, cr.y, cr.z);

    const { positions, random } = buildGrid(GRID_SIZE, GRID_DIVISIONS, layerCount);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("random", new THREE.BufferAttribute(random, 4));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uDispersionMap: { value: textureRef.current },
        uTime: { value: 0 },
        uGridSize: { value: GRID_SIZE },
        uPointSize: { value: live.current.pointSize },
        uNumLayers: { value: layerCount },
        uDispersionOffset: { value: DISPERSION_OFFSET },
        uNoiseFrequency: { value: live.current.freq },
        uWaveHeightScale: { value: live.current.wave },
        uAmpWeight: { value: live.current.ampWeight },
        uNoiseLayerSpread: { value: live.current.noiseLayerSpread },
        uIntensity: { value: live.current.intensity },
        uFocalDistance: { value: live.current.focalDistance },
        uFocalRange: { value: live.current.focalRange },
        uBlurStrength: { value: live.current.blurStrength },
        uMouse: { value: new THREE.Vector2(0, 1) },
        uMouseScale: { value: MOUSE_SCALE },
        uLightDirection: { value: vectors.current.light.clone() },
        uNoiseOffset: { value: vectors.current.noise.clone() },
      },
      vertexShader: vertexShader(octaveCount),
      fragmentShader,
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
    materialRef.current = material;

    scene.add(new THREE.Points(geometry, material));

    let visible = document.visibilityState === "visible";
    let onScreen = false;
    let last = 0;
    let elapsed = 0;

    const frame = (nowMs: number) => {
      const now = nowMs * 0.001;
      const dt = Math.min(now - last, 0.1);
      last = now;
      elapsed += dt * live.current.time;

      const u = material.uniforms;
      u.uTime.value = elapsed;
      u.uWaveHeightScale.value = live.current.wave;
      u.uNoiseFrequency.value = live.current.freq;
      u.uAmpWeight.value = live.current.ampWeight;
      u.uNoiseLayerSpread.value = live.current.noiseLayerSpread;
      (u.uNoiseOffset.value as THREE.Vector3).copy(vectors.current.noise);
      (u.uLightDirection.value as THREE.Vector3).copy(vectors.current.light);
      u.uPointSize.value = live.current.pointSize;
      u.uFocalDistance.value = live.current.focalDistance;
      u.uFocalRange.value = live.current.focalRange;
      u.uBlurStrength.value = live.current.blurStrength;
      u.uIntensity.value = live.current.intensity;
      (u.uMouse.value as THREE.Vector2).set(mouseX.get(), mouseY.get());

      const { camPos: p, camRot: r } = vectors.current;
      camera.position.set(p.x, p.y, p.z);
      camera.rotation.set(r.x, r.y, r.z);

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

    const onMouseMove = (e: MouseEvent) => {
      mouseXMv.set(mouseXMv.get() + e.movementX * 0.001);
      mouseYMv.set(1 - e.offsetY / mount.clientHeight);
    };
    mount.addEventListener("mousemove", onMouseMove);

    return () => {
      renderer.setAnimationLoop(null);
      mount.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene.clear();
      geometry.dispose();
      material.dispose();
      materialRef.current = null;
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      setTimeout(() => renderer.forceContextLoss(), 1);
    };
  }, [octaveCount, layerCount, mouseX, mouseY, mouseXMv, mouseYMv]);

  useEffect(() => {
    if (!dispersionMap) return;
    let tex: THREE.Texture | null = null;
    new THREE.TextureLoader().load(dispersionMap, (loaded) => {
      loaded.wrapS = THREE.ClampToEdgeWrapping;
      loaded.wrapT = THREE.ClampToEdgeWrapping;
      loaded.minFilter = THREE.LinearFilter;
      loaded.magFilter = THREE.LinearFilter;
      tex = loaded;
      textureRef.current = loaded;
      if (materialRef.current) materialRef.current.uniforms.uDispersionMap.value = loaded;
    });
    return () => {
      tex?.dispose();
      textureRef.current = null;
    };
  }, [dispersionMap]);

  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={fallbackImage} alt="" aria-hidden className={`${className} object-cover`} />
    );
  }
  return <div ref={mountRef} className={className} aria-hidden />;
}
