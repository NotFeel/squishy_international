"use client";

import type { MouseEvent } from "react";
import type { Material } from "@/lib/materials";
import { withBasePath } from "@/lib/site";

interface MaterialNavProps {
  materials: Material[];
  activeId?: string;
  onSelect?: (materialId: string) => void;
}

export function MaterialNav({
  materials,
  activeId,
  onSelect,
}: MaterialNavProps) {
  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>,
    materialId: string,
  ) => {
    if (
      !onSelect ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    onSelect(materialId);
  };

  const preserveScrollBeforeFocus = (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (onSelect && event.button === 0) event.preventDefault();
  };

  const materialHref = (materialId: string) =>
    withBasePath(
      materialId ? `/products/material/${materialId}/` : "/products/",
    );

  return (
    <nav className="material-nav" aria-label="Filter products by material">
      <a
        className={!activeId ? "is-active" : ""}
        href={materialHref("")}
        aria-current={!activeId ? "page" : undefined}
        onMouseDown={preserveScrollBeforeFocus}
        onClick={(event) => handleClick(event, "")}
      >
        All Materials
      </a>
      {materials.map((material) => (
        <a
          className={activeId === material.id ? "is-active" : ""}
          href={materialHref(material.id)}
          aria-current={activeId === material.id ? "page" : undefined}
          key={material.id}
          onMouseDown={preserveScrollBeforeFocus}
          onClick={(event) => handleClick(event, material.id)}
        >
          {material.name}
        </a>
      ))}
    </nav>
  );
}
