import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} - Squishy Toys`,
    short_name: site.name,
    description:
      "Soft, slow-rising squishy toys for gifting, retail and custom projects.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#FF7A70",
    icons: [
      {
        src: "/brand/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

export const dynamic = "force-static";
