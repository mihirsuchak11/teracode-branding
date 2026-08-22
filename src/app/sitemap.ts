import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";
import { features } from "@/content/features";
import { integrations } from "@/content/integrations";
import { jobs } from "@/content/careers";
import { posts } from "@/content/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/about-us",
    "/careers",
    "/changelog",
    "/contact-us",
    "/integrations",
    "/pricing",
    "/privacy-policy",
    "/terms-of-service",
    "/blog",
  ];

  const dynamicRoutes = [
    ...features.map((f) => `/products/${f.slug}`),
    ...integrations.map((i) => `/integrations/${i.slug}`),
    ...jobs.map((j) => `/careers/${j.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
