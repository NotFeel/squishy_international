import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

interface HomeProductSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  products: Product[];
  className?: string;
}

export function HomeProductSection({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  products,
  className = "",
}: HomeProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className={`section home-product-section ${className}`.trim()}>
      <div className="container">
        <div className="section-heading-row">
          <div className="section-heading">
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            <p className="section-heading__description">{description}</p>
          </div>
          <Link className="text-link" href={href}>
            {linkLabel} <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="product-grid product-grid--home">
          {products.slice(0, 8).map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
