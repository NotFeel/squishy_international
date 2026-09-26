"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
const DEFAULT_PAGE_SIZE = 10;

interface ProductCatalogProps {
  products: Product[];
}

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function ProductCatalog({ products }: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const catalogRef = useRef<HTMLElement>(null);

  const urlKeyword = searchParams.get("q") ?? "";
  const requestedPageSize = parsePositiveInteger(
    searchParams.get("pageSize"),
    DEFAULT_PAGE_SIZE,
  );
  const urlPageSize = PAGE_SIZE_OPTIONS.includes(
    requestedPageSize as (typeof PAGE_SIZE_OPTIONS)[number],
  )
    ? requestedPageSize
    : DEFAULT_PAGE_SIZE;
  const urlPage = parsePositiveInteger(searchParams.get("page"), 1);

  const [keyword, setKeyword] = useState(urlKeyword);
  const [page, setPage] = useState(urlPage);
  const [pageSize, setPageSize] = useState(urlPageSize);

  useEffect(() => {
    setKeyword(urlKeyword);
    setPage(urlPage);
    setPageSize(urlPageSize);
  }, [urlKeyword, urlPage, urlPageSize]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const normalizedKeyword = keyword.trim();

      if (normalizedKeyword) params.set("q", normalizedKeyword);
      else params.delete("q");

      if (page > 1) params.set("page", String(page));
      else params.delete("page");

      if (pageSize !== DEFAULT_PAGE_SIZE) {
        params.set("pageSize", String(pageSize));
      } else {
        params.delete("pageSize");
      }

      const nextQuery = params.toString();
      if (nextQuery !== searchParams.toString()) {
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
          scroll: false,
        });
      }
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [keyword, page, pageSize, pathname, router, searchParams]);

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return products;

    return products.filter((product) =>
      product.name.toLowerCase().includes(normalizedKeyword),
    );
  }, [keyword, products]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / pageSize),
  );
  const safePage = Math.min(page, totalPages);
  const currentProducts = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, pageSize, safePage]);

  const startItem =
    filteredProducts.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, filteredProducts.length);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const goToPage = (nextPage: number) => {
    setPage(Math.max(1, Math.min(totalPages, nextPage)));
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="catalog" ref={catalogRef}>
      <div className="catalog-controls">
        <label className="catalog-search" htmlFor="product-search">
          <span>Search by product name</span>
          <input
            id="product-search"
            type="search"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              setPage(1);
            }}
            placeholder="Search this material..."
            autoComplete="off"
          />
        </label>

        <label className="page-size-select" htmlFor="page-size">
          <span>Show</span>
          <select
            id="page-size"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option value={size} key={size}>
                {size}
              </option>
            ))}
          </select>
          <span>per page</span>
        </label>
      </div>

      <div className="catalog-result" aria-live="polite">
        <span>
          {filteredProducts.length === 0
            ? "0 products"
            : `Showing ${startItem}-${endItem} of ${filteredProducts.length} products`}
        </span>
        <span>
          Page {safePage} of {totalPages}
        </span>
      </div>

      {currentProducts.length > 0 ? (
        <div className="product-grid">
          {currentProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No matching products found.</h3>
          <p>Try a different product name or clear the search field.</p>
          <button type="button" onClick={() => setKeyword("")}>
            Clear search
          </button>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <nav className="pagination" aria-label="Product pages">
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage <= 1}
          >
            Previous
          </button>
          <div className="pagination__numbers">
            {pageNumbers.map((pageNumber) => (
              <button
                type="button"
                className={pageNumber === safePage ? "is-active" : ""}
                aria-current={pageNumber === safePage ? "page" : undefined}
                onClick={() => goToPage(pageNumber)}
                key={pageNumber}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage >= totalPages}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}
