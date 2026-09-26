import materialsConfig from "@/config/materials.json";

export interface Material {
  id: string;
  name: string;
  enabled: boolean;
  sort: number;
}

const allMaterials = (materialsConfig as Material[]).sort(
  (a, b) => a.sort - b.sort,
);

export function getAllMaterials(): Material[] {
  return allMaterials.filter((material) => material.enabled);
}

export function getMaterialById(id: string): Material | undefined {
  return allMaterials.find((material) => material.id === id);
}
