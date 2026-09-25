"use client";

import type { ComponentProps } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { buildWhatsAppUrl, type InquiryContext } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface WhatsAppButtonProps extends Omit<ComponentProps<"a">, "href"> {
  product?: Product;
  context?: InquiryContext;
  children: React.ReactNode;
  icon?: IconName | null;
}

export function WhatsAppButton({
  product,
  context = "general",
  children,
  icon = "whatsapp",
  className = "",
  onClick,
  ...props
}: WhatsAppButtonProps) {
  const trackClick = () => {
    const detail = {
      event: "click_whatsapp",
      inquiry_context: context,
      product_id: product?.id || "",
      product_name: product?.name || "",
      page_path: window.location.pathname,
    };

    window.dataLayer?.push(detail);
    window.gtag?.("event", "click_whatsapp", detail);
  };

  return (
    <a
      {...props}
      className={`button button--whatsapp ${className}`.trim()}
      href={buildWhatsAppUrl(product, context)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        product
          ? `Ask about ${product.name} on WhatsApp`
          : typeof children === "string"
            ? children
            : "Chat on WhatsApp"
      }
      onClick={(event) => {
        trackClick();
        onClick?.(event);
      }}
    >
      {icon && <Icon name={icon} size={19} />}
      <span>{children}</span>
    </a>
  );
}

export default WhatsAppButton;
