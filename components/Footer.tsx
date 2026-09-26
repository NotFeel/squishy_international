import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getAllMaterials } from "@/lib/materials";
import { site } from "@/lib/site";

const companyLinks = [
  { label: "About Us", href: "/about/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" },
];

const businessLinks = [
  { label: "Wholesale", href: "/wholesale/" },
  { label: "OEM / ODM", href: "/oem/" },
  { label: "Privacy Policy", href: "/privacy/" },
  { label: "Terms", href: "/terms/" },
];

export function Footer() {
  const productLinks = [
    { label: "All Materials", href: "/products/" },
    ...getAllMaterials().slice(0, 5).map((material) => ({
      label: material.name,
      href: `/products/material/${material.id}/`,
    })),
  ];
  const footerLinks = {
    Products: productLinks,
    Company: companyLinks,
    Business: businessLinks,
  };

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
