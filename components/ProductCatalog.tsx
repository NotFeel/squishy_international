"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MaterialNav } from "@/components/MaterialNav";
import { ProductCard } from "@/components/ProductCard";
import type { Material } from "@/lib/materials";
import { withBasePath } from "@/lib/site";
import type { Product } from "@/types/product";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
const DEFAULT_PAGE_SIZE = 10;

interface ProductCatalogProps {
  products: Product[];
  materials: Material[];
  initialMaterialId?: string;
}

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function materialFromPath(pathname: string, materials: Material[]) {
  return materials.find((material) =>
    pathname.endsWith(`/products/material/${material.id}/`),
  )?.id;
}

function catalogPath(materialId: string) {
  return withBasePath(
    materialId ? `/products/material/${materialId}/` : "/products/",
  );
}

function queryPath(
  materialId: string,
  keyword: string,
  page: number,
  pageSize: number,
) {
  const params = new URLSearchParams();
  const normalizedKeyword = keyword.trim();

  if (normalizedKeyword) params.set("q", normalizedKeyword);
  if (page > 1) params.set("page", String(page));
  if (pageSize !== DEFAULT_PAGE_SIZE) {
    params.set("pageSize", String(pageSize));
  }

  const query = params.toString();
  const path = catalogPath(materialId);
  return query ? `${path}?${query}` : path;
}

export function ProductCatalog({
  products,
  materials,
  initialMaterialId = "",
}: ProductCatalogProps) {
  const [materialId, setMaterialId] = useState(initialMaterialId);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const catalogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const applyLocationState = () => {
      const params = new URLSearchParams(window.location.search);
      const nextPageSize = parsePositiveInteger(
        params.get("pageSize"),
        DEFAULT_PAGE_SIZE,
      );

      setMaterialId(
        materialFromPath(window.location.pathname, materials) || "",
      );
      setKeyword(params.get("q") ?? "");
      setPage(parsePositiveInteger(params.get("page"), 1));
      setPageSize(
        PAGE_SIZE_OPTIONS.includes(
          nextPageSize as (typeof PAGE_SIZE_OPTIONS)[number],
        )
          ? nextPageSize
          : DEFAULT_PAGE_SIZE,
      );
    };

    applyLocationState();
    window.addEventListener("popstate", applyLocationState);
    return () => window.removeEventListener("popstate", applyLocationState);
  }, [materials]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextPath = queryPath(materialId, keyword, page, pageSize);
      const currentPath = `${window.location.pathname}${window.location.search}`;

      if (nextPath !== currentPath) {
        window.history.replaceState(null, "", nextPath);
      }
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [keyword, materialId, page, pageSize]);

  const filteredProducts = useMemo(() => {
    const materialProducts = materialId
      ? products.filter((product) => product.materialId === materialId)
      : products;
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) return materialProducts;

    return materialProducts.filter((product) =>
      product.name.toLowerCase().includes(normalizedKeyword),
    );
  }, [keyword, materialId, products]);

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

  const changeMaterial = (nextMaterialId: string) => {
    if (nextMaterialId === materialId) return;

    const scrollY = window.scrollY;
    setMaterialId(nextMaterialId);
    setKeyword("");
    setPage(1);
    window.history.pushState(null, "", catalogPath(nextMaterialId));

    const restoreScroll = () => window.scrollTo(0, scrollY);
    window.requestAnimationFrame(restoreScroll);
    window.setTimeout(restoreScroll, 0);
    window.setTimeout(restoreScroll, 80);
    window.setTimeout(restoreScroll, 200);
  };

  const goToPage = (nextPage: number) => {
    setPage(Math.max(1, Math.min(totalPages, nextPage)));
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="catalog" ref={catalogRef}>
      <MaterialNav
        materials={materials}
        activeId={materialId || undefined}
        onSelect={changeMaterial}
      />

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
          <button
            type="button"
            onClick={() => {
              setKeyword("");
              setPage(1);
            }}
          >
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
