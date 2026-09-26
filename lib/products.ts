import productData from "@/data/products.json";
import type { Product } from "@/types/product";

const productList = productData as Product[];

export function getAllProducts(): Product[] {
  return productList;
}

export function getProductBySlug(slug: string): Product | undefined {
  return productList.find((product) => product.slug === slug);
}

export function getProductsByMaterial(materialId: string): Product[] {
  return productList.filter((product) => product.materialId === materialId);
}

export function getRelatedProducts(product: Product, limit = 4) {
  const sameMaterial = productList.filter(
    (candidate) =>
      candidate.slug !== product.slug &&
      candidate.materialId === product.materialId,
  );
  const sharedTags = productList.filter(
    (candidate) =>
      candidate.slug !== product.slug &&
      candidate.materialId !== product.materialId &&
      candidate.tags.some((tag) => product.tags.includes(tag)),
  );

  return [...sameMaterial, ...sharedTags].slice(0, limit);
}

// Compatibility export for code that only needs to read the catalog.
export const products = productList;
