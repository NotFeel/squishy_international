import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

export function ProductCatalogFallback({ products }: { products: Product[] }) {
  return (
    <section className="catalog" aria-busy="true">
      <div className="catalog-result">
        <span>Loading catalog...</span>
      </div>
      <div className="product-grid">
        {products.slice(0, 10).map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}
