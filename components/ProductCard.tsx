import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { withBasePath } from "@/lib/site";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="product-card">
      <Link
        className="product-card__image"
        href={`/products/${product.slug}/`}
        aria-label={`View ${product.name}`}
      >
        <Image
          src={withBasePath(product.images[0])}
          alt={`${product.name}, soft slow-rising squishy toy`}
          width={640}
          height={640}
          priority={priority}
          sizes="(max-width: 767px) 50vw, (max-width: 1100px) 33vw, 25vw"
        />
        {product.newArrival && <span className="product-card__badge">New</span>}
      </Link>
      <div className="product-card__body">
        <div>
          <h3>
            <Link href={`/products/${product.slug}/`}>{product.name}</Link>
          </h3>
          <p>{product.shortDescription}</p>
        </div>
        <Link className="text-link" href={`/products/${product.slug}/`}>
          View product
          <Icon name="arrow" size={17} />
        </Link>
      </div>
    </article>
  );
}
