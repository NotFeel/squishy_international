import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { site, withBasePath } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    `Learn how ${site.name} approaches soft toy design, wholesale supply and custom squishy development for international buyers.`,
  alternates: { canonical: "/about/" },
};

const values: { icon: IconName; title: string; copy: string }[] = [
  {
    icon: "heart",
    title: "Designed to be picked up",
    copy: "We prioritize visual charm, tactile satisfaction and an approachable price point.",
  },
  {
    icon: "chat",
    title: "Clear before clever",
    copy: "Product details, MOQ and next steps should be easy to understand from the start.",
  },
  {
    icon: "shield",
    title: "Built on confirmed details",
    copy: "Samples, specifications and packaging are agreed before production moves ahead.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span>/</span><span aria-current="page">About</span>
            </nav>
            <p className="eyebrow">About {site.name}</p>
            <h1>Soft toys with thoughtful business behind them</h1>
            <p className="page-hero__description">
              We connect playful product design with practical wholesale and
              custom development for international buyers.
            </p>
          </div>
          <aside className="page-hero__aside">
            <strong>Working on something?</strong>
            <p>Tell us about your market, product idea or wholesale requirement.</p>
            <WhatsAppLink context="contact">Talk to Our Team</WhatsAppLink>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container about-intro">
          <Image
            src={withBasePath("/brand/lifestyle.svg")}
            alt="A thoughtful display of soft squishy toy products"
            width={1200}
            height={760}
            sizes="(max-width: 980px) 100vw, 48vw"
          />
          <div className="about-copy">
            <SectionHeading
              eyebrow="Who we are"
              title="A product-led approach to squeezable fun"
              description={`${site.name} is built around a simple idea: make products that consumers immediately want to touch, while keeping the buying process clear and practical for retailers and brands.`}
            />
            <p>
              Our assortment focuses on approachable animal, food and character
              themes. For wholesale buyers, we help shape a relevant mix. For
              brands, we support custom development from an initial reference
              through sampling and production planning.
            </p>
            <div className="about-metrics">
              <div className="about-metric"><strong>5</strong><span>Core catalog collections</span></div>
              <div className="about-metric"><strong>2</strong><span>Primary buying routes: wholesale & custom</span></div>
              <div className="about-metric"><strong>Sample-led</strong><span>Product confirmation approach</span></div>
              <div className="about-metric"><strong>Worldwide</strong><span>International inquiry support</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <SectionHeading
            eyebrow="What guides us"
            title="Playful products need a professional process"
            description="The visual experience can be light and cheerful. The order experience needs clarity, alignment and reliable checkpoints."
          />
          <div className="value-grid">
            {values.map((value) => (
              <article className="value-card" key={value.title}>
                <i><Icon name={value.icon} size={22} /></i>
                <h3>{value.title}</h3>
                <p>{value.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container trust-grid">
          <div>
            <SectionHeading
              eyebrow="Capability"
              title="From catalog selection to custom development"
              description="We keep product content, specification and order requirements connected so buyers can make decisions with fewer unknowns."
            />
            <div className="customization-options">
              <span><Icon name="check" size={17} />Catalog product sourcing</span>
              <span><Icon name="check" size={17} />Mixed category assortments</span>
              <span><Icon name="check" size={17} />Custom shape & character</span>
              <span><Icon name="check" size={17} />Logo & packaging options</span>
              <span><Icon name="check" size={17} />Sample coordination</span>
              <span><Icon name="check" size={17} />International shipping support</span>
            </div>
          </div>
          <div className="trust-visual">
            <Image
              src={withBasePath("/brand/about.svg")}
              alt="Organized shelves representing product and packaging coordination"
              width={1000}
              height={720}
              sizes="(max-width: 980px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container faq-preview">
          <SectionHeading
            eyebrow="Markets we serve"
            title="Built for international buying conversations"
            description="Our product and inquiry structure is designed for retailers, distributors, online sellers, promotional buyers and brand teams."
          />
          <div className="trust-list">
            <article className="trust-card"><i><Icon name="globe" size={21} /></i><strong>Retail & e-commerce</strong><p>Toy stores, gift shops, marketplaces and social commerce sellers.</p></article>
            <article className="trust-card"><i><Icon name="box" size={21} /></i><strong>Wholesale & distribution</strong><p>Assortment planning for importers, distributors and multi-store buyers.</p></article>
            <article className="trust-card"><i><Icon name="palette" size={21} /></i><strong>Brands & promotions</strong><p>Custom character, merchandise and campaign product opportunities.</p></article>
            <article className="trust-card"><i><Icon name="heart" size={21} /></i><strong>Gift & lifestyle</strong><p>Cheerful designs for gifting, collections and seasonal retail moments.</p></article>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <div className="final-cta__panel">
            <div>
              <p className="eyebrow">Start a conversation</p>
              <h2>Tell us what you are trying to build.</h2>
              <p>
                We can help you choose catalog products or explore a custom
                direction. Share your market, quantity and target timing.
              </p>
            </div>
            <div className="final-cta__actions">
              <WhatsAppLink className="button--large" context="contact">Talk to Our Team</WhatsAppLink>
              <Link className="button button--secondary button--large" href="/products/">Explore products</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
