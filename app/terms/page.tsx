import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    `Terms of use for the ${site.name} product showcase and WhatsApp inquiry website.`,
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><span aria-current="page">Terms of Use</span>
          </nav>
          <p className="eyebrow">Website terms</p>
          <h1>Terms of Use</h1>
          <p className="page-hero__description">Last updated: September 25, 2026</p>
        </div>
      </section>
      <section className="section">
        <div className="container legal-layout">
          <nav className="legal-nav" aria-label="Terms sections">
            <a href="#website">Website use</a><a href="#products">Product information</a><a href="#inquiries">Inquiries</a>
            <a href="#intellectual">Intellectual property</a><a href="#liability">Liability</a><a href="#contact">Contact</a>
          </nav>
          <div className="legal-content">
            <section id="website">
              <h2>1. Website use</h2>
              <p>This website is provided as a product showcase and inquiry channel. By using it, you agree to use the site lawfully and not interfere with its security, availability or operation.</p>
            </section>
            <section id="products">
              <h2>2. Product information and availability</h2>
              <p>Product images, dimensions, materials, MOQs, packaging descriptions and customization options are provided for general information. They may change and do not constitute a binding offer. Final specifications, availability, pricing, lead time and order terms are confirmed in a written quotation or order confirmation.</p>
              <p>Colors and product appearance may vary due to display settings, material characteristics, sampling and production tolerances.</p>
            </section>
            <section id="inquiries">
              <h2>3. Inquiries and quotations</h2>
              <p>Submitting an inquiry does not create an order or contract. Any quotation may be subject to quantity, payment terms, sample approval, production capacity, shipping conditions and other stated requirements. You are responsible for ensuring that product, labeling and promotional materials meet the rules of your destination market.</p>
            </section>
            <section id="intellectual">
              <h2>4. Intellectual property</h2>
              <p>The website layout, original graphics and website copy are protected by applicable intellectual property laws. Product names, brands and third-party references remain the property of their respective owners. You must have the necessary rights to any logo, character, artwork or other material you submit for a custom project.</p>
            </section>
            <section id="liability">
              <h2>5. Limitation of liability</h2>
              <p>We aim to keep website information useful and accurate, but the site is provided on an &quot;as available&quot; basis. To the extent permitted by law, {site.name} is not liable for indirect or consequential loss arising solely from reliance on general website information. Binding obligations apply only when confirmed in the relevant quotation or agreement.</p>
            </section>
            <section id="contact">
              <h2>6. Contact</h2>
              <p>Questions about these terms can be sent to <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
