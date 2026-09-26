import Link from "next/link";
import { getAllMaterials } from "@/lib/materials";

export function MaterialNav({ activeId }: { activeId?: string }) {
  const materials = getAllMaterials();

  return (
    <nav className="material-nav" aria-label="Filter products by material">
      <Link
        className={!activeId ? "is-active" : ""}
        href="/products/"
        aria-current={!activeId ? "page" : undefined}
      >
        All Materials
      </Link>
      {materials.map((material) => (
        <Link
          className={activeId === material.id ? "is-active" : ""}
          href={`/products/material/${material.id}/`}
          aria-current={activeId === material.id ? "page" : undefined}
          key={material.id}
        >
          {material.name}
        </Link>
      ))}
    </nav>
  );
}
