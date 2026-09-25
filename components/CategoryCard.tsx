import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { withBasePath } from "@/lib/site";
import type { Product } from "@/types/product";

interface CategoryCardProps {
  name: string;
  description: string;
  href: string;
  image: string;
  index: number;
  accent?: string;
}

export function CategoryCard({
  name,
  description,
  href,
  image,
  index,
  accent = "blush",
}: CategoryCardProps) {
  return (
    <Link className={`category-card category-card--${accent}`} href={href}>
      <div className="category-card__image">
        <Image
          src={withBasePath(image)}
          alt={`${name} collection`}
          width={640}
          height={640}
          sizes="(max-width: 767px) 50vw, (max-width: 1100px) 33vw, 20vw"
        />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="category-card__copy">
        <h3>{name}</h3>
        <p>{description}</p>
        <span>
          Explore <Icon name="arrow" size={17} />
        </span>
      </div>
    </Link>
  );
}

export function ProductCategoryCard({
  product,
  name,
  description,
  href,
  index,
  accent,
}: {
  product: Product;
  name: string;
  description: string;
  href: string;
  index: number;
  accent?: string;
}) {
  return (
    <CategoryCard
      name={name}
      description={description}
      href={href}
      image={product.images[0]}
      index={index}
      accent={accent}
    />
  );
}
