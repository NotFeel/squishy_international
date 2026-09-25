import { absoluteUrl, site } from "@/lib/site";
import type { Product } from "@/types/product";

export type InquiryContext =
  | "general"
  | "product"
  | "wholesale"
  | "oem"
  | "sample"
  | "contact";

export function buildWhatsAppMessage(
  product?: Product,
  context: InquiryContext = "general",
): string {
  if (product) {
    const productUrl = absoluteUrl(`/products/${product.slug}/`);

    return [
      `Hi ${site.name}, I'm interested in this product.`,
      "",
      `Product: ${product.name}`,
      `Product ID: ${product.id}`,
      `Product URL: ${productUrl}`,
      "",
      "Could you please provide:",
      "1. Wholesale price",
      "2. MOQ",
      "3. Sample information",
      "4. Customization options",
      "5. Shipping information",
      "",
      "Thank you.",
    ].join("\n");
  }

  const messages: Record<InquiryContext, string> = {
    general: [
      `Hi ${site.name}, I'm interested in your squishy products.`,
      "",
      "Please send me your product catalog and wholesale information.",
      "",
      "Thank you.",
    ].join("\n"),
    product: [
      `Hi ${site.name}, I'm interested in your squishy products.`,
      "",
      "Please send me the catalog and current wholesale information.",
      "",
      "Thank you.",
    ].join("\n"),
    wholesale: [
      `Hi ${site.name}, I'm interested in wholesale squishy toys.`,
      "",
      "Please send me product, MOQ, packaging and shipping information.",
      "",
      "Thank you.",
    ].join("\n"),
    oem: [
      `Hi ${site.name}, I'd like to discuss a custom squishy project.`,
      "",
      "Here is a little about my idea:",
    ].join("\n"),
    sample: [
      `Hi ${site.name}, I'd like to ask about sample availability.`,
      "",
      "Please send me sample details and the next steps.",
      "",
      "Thank you.",
    ].join("\n"),
    contact: [
      `Hi ${site.name}, I'd like to talk with your team.`,
      "",
      "I have a squishy product inquiry.",
      "",
      "Thank you.",
    ].join("\n"),
  };

  return messages[context];
}

export function buildWhatsAppUrl(
  product?: Product,
  context: InquiryContext = "general",
): string {
  const message = encodeURIComponent(buildWhatsAppMessage(product, context));
  return `https://wa.me/${site.whatsappPhone}?text=${message}`;
}

// Backward-compatible alias for existing callers.
export const getWhatsAppUrl = buildWhatsAppUrl;
