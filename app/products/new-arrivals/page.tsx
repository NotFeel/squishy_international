import type { Metadata } from "next";
import Link from "next/link";
import { ProductCatalog } from "@/components/ProductCatalog";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getMaterialsWithProducts } from "@/lib/materials";
import { getAllProducts, getNewArrivals } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "New Squishy Toys | New Arrivals",
  description:
    "Discover the newest squishy toys available for gifting, retail and wholesale collections.",
  alternates: { canonical: absoluteUrl("/products/new-arrivals/") },
};

export default function NewArrivalsPage() {
  const products = getAllProducts();
  const newArrivals = getNewArrivals(products);

  return (
    <>
      <section className="page-hero catalog-hero">
        <div className="container page-hero__inner">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/products/">Products</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">New Arrivals</span>
            </nav>
            <p className="eyebrow">Just arrived</p>
            <h1>New Squishy Toys</h1>
            <p className="page-hero__description">
              Browse {newArrivals.length} new products by material, status and name.
            </p>
          </div>
          <aside className="page-hero__aside">
            <strong>Looking for a new line?</strong>
            <p>Ask for a material mix, MOQ and upcoming availability.</p>
            <WhatsAppButton context="wholesale">Ask About New Arrivals</WhatsAppButton>
          </aside>
        </div>
      </section>

      <section className="section catalog-section">
        <div className="container">
          <ProductCatalog
            products={products}
            materials={getMaterialsWithProducts()}
            basePath="/products/new-arrivals/"
            mode="new-arrivals"
          />
        </div>
      </section>
    </>
  );
}
