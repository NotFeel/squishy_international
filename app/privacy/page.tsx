import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    `How ${site.name} handles website analytics, WhatsApp inquiry and contact information.`,
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><span aria-current="page">Privacy Policy</span>
          </nav>
          <p className="eyebrow">Your information</p>
          <h1>Privacy Policy</h1>
          <p className="page-hero__description">Last updated: September 25, 2026</p>
        </div>
      </section>
      <section className="section">
        <div className="container legal-layout">
          <nav className="legal-nav" aria-label="Privacy policy sections">
            <a href="#scope">Scope</a><a href="#information">Information</a><a href="#use">How we use it</a>
            <a href="#whatsapp">WhatsApp</a><a href="#analytics">Analytics</a><a href="#contact">Contact</a>
          </nav>
          <div className="legal-content">
            <section id="scope">
              <h2>1. Scope</h2>
              <p>This policy describes how {site.name} handles information collected through this English-language product showcase website. It does not control the privacy practices of third-party platforms such as WhatsApp, Google or shipping providers.</p>
            </section>
            <section id="information">
              <h2>2. Information we receive</h2>
              <p>This Phase 1 website does not provide account registration, a cart, payment processing or a server-side contact form. We may receive information when you:</p>
              <ul>
                <li>Contact us through WhatsApp, email or another channel you choose;</li>
                <li>Provide a product, quantity, company, destination or project requirement in an inquiry;</li>
                <li>Interact with website pages and consent to applicable analytics tools.</li>
              </ul>
            </section>
            <section id="use">
              <h2>3. How information is used</h2>
              <p>Information may be used to respond to inquiries, prepare quotations, discuss samples or products, coordinate a potential order, improve website content and maintain business records. We do not sell personal information.</p>
            </section>
            <section id="whatsapp">
              <h2>4. WhatsApp and external links</h2>
              <p>WhatsApp buttons open the third-party WhatsApp service with a prefilled message. Your use of WhatsApp is governed by WhatsApp&apos;s own terms and privacy practices. Please do not send sensitive personal or financial information through an inquiry message.</p>
            </section>
            <section id="analytics">
              <h2>5. Cookies and analytics</h2>
              <p>Where configured and permitted by law, the site may use Google Analytics 4 to understand aggregate traffic and WhatsApp CTA interactions. Analytics may process usage data such as page path, device category, referral source and event context. Browser and consent controls may be used to limit or disable analytics.</p>
            </section>
            <section id="contact">
              <h2>6. Contact and updates</h2>
              <p>Questions about this policy can be sent to <a href={`mailto:${site.email}`}>{site.email}</a>. We may update this policy as the website or applicable requirements change. The latest revision date will be shown at the top of this page.</p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
