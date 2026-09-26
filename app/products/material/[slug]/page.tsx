import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MaterialNav } from "@/components/MaterialNav";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ProductCatalogFallback } from "@/components/ProductCatalogFallback";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getAllMaterials, getMaterialById } from "@/lib/materials";
import { getProductsByMaterial } from "@/lib/products";
import { absoluteUrl, site } from "@/lib/site";

interface MaterialPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllMaterials().map((material) => ({ slug: material.id }));
}

export async function generateMetadata({
  params,
}: MaterialPageProps): Promise<Metadata> {
  const { slug } = await params;
  const material = getMaterialById(slug);

  if (!material || !material.enabled) {
    return { title: "Material not found" };
  }

  const title = `${material.name} Squishy Toys`;
  const description = `Browse ${material.name.toLowerCase()} squishy toys available for wholesale, gifting and custom projects.`;
  const url = absoluteUrl(`/products/material/${material.id}/`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: site.name,
      images: [
        {
          url: absoluteUrl("/brand/og-image.png"),
          width: 1200,
          height: 630,
          alt: `${material.name} squishy toys`,
        },
      ],
    },
  };
}

export default async function MaterialProductsPage({
  params,
}: MaterialPageProps) {
  const { slug } = await params;
  const material = getMaterialById(slug);

  if (!material || !material.enabled) {
    notFound();
  }

  const products = getProductsByMaterial(material.id);

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
              <span aria-current="page">{material.name}</span>
            </nav>
            <p className="eyebrow">Shop by material</p>
            <h1>{material.name} Squishy Toys</h1>
            <p className="page-hero__description">
              Browse {products.length} {material.name} products for wholesale,
              gifting and custom projects.
            </p>
          </div>
          <aside className="page-hero__aside">
            <strong>Need material samples?</strong>
            <p>
              Send us the material, product names and target quantity for the
              quickest response.
            </p>
            <WhatsAppButton context="sample">
              Ask About Samples
            </WhatsAppButton>
          </aside>
        </div>
      </section>

      <section className="section catalog-section">
        <div className="container">
          <MaterialNav activeId={material.id} />
          <Suspense fallback={<ProductCatalogFallback products={products} />}>
            <ProductCatalog products={products} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
