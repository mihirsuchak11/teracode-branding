"use client";

import { useMemo } from "react";
import { HeroStrands } from "./HeroStrands";
import { FEATURE_POINTS } from "./featurePoints";

/**
 * The feature pages reuse the home hero's HeroThreeJSV2 renderer verbatim —
 * same every prop except `scale` (0.95) and the point cloud.
 */
export function FeatureStrands({ slug }: { slug: string }) {
  const config = useMemo(
    () => ({ points: FEATURE_POINTS[slug] ?? FEATURE_POINTS.cortex, scale: 0.95 }),
    [slug],
  );
  return <HeroStrands className="h-full w-full" config={config} />;
}
