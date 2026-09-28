"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MaterialNav } from "@/components/MaterialNav";
import { ProductCard } from "@/components/ProductCard";
import type { Material } from "@/lib/materials";
import { withBasePath } from "@/lib/site";
import type { Product, ProductStatus } from "@/types/product";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
const DEFAULT_PAGE_SIZE = 10;
const STATUS_OPTIONS: Array<{ value: "all" | ProductStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "preorder", label: "Pre-Order" },
  { value: "coming_soon", label: "Coming Soon" },
];

export type CatalogMode = "all" | "new-arrivals" | "preorder";

interface ProductCatalogProps {
  products: Product[];
  materials: Material[];
  basePath: string;
  initialMaterialId?: string;
  mode?: CatalogMode;
}

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function isProductStatus(value: string): value is ProductStatus {
  return ["available", "preorder", "coming_soon"].includes(value);
}

function materialFromLocation(
  pathname: string,
  searchParams: URLSearchParams,
  materials: Material[],
) {
  const queryMaterial = searchParams.get("material") || "";
  if (materials.some((material) => material.id === queryMaterial)) {
    return queryMaterial;
  }

  return (
    materials.find((material) =>
      pathname.endsWith(`/products/material/${material.id}/`),
    )?.id || ""
  );
}

function queryPath(
  basePath: string,
  materialId: string,
  initialMaterialId: string,
  keyword: string,
  status: "all" | ProductStatus,
  page: number,
  pageSize: number,
  mode: CatalogMode,
) {
  const params = new URLSearchParams();
  const normalizedKeyword = keyword.trim();

  if (normalizedKeyword) params.set("search", normalizedKeyword);
  if (materialId && materialId !== initialMaterialId) {
    params.set("material", materialId);
  }
  if (status !== "all" && mode !== "preorder") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  if (pageSize !== DEFAULT_PAGE_SIZE) {
    params.set("pageSize", String(pageSize));
  }

  const query = params.toString();
  const path = withBasePath(basePath);
  return query ? `${path}?${query}` : path;
}

export function ProductCatalog({
  products,
  materials,
  basePath,
  initialMaterialId = "",
  mode = "all",
}: ProductCatalogProps) {
  const [materialId, setMaterialId] = useState(initialMaterialId);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"all" | ProductStatus>(
    mode === "preorder" ? "preorder" : "all",
  );
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
      const statusParam = params.get("status") || "";

      setMaterialId(
        materialFromLocation(window.location.pathname, params, materials),
      );
      setKeyword(params.get("search") || params.get("q") || "");
      setStatus(
        mode === "preorder"
          ? "preorder"
          : isProductStatus(statusParam)
            ? statusParam
            : "all",
      );
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
  }, [materials, mode]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextPath = queryPath(
        basePath,
        materialId,
        initialMaterialId,
        keyword,
        status,
        page,
        pageSize,
        mode,
      );
      const currentPath = `${window.location.pathname}${window.location.search}`;

      if (nextPath !== currentPath) {
        window.history.replaceState(null, "", nextPath);
      }
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [
    basePath,
    initialMaterialId,
    keyword,
    materialId,
    page,
    pageSize,
    status,
    mode,
  ]);

  const filteredProducts = useMemo(() => {
    let scopedProducts = products;

    if (mode === "new-arrivals") {
      scopedProducts = scopedProducts.filter(
        (product) => product.newArrival,
      );
    } else if (mode === "preorder") {
      scopedProducts = scopedProducts.filter(
        (product) => product.status === "preorder",
      );
    }

    const normalizedKeyword = keyword.trim().toLowerCase();
    return scopedProducts.filter((product) => {
      const matchesMaterial =
        !materialId || product.materialId === materialId;
      const matchesStatus =
        mode === "preorder" || status === "all" || product.status === status;
      const matchesSearch =
        !normalizedKeyword ||
        product.name.toLowerCase().includes(normalizedKeyword);

      return matchesMaterial && matchesStatus && matchesSearch;
    });
  }, [keyword, materialId, mode, products, status]);

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

  const restoreScrollAfterStateChange = (scrollY: number) => {
    const restore = () => window.scrollTo(0, scrollY);
    window.requestAnimationFrame(restore);
    window.setTimeout(restore, 0);
    window.setTimeout(restore, 80);
    window.setTimeout(restore, 200);
  };

  const changeMaterial = (nextMaterialId: string) => {
    if (nextMaterialId === materialId) return;

    const scrollY = window.scrollY;
    setMaterialId(nextMaterialId);
    setPage(1);
    window.history.pushState(
      null,
      "",
      queryPath(
        basePath,
        nextMaterialId,
        initialMaterialId,
        keyword,
        status,
        1,
        pageSize,
        mode,
      ),
    );
    restoreScrollAfterStateChange(scrollY);
  };

  const changeStatus = (nextStatus: "all" | ProductStatus) => {
    if (nextStatus === status) return;

    const scrollY = window.scrollY;
    setStatus(nextStatus);
    setPage(1);
    window.history.pushState(
      null,
      "",
      queryPath(
        basePath,
        materialId,
        initialMaterialId,
        keyword,
        nextStatus,
        1,
        pageSize,
        mode,
      ),
    );
    restoreScrollAfterStateChange(scrollY);
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

      <div className="catalog-filters">
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
            placeholder="Search products..."
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

      {mode !== "preorder" && (
        <div className="status-filter">
          <span>Status</span>
          <div className="status-filter__options" role="group" aria-label="Filter by status">
            {STATUS_OPTIONS.map((option) => (
              <button
                type="button"
                className={status === option.value ? "is-active" : ""}
                aria-pressed={status === option.value}
                onClick={() => changeStatus(option.value)}
                key={option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
          <p>Try a different filter or clear the search field.</p>
          <button
            type="button"
            onClick={() => {
              setKeyword("");
              if (mode !== "preorder") setStatus("all");
              setPage(1);
            }}
          >
            Clear filters
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
