export const site = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "Squishy Loom",
  tagline: "Soft toys. Big smiles.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.squishyloom.com",
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
