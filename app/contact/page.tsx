import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    `Contact ${site.name} on WhatsApp for product details, wholesale pricing, samples and custom squishy projects.`,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><span aria-current="page">Contact</span>
          </nav>
          <p className="eyebrow">Let&apos;s talk</p>
          <h1>Start with WhatsApp. We&apos;ll take it from there.</h1>
          <p className="page-hero__description">
            The fastest way to receive product, MOQ, sample and customization
            information is to message our team directly.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-primary">
            <p className="eyebrow">Primary channel</p>
            <h2>Tell us what you&apos;re looking for.</h2>
            <p>
              Product name, estimated quantity and destination country help us
              answer with the right wholesale or sample information.
            </p>
            <WhatsAppLink className="button--large" context="contact">
              Talk to Our Team
            </WhatsAppLink>
          </div>
          <div className="contact-details">
            <div className="contact-detail">
              <i><Icon name="whatsapp" size={22} /></i>
              <div>
                <span>WhatsApp</span>
                <strong>+{site.whatsappNumber}</strong>
                <small>Product, wholesale, sample and custom inquiries</small>
              </div>
            </div>
            <div className="contact-detail">
              <i><Icon name="chat" size={22} /></i>
              <div>
                <span>Email</span>
                <strong>{site.email}</strong>
                <small>For documents, artwork or detailed project files</small>
              </div>
            </div>
            <div className="contact-detail">
              <i><Icon name="globe" size={22} /></i>
              <div>
                <span>Location</span>
                <strong>{site.location}</strong>
                <small>Remote coordination for international buyers</small>
              </div>
            </div>
            <div className="contact-note">
              This Phase 1 site intentionally has no contact form backend.
              WhatsApp keeps your inquiry direct, contextual and ready for sales
              follow-up.
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="section-heading-row">
            <div className="section-heading">
              <p className="eyebrow">Choose a starting point</p>
              <h2>How can we help?</h2>
            </div>
          </div>
          <div className="audience-grid">
            <Link className="audience-card" href="/products/">
              <i><Icon name="box" size={21} /></i>
              <h3>Browse products</h3>
              <p>Find a product and send its link directly through the product page.</p>
            </Link>
            <Link className="audience-card" href="/wholesale/">
              <i><Icon name="package" size={21} /></i>
              <h3>Wholesale inquiry</h3>
              <p>Plan a product mix, quantity, packaging and destination.</p>
            </Link>
            <Link className="audience-card" href="/oem/">
              <i><Icon name="palette" size={21} /></i>
              <h3>Custom project</h3>
              <p>Share your character, shape, brand or campaign concept.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
