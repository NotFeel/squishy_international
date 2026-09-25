import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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
    url: `${site.url}/${route}`,
    lastModified,
    changeFrequency: route === "" || route === "products/" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : route === "products/" ? 0.9 : 0.7,
  }));

  const productRoutes = products.map((product) => ({
    url: `${site.url}/products/${product.slug}/`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}

export const dynamic = "force-static";
