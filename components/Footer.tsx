import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { site } from "@/lib/site";

const footerLinks = {
  Products: [
    { label: "All Products", href: "/products/" },
    { label: "Animal Squishy", href: "/products/?filter=animal-squishy" },
    { label: "Food & Dessert", href: "/products/?filter=food-dessert" },
    { label: "Custom / OEM", href: "/products/?filter=custom-oem" },
  ],
  Company: [
    { label: "About Us", href: "/about/" },
    { label: "FAQ", href: "/faq/" },
    { label: "Contact", href: "/contact/" },
  ],
  Business: [
    { label: "Wholesale", href: "/wholesale/" },
    { label: "OEM / ODM", href: "/oem/" },
    { label: "Privacy Policy", href: "/privacy/" },
    { label: "Terms", href: "/terms/" },
  ],
};

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <div className="site-footer__brand">
          <Logo light />
          <p>Cute squishy toys for gifting, retail and custom projects.</p>
          <WhatsAppButton className="footer-whatsapp" context="contact">
            Talk to our team
          </WhatsAppButton>
        </div>
        <div className="site-footer__links">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3>{title}</h3>
              {links.map((link) => (
                <Link href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="container site-footer__bottom">
        <div>
          <span>WhatsApp: +{site.whatsappPhone}</span>
          <span>{site.email}</span>
          <span>{site.location}</span>
        </div>
        <div>
          <Icon name="globe" size={17} />
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
