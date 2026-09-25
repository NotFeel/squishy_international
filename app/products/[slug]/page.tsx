import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import {
  getCategoryName,
  getProduct,
  getRelatedProducts,
  products,
} from "@/lib/products";
import { absoluteAssetUrl, site } from "@/lib/site";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: {
      canonical: `/products/${product.slug}/`,
    },
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      url: `/products/${product.slug}/`,
      type: "website",
      images: [
        {
          url: product.images[0],
          width: 640,
          height: 640,
          alt: `${product.name} product image`,
        },
      ],
    },
  };
}

const features = [
  "Soft & satisfying",
  "Slow-rising texture",
  "Lightweight design",
  "Gift friendly",
  "Custom logo available",
  "OEM / ODM available",
];

const customOptions = [
  "Custom shape",
  "Custom color",
  "Custom character",
  "Custom logo",
  "Custom packaging",
  "Private label",
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);
  const productUrl = `${site.url}/products/${product.slug}/`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.id,
    image: product.images.map(absoluteAssetUrl),
    material: product.material,
    brand: {
      "@type": "Brand",
      name: site.name,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        description: "Wholesale quotation available on request",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <section className="detail-section">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/products/">Products</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{product.name}</span>
          </nav>
          <div className="product-detail">
            <ProductGallery images={product.images} productName={product.name} />
            <div className="product-summary">
              <div className="product-summary__meta">
                <span>{getCategoryName(product.category)}</span>
                <span>SKU {product.id}</span>
                {product.newArrival && <span>New arrival</span>}
              </div>
              <h1>{product.name}</h1>
              <p className="product-summary__description">
                {product.shortDescription}
              </p>

              <div className="feature-chips">
                {features.slice(0, 4).map((feature) => (
                  <span key={feature}>
                    <Icon name="check" size={17} />
                    {feature}
                  </span>
                ))}
              </div>

              <div className="product-summary__cta">
                <WhatsAppLink product={product} context="product" className="button--large">
                  Ask About This Product
                </WhatsAppLink>
                <p>
                  Your message will include the product name, SKU and page link.
                </p>
              </div>
              <div className="product-summary__micro">
                <span>
                  <Icon name="box" size={17} /> MOQ {product.moq}
                </span>
                <span>
                  <Icon name="palette" size={17} /> Custom options available
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-info-section">
        <div className="container product-info-grid">
          <SectionHeading
            eyebrow="Product details"
            title="The essentials, made clear"
            description="All specifications below can be discussed against your market, packaging and order requirements."
          />
          <div className="spec-list">
            <div className="spec-item">
              <span>Material</span>
              <strong>{product.material}</strong>
            </div>
            <div className="spec-item">
              <span>Size</span>
              <strong>{product.size}</strong>
            </div>
            <div className="spec-item">
              <span>Weight</span>
              <strong>{product.weight}</strong>
            </div>
            <div className="spec-item">
              <span>MOQ</span>
              <strong>{product.moq}</strong>
            </div>
            <div className="spec-item">
              <span>Packaging</span>
              <strong>{product.packaging}</strong>
            </div>
            <div className="spec-item">
              <span>OEM / ODM</span>
              <strong>{product.oem ? "Available" : "Ask our team"}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="customization-panel">
            <SectionHeading
              eyebrow="Make it yours"
              title="Customization options"
              description="Start with a catalog favorite or brief us on a completely new character. Final options depend on quantity, target price and project review."
            />
            <div className="customization-options">
              {customOptions.map((option) => (
                <span key={option}>
                  <Icon name="check" size={17} />
                  {option}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Keep exploring"
              title="You may also like"
              description="Discover nearby characters, textures and product themes."
            />
            <div className="related-grid">
              {related.map((item) => (
                <ProductCard product={item} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="final-cta">
        <div className="container">
          <div className="final-cta__panel">
            <div>
              <p className="eyebrow">Product inquiry</p>
              <h2>Need pricing, samples or customization details?</h2>
              <p>
                Send us a message about {product.name}. We will confirm current
                MOQ, sample timing and the most practical options for your order.
              </p>
            </div>
            <div className="final-cta__actions">
              <WhatsAppLink
                product={product}
                context="product"
                className="button--large"
              >
                Ask About This Product
              </WhatsAppLink>
              <Link className="button button--secondary button--large" href="/products/">
                Back to products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
