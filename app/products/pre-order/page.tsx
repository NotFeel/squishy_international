import type { Metadata } from "next";
import Link from "next/link";
import { ProductCatalog } from "@/components/ProductCatalog";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getMaterialsWithProducts } from "@/lib/materials";
import { getAllProducts, getPreOrderProducts } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pre-Order Squishy Toys | Upcoming Designs",
  description:
    "Explore squishy toys currently available for pre-order. Ask about wholesale quantities, samples and production information.",
  alternates: { canonical: absoluteUrl("/products/pre-order/") },
};

export default function PreOrderPage() {
  const products = getAllProducts();
  const preOrderProducts = getPreOrderProducts(products);

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
              <span aria-current="page">Pre-Order</span>
            </nav>
            <p className="eyebrow">Reserve your favorites</p>
            <h1>Pre-Order Squishy Toys</h1>
            <p className="page-hero__description">
              Explore {preOrderProducts.length} squishy toys currently available for pre-order.
            </p>
          </div>
          <aside className="page-hero__aside">
            <strong>Planning an upcoming order?</strong>
            <p>Ask about samples, production timing and pre-order quantities.</p>
            <WhatsAppButton context="product">Ask About Pre-Order</WhatsAppButton>
          </aside>
        </div>
      </section>

      <section className="section catalog-section">
        <div className="container">
          <ProductCatalog
            products={products}
            materials={getMaterialsWithProducts()}
            basePath="/products/pre-order/"
            mode="preorder"
          />
        </div>
      </section>
    </>
  );
}
