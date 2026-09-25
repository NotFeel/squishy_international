import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProductFilters } from "@/components/ProductFilters";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getAllProducts } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Squishy Toys Collection",
  description:
    "Browse cute animal, food, character and stress-relief squishy toys. Wholesale and custom OEM options available.",
  alternates: {
    canonical: absoluteUrl("/products/"),
  },
};

export default function ProductsPage() {
  const products = getAllProducts();
  return (
    <>
      <section className="page-hero catalog-hero">
        <div className="container page-hero__inner">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Products</span>
            </nav>
            <p className="eyebrow">The squishy collection</p>
            <h1>Squishy Toys</h1>
            <p className="page-hero__description">
              Cute, soft and satisfying products for every mood, shelf and
              gifting moment.
            </p>
          </div>
          <aside className="page-hero__aside">
            <strong>Buying for a store?</strong>
            <p>
              Ask for a category assortment, wholesale pricing and packaging
              options.
            </p>
            <WhatsAppButton context="wholesale">
              Request wholesale details
            </WhatsAppButton>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ProductFilters products={products} />
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <div className="final-cta__panel">
            <div>
              <p className="eyebrow">Need a custom assortment?</p>
              <h2>Let&apos;s shape the right collection for your market.</h2>
              <p>
                Share your target quantity, preferred characters and packaging
                direction. Our team will suggest a practical starting mix.
              </p>
            </div>
            <div className="final-cta__actions">
              <WhatsAppButton className="button--large" context="wholesale">
                Request Wholesale Information
              </WhatsAppButton>
              <Link className="button button--secondary button--large" href="/oem/">
                Explore OEM / ODM <Icon name="arrow" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
