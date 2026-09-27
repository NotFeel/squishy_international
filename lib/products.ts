import productData from "@/data/products.json";
import type { Product } from "@/types/product";

const productList = productData as Product[];

export function getAllProducts(): Product[] {
  return productList.filter((product) => product.enabled !== false);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((product) => product.slug === slug);
}

export function getProductsByMaterial(materialId: string): Product[] {
  return getAllProducts().filter(
    (product) => product.materialId === materialId,
  );
}

export function getRelatedProducts(product: Product, limit = 4) {
  const visibleProducts = getAllProducts();
  const sameMaterial = visibleProducts.filter(
    (candidate) =>
      candidate.slug !== product.slug &&
      candidate.materialId === product.materialId,
  );
  const sharedTags = visibleProducts.filter(
    (candidate) =>
      candidate.slug !== product.slug &&
      candidate.materialId !== product.materialId &&
      candidate.tags.some((tag) => product.tags.includes(tag)),
  );

  return [...sameMaterial, ...sharedTags].slice(0, limit);
}

// Compatibility export. Prefer getAllProducts() so disabled items stay hidden.
export const products = getAllProducts();
