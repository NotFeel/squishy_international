import type { MetadataRoute } from "next";
import { getAllMaterials } from "@/lib/materials";
import { getAllProducts } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts();
  const lastModified = new Date("2026-09-25");
  const staticRoutes = [
    "",
    "products/",
    "wholesale/",
    "oem/",
    "about/",
    "faq/",
    "contact/",
    "privacy/",
    "terms/",
  ].map((route) => ({
    url: absoluteUrl(`/${route}`),
    lastModified,
    changeFrequency: route === "" || route === "products/" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : route === "products/" ? 0.9 : 0.7,
  }));

  const materialRoutes = getAllMaterials().map((material) => ({
    url: absoluteUrl(`/products/material/${material.id}/`),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const productRoutes = products.map((product) => ({
    url: absoluteUrl(`/products/${product.slug}/`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...materialRoutes, ...productRoutes];
}

export const dynamic = "force-static";
