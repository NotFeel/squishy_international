"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { mainNavigation } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {mainNavigation.map((item) => (
            <Link
              className={isActive(item.href) ? "is-active" : ""}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="site-header__actions">
          <Link className="header-faq" href="/faq/">
            FAQ
          </Link>
          <WhatsAppButton className="button--compact desktop-whatsapp" context="contact">
            Chat on WhatsApp
          </WhatsAppButton>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={24} />
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="container mobile-menu__nav" aria-label="Mobile navigation">
          {mainNavigation.map((item, index) => (
            <Link href={item.href} key={item.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
              <Icon name="arrow" size={20} />
            </Link>
          ))}
          <Link href="/faq/">
            <span>06</span>
            FAQ
            <Icon name="arrow" size={20} />
          </Link>
          <WhatsAppButton className="mobile-menu__cta" context="contact">
            Chat on WhatsApp
          </WhatsAppButton>
          <p>Soft, slow-rising squishy toys for retail, gifting and custom projects.</p>
        </nav>
      </div>
    </header>
  );
}
