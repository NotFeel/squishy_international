import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about squishy toy MOQ, samples, OEM and ODM, custom packaging, international shipping and quotations.",
  alternates: { canonical: "/faq/" },
};

const productFaqs = [
  { question: "What is the MOQ?", answer: "MOQ depends on the product and customization requirements. Most catalog products start from 100-200 pcs; custom projects often begin from 500 pcs." },
  { question: "Can I order a mixed assortment?", answer: "Yes, mixed assortments can be reviewed. Availability depends on the MOQ per design and the practical packaging and shipping mix." },
  { question: "Do you support OEM and ODM?", answer: "Yes, subject to product and project requirements. We can discuss custom shape, color, character, logo, packaging and private-label development." },
  { question: "Can I request samples?", answer: "Yes. Contact us on WhatsApp for sample availability and information. Sample cost, timing and shipping depend on the product and destination." },
  { question: "Can you customize packaging?", answer: "Custom packaging is available for qualifying projects. Share your artwork, reference or packaging direction and expected quantity." },
  { question: "Do you ship internationally?", answer: "International shipping options depend on destination and order details. We confirm the practical method after quantity and delivery requirements are clear." },
  { question: "How can I request a quotation?", answer: "Open WhatsApp from the website and send us the product name or product link, expected quantity and destination country." },
  { question: "How long does sampling take?", answer: "Timing varies by product and customization. For catalog samples, ask us for current availability. For custom work, the schedule is confirmed after brief review." },
];

export default function FaqPage() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><span aria-current="page">FAQ</span>
          </nav>
          <p className="eyebrow">Helpful answers</p>
          <h1>Frequently Asked Questions</h1>
          <p className="page-hero__description">
            Clear starting answers for product, wholesale and custom order
            conversations.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container faq-page-layout">
          <SectionHeading
            eyebrow="Before you ask"
            title="What buyers usually want to know"
            description="Every project is different. These answers give you the practical baseline, while WhatsApp lets us confirm the specifics."
          />
          <FaqAccordion items={productFaqs} />
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="final-cta__panel">
            <div>
              <p className="eyebrow">Still deciding?</p>
              <h2>Ask about your exact product or project.</h2>
              <p>
                Product name, quantity and destination are the three details
                that help us give the fastest useful answer.
              </p>
            </div>
            <div className="final-cta__actions">
              <WhatsAppButton className="button--large" context="contact">Talk to Our Team</WhatsAppButton>
              <Link className="button button--secondary button--large" href="/products/">Browse products</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
