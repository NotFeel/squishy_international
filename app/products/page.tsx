import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { MaterialNav } from "@/components/MaterialNav";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ProductCatalogFallback } from "@/components/ProductCatalogFallback";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getAllProducts } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Squishy Toys Collection",
  description:
    "Browse squishy toys by material, including PU foam, TPR and mixed-material products for wholesale and custom projects.",
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
            <h1>All Squishy Toys</h1>
            <p className="page-hero__description">
              Browse {products.length} products by material, then search within
              the current collection.
            </p>
          </div>
          <aside className="page-hero__aside">
            <strong>Buying for a store?</strong>
            <p>
              Ask for a material assortment, wholesale pricing and packaging
              options.
            </p>
            <WhatsAppButton context="wholesale">
              Request wholesale details
            </WhatsAppButton>
          </aside>
        </div>
      </section>

      <section className="section catalog-section">
        <div className="container">
          <MaterialNav />
          <Suspense fallback={<ProductCatalogFallback products={products} />}>
            <ProductCatalog products={products} />
          </Suspense>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <div className="final-cta__panel">
            <div>
              <p className="eyebrow">Need a custom assortment?</p>
              <h2>Let&apos;s shape the right collection for your market.</h2>
              <p>
                Share your target quantity, preferred materials and packaging
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
