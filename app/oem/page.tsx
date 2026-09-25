import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Icon, type IconName } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { withBasePath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Custom Squishy Toys | OEM & ODM",
  description:
    "Develop custom squishy toys with your own shape, character, colors, logo and packaging through a sample-led OEM or ODM process.",
  alternates: { canonical: "/oem/" },
};

const options = [
  "Custom Shape",
  "Custom Size",
  "Custom Color",
  "Custom Character",
  "Custom Logo",
  "Custom Packaging",
  "Private Label",
  "Event or Promo Design",
];

const process: { icon: IconName; title: string; copy: string }[] = [
  { icon: "chat", title: "Share Your Idea", copy: "Send a drawing, reference, brand guide or a simple description of what you have in mind." },
  { icon: "palette", title: "Design & Prototype", copy: "We review feasibility, refine the direction and prepare a prototype or product route." },
  { icon: "box", title: "Sample Confirmation", copy: "Review the physical sample for shape, texture, color and presentation before production." },
  { icon: "package", title: "Mass Production", copy: "After sign-off, production is scheduled against the confirmed specification and quantity." },
  { icon: "shield", title: "Quality Inspection", copy: "Products and packaging are checked against the approved sample and order requirements." },
  { icon: "globe", title: "Shipping", copy: "Final carton details, destination and shipping method are coordinated for dispatch." },
];

const faqs = [
  {
    question: "Can you make a completely new shape?",
    answer:
      "Yes, new shape development can be reviewed. Share a clear concept or reference, target size, quantity and use case so we can advise on the practical route.",
  },
  {
    question: "What is the MOQ for custom work?",
    answer:
      "Custom projects commonly start from 500 pcs, but the exact MOQ depends on shape, material, size, packaging and complexity.",
  },
  {
    question: "How many sample rounds may be needed?",
    answer:
      "Many projects need one to two sample rounds. The correct number depends on how closely the concept must match an existing character, artwork or finish.",
  },
  {
    question: "Can you match Pantone colors?",
    answer:
      "Color matching can be discussed as part of sampling. Final color appearance also depends on material, surface finish and production batch.",
  },
];

export default function OemPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span>/</span><span aria-current="page">OEM / ODM</span>
            </nav>
            <p className="eyebrow">Custom development</p>
            <h1>Create Your Own Squishy Toy</h1>
            <p className="page-hero__description">
              From custom shapes and colors to branded packaging, we can support
              your product concept from idea to production.
            </p>
          </div>
          <aside className="page-hero__aside">
            <strong>Have a concept?</strong>
            <p>Send a sketch, reference or written brief. A rough idea is enough to begin.</p>
            <WhatsAppButton context="oem">Discuss Your Custom Project</WhatsAppButton>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container trust-grid">
          <div className="trust-visual">
            <Image
              src={withBasePath("/brand/oem.svg")}
              alt="A squishy toy concept shown as a sketch and finished 3D product"
              width={1000}
              height={720}
              sizes="(max-width: 980px) 100vw, 48vw"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Customization options"
              title="Make the product unmistakably yours"
              description="Choose the level of customization your project needs. Feasibility, MOQ and timing are confirmed after we review the concept."
            />
            <div className="customization-options">
              {options.map((option) => (
                <span key={option}><Icon name="check" size={17} />{option}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="From idea to delivery"
            title="A sample-led six-step process"
            description="Clear checkpoints keep creative, commercial and production decisions aligned."
          />
          <div className="process-grid">
            {process.map((step, index) => (
              <article className="process-card" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i><Icon name={step.icon} size={21} /></i>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <SectionHeading
            eyebrow="Development scope"
            title="What a custom brief can cover"
            description="We only confirm capabilities after reviewing your specific design and commercial requirements."
          />
          <div className="capability-strip">
            <div><strong>Character & Shape</strong><p>Original mascots, simplified forms and product-inspired concepts.</p></div>
            <div><strong>Material & Texture</strong><p>PU foam, TPR and project-appropriate soft-touch options.</p></div>
            <div><strong>Brand Experience</strong><p>Logo application, labels, hang tags and custom packaging direction.</p></div>
            <div><strong>Commercial Planning</strong><p>MOQ, sample stages, production timing and shipping coordination.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container faq-preview">
          <SectionHeading
            eyebrow="OEM / ODM FAQ"
            title="Details worth confirming early"
            description="A few practical answers before you share the project brief."
          />
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <div className="final-cta__panel">
            <div>
              <p className="eyebrow">Bring us the idea</p>
              <h2>Let&apos;s make your custom squishy a reality.</h2>
              <p>
                Tell us what the product should feel like, who it is for and your
                approximate quantity. We will help map the next practical step.
              </p>
            </div>
            <div className="final-cta__actions">
              <WhatsAppButton className="button--large" context="oem">Discuss Your Custom Project</WhatsAppButton>
              <Link className="button button--secondary button--large" href="/contact/">Ask a question</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
