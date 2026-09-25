import { site } from "@/lib/site";
import type { Product } from "@/lib/types";

export type InquiryContext =
  | "general"
  | "product"
  | "wholesale"
  | "oem"
  | "sample"
  | "contact";

function buildMessage(product?: Product, context: InquiryContext = "general") {
  if (product) {
    const productUrl = `${site.url}/products/${product.slug}/`;
    return `Hi ${site.name},

I'm interested in this product.

Product: ${product.name}
Product ID: ${product.id}
Product URL: ${productUrl}

Could you please send me:
1. Wholesale price
2. MOQ
3. Sample information
4. Customization options
5. Shipping information

Thank you.`;
  }

  const messages: Record<InquiryContext, string> = {
    general:
      `Hi ${site.name}, I'd like to learn more about your squishy toy collection.`,
    product:
      `Hi ${site.name}, I'm interested in your squishy products and would like more information.`,
    wholesale:
      `Hi ${site.name}, I'm interested in wholesale squishy toys. Please send me product, MOQ, packaging and shipping information.`,
    oem: `Hi ${site.name}, I'd like to discuss a custom squishy project. Here is a little about my idea:`,
    sample:
      `Hi ${site.name}, I'd like to ask about sample availability and sample details for your squishy products.`,
    contact:
      `Hi ${site.name}, I'd like to talk with your team about a squishy product inquiry.`,
  };

  return messages[context];
}

export function getWhatsAppUrl(
  product?: Product,
  context: InquiryContext = "general",
) {
  const phone = site.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(
    buildMessage(product, context),
  )}`;
}
