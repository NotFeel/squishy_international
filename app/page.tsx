import Image from "next/image";
import Link from "next/link";
import { MaterialCard } from "@/components/MaterialCard";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getAllMaterials } from "@/lib/materials";
import { getAllProducts } from "@/lib/products";
import { withBasePath } from "@/lib/site";

const homeFaqs = [
  {
    question: "What is the MOQ?",
    answer:
      "MOQ depends on the product, packaging and customization requirements. Most catalog items start at 100-200 pcs, while custom projects can start from 500 pcs.",
  },
  {
    question: "Do you support OEM and ODM?",
    answer:
      "Yes. We can support custom shapes, colors, logos, character development and packaging, subject to project review and sampling.",
  },
  {
    question: "Can I request samples?",
    answer:
      "Yes. Message us on WhatsApp with the product name or link, and we will confirm sample availability and timing.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We arrange international shipping based on destination, order volume, timing and your preferred Incoterms.",
  },
];

const trustCards = [
  {
    icon: "package" as const,
    title: "Retail-ready packaging",
    copy: "OPP bags, display boxes and qualified custom packaging options.",
  },
  {
    icon: "palette" as const,
    title: "Sampling-led development",
    copy: "Review shape, color and finish before committing to production.",
  },
  {
    icon: "shield" as const,
    title: "Order-aware QC",
    copy: "Product and packaging checks aligned with each confirmed brief.",
  },
  {
    icon: "globe" as const,
    title: "International support",
    copy: "Flexible shipping coordination for global wholesale buyers.",
  },
];

export default function HomePage() {
  const products = getAllProducts();
  const featuredProducts = products.filter((product) => product.featured);
  const materialColors = ["blush", "butter", "sky", "sage", "peach"];
  const materialCards = getAllMaterials().map((material, index) => ({
    ...material,
    description: `Browse ${material.name} products for retail, gifting and custom projects.`,
    href: `/products/material/${material.id}/`,
    image:
      products.find((product) => product.materialId === material.id)?.images[0] ||
      products[0].images[0],
    color: materialColors[index % materialColors.length],
  }));

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Cute. Soft. Ready for your shelf.</p>
            <h1>
              Cute Squishy Toys <span>Made to Make You Smile</span>
            </h1>
            <p>
              Discover soft, slow-rising squishy toys and stress-relief products
              for retail, gifting and custom projects.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary button--large" href="/products/">
                Explore Products
                <Icon name="arrow" size={19} />
              </Link>
              <WhatsAppButton className="button--large" context="general">
                Chat on WhatsApp
              </WhatsAppButton>
            </div>
            <div className="hero__proof" aria-label="Product benefits">
              <span>
                <Icon name="check" size={17} /> Slow-rising textures
              </span>
              <span>
                <Icon name="check" size={17} /> OEM & ODM available
              </span>
              <span>
                <Icon name="check" size={17} /> International shipping
              </span>
            </div>
          </div>
          <div className="hero__visual">
            <Image
              src={withBasePath("/brand/hero.svg")}
              alt="A cheerful collection of panda, strawberry, mushroom and cloud squishy toys"
              width={1100}
              height={860}
              priority
              sizes="(max-width: 980px) 100vw, 50vw"
            />
            <div className="hero__floating-card">
              <i>
                <Icon name="spark" size={19} />
              </i>
              <div>
                <strong>Let&apos;s make it yours</strong>
                <small>Custom colors, shape & packaging</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((group) => (
            <span key={group}>
              Slow-rising fun <i /> Gift-friendly designs <i /> Wholesale ready{" "}
              <i /> Custom development <i /> Soft-to-the-touch products <i />{" "}
            </span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-heading-row">
            <SectionHeading
              eyebrow="Shop by material"
              title="Find the right feel for your collection"
              description="Browse every product collection by its material and production type."
            />
            <Link className="text-link" href="/products/">
              View all products <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="material-grid material-grid--materials">
            {materialCards.map((material, index) => (
              <MaterialCard
                name={material.name}
                description={material.description}
                href={material.href}
                image={material.image}
                index={index}
                accent={material.color}
                key={material.id}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="section-heading-row">
            <SectionHeading
              eyebrow="Fresh from the studio"
              title="Best & new squishy picks"
              description="Small joys, satisfying textures and characters designed to stand out in a crowd."
            />
            <Link className="text-link" href="/products/?filter=new-arrivals">
              Shop new arrivals <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="product-grid product-grid--home">
            {featuredProducts.map((product, index) => (
              <ProductCard
                product={product}
                priority={index < 2}
                key={product.id}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container why-grid">
          <div className="why-panel">
            <div className="why-panel__main">
              <Image
                src={withBasePath("/products/mushroom-friend/03-lifestyle.svg")}
                alt="Mushroom squishy styled on a shelf"
                width={800}
                height={640}
                sizes="(max-width: 980px) 100vw, 50vw"
              />
            </div>
            <div className="why-panel__note">
              <i>
                <Icon name="heart" size={21} />
              </i>
              <strong>Soft by design</strong>
              <p>
                Rounded forms, gentle textures and satisfying slow recovery for
                everyday moments.
              </p>
            </div>
          </div>
          <div className="why-copy">
            <SectionHeading
              eyebrow="Why squishy"
              title="Tiny moments of calm, made irresistible"
              description="Squishy toys combine familiar characters, tactile play and an approachable price point. They work equally well as a personal treat, a thoughtful gift or an impulse-friendly retail item."
            />
            <div className="why-list">
              <div className="why-item">
                <i>
                  <Icon name="spark" size={21} />
                </i>
                <div>
                  <strong>Satisfying slow rise</strong>
                  <p>
                    Carefully selected foam and TPR formulas create a soft,
                    repeatable squeeze.
                  </p>
                </div>
              </div>
              <div className="why-item">
                <i>
                  <Icon name="leaf" size={21} />
                </i>
                <div>
                  <strong>Designed for broad appeal</strong>
                  <p>
                    Friendly characters and timeless food themes work across
                    ages, channels and regions.
                  </p>
                </div>
              </div>
              <div className="why-item">
                <i>
                  <Icon name="palette" size={21} />
                </i>
                <div>
                  <strong>Easy to make your own</strong>
                  <p>
                    Start from a catalog design or develop something completely
                    new for your brand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <SectionHeading
            eyebrow="Work with us"
            title="From shelf-ready to unmistakably yours"
            description="Whether you are testing a retail assortment or developing a branded character, there is a simple way to start."
          />
          <div className="business-split">
            <article className="business-panel">
              <Image
                src={withBasePath("/brand/wholesale.svg")}
                alt="Packed squishy toy cartons ready for wholesale"
                width={1000}
                height={720}
                sizes="(max-width: 980px) 100vw, 50vw"
              />
              <span className="business-panel__eyebrow">Wholesale</span>
              <h3>Build a collection your customers will pick up</h3>
              <p>
                Flexible product mixes, practical MOQs and packaging options for
                retailers, distributors and online sellers.
              </p>
              <Link className="text-link" href="/wholesale/">
                Explore wholesale <Icon name="arrow" size={18} />
              </Link>
            </article>
            <article className="business-panel">
              <Image
                src={withBasePath("/brand/oem.svg")}
                alt="Custom squishy toy concept becoming a physical sample"
                width={1000}
                height={720}
                sizes="(max-width: 980px) 100vw, 50vw"
              />
              <span className="business-panel__eyebrow">OEM / ODM</span>
              <h3>Turn your idea into a memorable squishy</h3>
              <p>
                Develop a custom shape, character, colorway or packaging concept
                with a sample-led process.
              </p>
              <Link className="text-link" href="/oem/">
                Start a custom project <Icon name="arrow" size={18} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section lifestyle">
        <div className="container lifestyle__grid">
          <div className="lifestyle__copy">
            <p className="eyebrow">Made for real life</p>
            <h2>Small enough to collect. Soft enough to keep close.</h2>
            <p>
              Our product direction combines playful color and character appeal
              with a texture people want to squeeze again and again. It is
              feel-good design, without the clutter.
            </p>
            <div className="lifestyle__stats">
              <div className="lifestyle__stat">
                <strong>5-15 sec</strong>
                <span>Ideal interaction clip</span>
              </div>
              <div className="lifestyle__stat">
                <strong>100+</strong>
                <span>Potential product directions</span>
              </div>
              <div className="lifestyle__stat">
                <strong>Worldwide</strong>
                <span>Shipping coordination</span>
              </div>
            </div>
          </div>
          <div className="lifestyle__visual">
            <Image
              src={withBasePath("/brand/lifestyle.svg")}
              alt="Soft squishy toys displayed on a bright contemporary shelf"
              width={1200}
              height={760}
              sizes="(max-width: 980px) 100vw, 55vw"
            />
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container trust-grid">
          <div className="trust-visual">
            <Image
              src={withBasePath("/brand/about.svg")}
              alt="Organized warehouse shelves for toy products"
              width={1000}
              height={720}
              sizes="(max-width: 980px) 100vw, 45vw"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Built for smooth orders"
              title="Clear communication from first sample to final carton"
              description="We keep the process practical: confirm the product and specification, validate the sample, then align production and shipping details before the order moves."
            />
            <div className="trust-list">
              {trustCards.map((card) => (
                <article className="trust-card" key={card.title}>
                  <i>
                    <Icon name={card.icon} size={21} />
                  </i>
                  <strong>{card.title}</strong>
                  <p>{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container faq-preview">
          <SectionHeading
            eyebrow="Good to know"
            title="Questions before we chat?"
            description="Here are the answers most buyers look for first. For product-specific details, WhatsApp is fastest."
          />
          <div>
            <FaqAccordion items={homeFaqs} />
            <Link className="text-link faq-more-link" href="/faq/">
              See all FAQs <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <div className="final-cta__panel">
            <div>
              <p className="eyebrow">Let&apos;s talk product</p>
              <h2>Found something you like?</h2>
              <p>
                Send us the product name or link. We will reply with wholesale
                details, sample information and available customization options.
              </p>
            </div>
            <div className="final-cta__actions">
              <WhatsAppButton className="button--large" context="contact">
                Talk to Our Team
              </WhatsAppButton>
              <Link className="button button--secondary button--large" href="/contact/">
                Contact details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
