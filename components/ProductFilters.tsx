"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/lib/products";
import type { Product } from "@/lib/types";

type Filter = "all" | "new-arrivals" | string;

interface ProductFiltersProps {
  products: Product[];
}

export function ProductFilters({ products }: ProductFiltersProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<"featured" | "newest" | "name">("featured");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("filter");
    if (query) setFilter(query);
  }, []);

  const filters = useMemo(
    () => [
      { slug: "all", label: "All" },
      ...categories.map((category) => ({
        slug: category.slug,
        label: category.shortName,
      })),
      { slug: "new-arrivals", label: "New Arrivals" },
    ],
    [],
  );

  const visibleProducts = useMemo(() => {
    const filtered =
      filter === "all"
        ? products
        : filter === "new-arrivals"
          ? products.filter((product) => product.newArrival)
          : products.filter((product) => product.category === filter);

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "newest") return Number(b.newArrival) - Number(a.newArrival);
      return Number(b.featured) - Number(a.featured);
    });
  }, [filter, products, sort]);

  const activeLabel =
    filters.find((item) => item.slug === filter)?.label || "All";

  return (
    <>
      <div className="catalog-toolbar">
        <div className="filter-tabs" role="group" aria-label="Filter products">
          {filters.map((item) => (
            <button
              type="button"
              className={filter === item.slug ? "is-active" : ""}
              aria-pressed={filter === item.slug}
              onClick={() => setFilter(item.slug)}
              key={item.slug}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="sort-select">
          <span>Sort</span>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as "featured" | "newest" | "name")
            }
          >
            <option value="featured">Featured first</option>
            <option value="newest">New arrivals first</option>
            <option value="name">Name A-Z</option>
          </select>
        </label>
      </div>
      <div className="catalog-result">
        <span>{visibleProducts.length} products</span>
        <span>{activeLabel}</span>
      </div>
      {visibleProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No products in this collection yet.</h3>
          <p>Ask us about custom availability or browse all products.</p>
          <button type="button" onClick={() => setFilter("all")}>
            View all products
          </button>
        </div>
      )}
    </>
  );
}
