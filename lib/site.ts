function normalizeBasePath(value: string) {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed || trimmed === "/") return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function normalizeOrigin(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export const SITE_ORIGIN = normalizeOrigin(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
);

export const BASE_PATH = normalizeBasePath(
  process.env.NEXT_PUBLIC_BASE_PATH || "",
);

export const site = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "Squishy Loom",
  tagline: "Soft toys. Big smiles.",
  url: SITE_ORIGIN,
  whatsappPhone: (
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "12025550188"
  ).replace(/\D/g, ""),
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@squishyloom.com",
  location: "Global sourcing, serving worldwide",
} as const;

export function withBasePath(path: string) {
  if (/^(?:https?:)?\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(`${BASE_PATH}${normalized}`, `${SITE_ORIGIN}/`).toString();
}

// Backward-compatible alias for existing asset helpers.
export const absoluteAssetUrl = absoluteUrl;

export const mainNavigation = [
  { label: "Products", href: "/products/" },
  { label: "Wholesale", href: "/wholesale/" },
  { label: "OEM / ODM", href: "/oem/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
] as const;
