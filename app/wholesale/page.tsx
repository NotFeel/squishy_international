import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Icon, type IconName } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Wholesale Squishy Toys",
  description:
    "Wholesale squishy toys for retailers, gift shops, online sellers and distributors. Flexible assortment, packaging and shipping support.",
  alternates: { canonical: "/wholesale/" },
};

const audiences: { icon: IconName; title: string; copy: string }[] = [
  { icon: "package", title: "Toy Stores", copy: "Impulse-friendly products for physical retail displays." },
  { icon: "heart", title: "Gift Shops", copy: "Cute, giftable themes that suit seasonal assortments." },
  { icon: "globe", title: "Online Sellers", copy: "Flexible product selections for marketplace and social commerce." },
  { icon: "box", title: "Distributors", copy: "Material-based sourcing for repeat wholesale programs." },
  { icon: "spark", title: "Retail Brands", copy: "Collection planning with packaging and branding options." },
  { icon: "palette", title: "Promotional Companies", copy: "Logo and event-ready concepts for qualified custom projects." },
];

const benefits = [
  {
    title: "Build the right mix",
    copy: "Choose across PU Foam, TPR, mixed-material and future material collections to suit your audience and price point.",
  },
  {
    title: "Start with clear MOQs",
    copy: "Most catalog products begin from 100-200 pcs. Exact MOQ is confirmed by product and packaging.",
  },
  {
    title: "Choose your packaging",
    copy: "Standard OPP bags, display boxes and qualified custom packaging can be discussed with your quote.",
  },
  {
    title: "Control the brand experience",
    copy: "Logo, label, color and packaging customization can be scoped for suitable volumes.",
  },
  {
    title: "Sample before scaling",
    copy: "Review physical product details and presentation before moving to mass production.",
  },
  {
    title: "Align delivery early",
    copy: "Share your destination and target timing so shipping options can be discussed from the start.",
  },
];

const faqs = [
  {
    question: "What is the minimum order for wholesale?",
    answer:
      "Most catalog products start at 100-200 pcs. Mixed-material orders may have different minimums. Share your preferred products and quantities for an exact answer.",
  },
  {
    question: "Can I order a mixed assortment?",
    answer:
      "Yes, mixed product assortments can be reviewed. The practical mix depends on product availability, MOQ per design and packaging requirements.",
  },
  {
    question: "Can packaging include my brand?",
    answer:
      "Custom packaging and labels are available for qualifying orders. Send your quantity and packaging concept for feasibility and pricing.",
  },
  {
    question: "How do I receive a quote?",
    answer:
      "Message us on WhatsApp with product names or links, quantities, destination country and any packaging requirements. We will reply with the next questions or a quotation.",
  },
];

export default function WholesalePage() {
  const products = getAllProducts();
  const wholesaleProducts = products.filter((product) => product.featured || product.newArrival).slice(0, 4);

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span>/</span><span aria-current="page">Wholesale</span>
            </nav>
            <p className="eyebrow">Wholesale program</p>
            <h1>Wholesale Squishy Toys for Retailers</h1>
            <p className="page-hero__description">
              Flexible product selection, bulk orders and custom packaging for
              retailers, online sellers and distributors.
            </p>
          </div>
          <aside className="page-hero__aside">
            <strong>Planning an order?</strong>
            <p>Send your product interests, quantity and destination for a focused reply.</p>
            <WhatsAppButton context="wholesale">Request Wholesale Information</WhatsAppButton>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Who we serve"
            title="A practical wholesale partner for your channel"
            description="From a small first assortment to a repeat retail program, start with a clear product and packaging brief."
          />
          <div className="audience-grid">
            {audiences.map((audience) => (
              <article className="audience-card" key={audience.title}>
                <i><Icon name={audience.icon} size={21} /></i>
                <h3>{audience.title}</h3>
                <p>{audience.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <SectionHeading
            eyebrow="Wholesale benefits"
            title="Simple decisions, fewer surprises"
            description="A good wholesale product is more than a unit price. We keep assortment, packaging, sampling and delivery visible from the beginning."
          />
          <div className="benefit-grid">
            {benefits.map((benefit, index) => (
              <article className="benefit-card" key={benefit.title}>
                <span className="benefit-card__number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading-row">
            <SectionHeading
              eyebrow="Popular materials"
              title="A starting point for your assortment"
              description="Mix familiar characters with seasonal or trend-led designs to keep the collection engaging."
            />
            <Link className="text-link" href="/products/">Browse full catalog <Icon name="arrow" size={18} /></Link>
          </div>
          <div className="related-grid">
            {wholesaleProducts.map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="moq-panel">
            <div className="moq-panel__copy">
              <p className="eyebrow">MOQ & packaging</p>
              <h2>Start with a range that fits your business.</h2>
              <p>
                Use these figures as a planning guide, not a hard quotation.
                Every product and customization request is confirmed against
                current production requirements.
              </p>
              <WhatsAppButton className="button--whatsapp" context="wholesale">
                Confirm your MOQ
              </WhatsAppButton>
            </div>
            <div className="moq-panel__stats">
              <div className="moq-stat"><strong>100+</strong><span>Typical catalog product MOQ</span></div>
              <div className="moq-stat"><strong>500+</strong><span>Typical custom project MOQ</span></div>
              <div className="moq-stat"><strong>1-2</strong><span>Sample rounds often needed</span></div>
              <div className="moq-stat"><strong>Custom</strong><span>Packaging and shipping plan</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container faq-preview">
          <SectionHeading
            eyebrow="Wholesale FAQ"
            title="Before requesting a quote"
            description="These are the details that help us respond faster and more accurately."
          />
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <div className="final-cta__panel">
            <div>
              <p className="eyebrow">Next step</p>
              <h2>Ready to build your wholesale order?</h2>
              <p>
                Send product links or names, estimated quantity, destination and
                packaging preferences. We will take it from there.
              </p>
            </div>
            <div className="final-cta__actions">
              <WhatsAppButton className="button--large" context="wholesale">Request Wholesale Information</WhatsAppButton>
              <Link className="button button--secondary button--large" href="/contact/">Contact our team</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
