import productData from "@/data/products.json";
import type { Product, ProductCategory } from "@/lib/types";

export const products = productData as Product[];

export const categories: {
  slug: ProductCategory;
  name: string;
  shortName: string;
  description: string;
  color: string;
}[] = [
  {
    slug: "animal-squishy",
    name: "Animal Squishy",
    shortName: "Animals",
    description: "Friendly faces and soft little companions.",
    color: "blush",
  },
  {
    slug: "food-dessert",
    name: "Food & Dessert",
    shortName: "Food",
    description: "Sweet, snack-inspired squeezes.",
    color: "butter",
  },
  {
    slug: "cute-characters",
    name: "Cute Characters",
    shortName: "Characters",
    description: "Playful personalities with big charm.",
    color: "sky",
  },
  {
    slug: "stress-relief",
    name: "Stress Relief",
    shortName: "Stress Relief",
    description: "Simple shapes made for calmer moments.",
    color: "sage",
  },
  {
    slug: "custom-oem",
    name: "Custom / OEM",
    shortName: "Custom",
    description: "Your idea, shape, colors and branding.",
    color: "peach",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategoryName(slug: ProductCategory) {
  return (
    categories.find((category) => category.slug === slug)?.name || "Squishy Toy"
  );
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (candidate) =>
        candidate.slug !== product.slug &&
        (candidate.category === product.category ||
          candidate.tags.some((tag) => product.tags.includes(tag))),
    )
    .slice(0, limit);
}
