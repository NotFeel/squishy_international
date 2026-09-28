import type { Product } from "@/types/product";

export function ProductBadge({ product }: { product: Product }) {
  return (
    <div className="product-badges" aria-label="Product labels">
      {product.newArrival && (
        <span className="product-badge product-badge--new">New</span>
      )}
      {product.status === "preorder" && (
        <span className="product-badge product-badge--preorder">Pre-Order</span>
      )}
      {product.status === "coming_soon" && (
        <span className="product-badge product-badge--coming-soon">
          Coming Soon
        </span>
      )}
      {product.featured && (
        <span className="product-badge product-badge--featured">Featured</span>
      )}
    </div>
  );
}
