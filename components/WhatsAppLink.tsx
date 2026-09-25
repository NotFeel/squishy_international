"use client";

import type { ComponentProps } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { getWhatsAppUrl, type InquiryContext } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface WhatsAppLinkProps extends Omit<ComponentProps<"a">, "href"> {
  product?: Product;
  context?: InquiryContext;
  children: React.ReactNode;
  icon?: IconName | null;
}

export function WhatsAppLink({
  product,
  context = "general",
  children,
  icon = "whatsapp",
  className = "",
  onClick,
  ...props
}: WhatsAppLinkProps) {
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
      href={getWhatsAppUrl(product, context)}
      target="_blank"
      rel="noopener noreferrer"
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
