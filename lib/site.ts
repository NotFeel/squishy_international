export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");

export function withBasePath(path: string) {
  if (/^(?:https?:)?\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export function absoluteAssetUrl(path: string) {
  return new URL(withBasePath(path), `${site.url}/`).toString();
}

export const site = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "Squishy Loom",
  tagline: "Soft toys. Big smiles.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.squishyloom.com").replace(/\/+$/, ""),
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "12025550188",
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@squishyloom.com",
  location: "Global sourcing, serving worldwide",
} as const;

export const mainNavigation = [
  { label: "Products", href: "/products/" },
  { label: "Wholesale", href: "/wholesale/" },
  { label: "OEM / ODM", href: "/oem/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
] as const;
