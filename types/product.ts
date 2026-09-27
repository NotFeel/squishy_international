export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  materialId: string;
  tags: string[];
  material: string;
  size: string;
  weight?: string;
  moq: string;
  packaging: string;
  cartonDimensions?: string;
  cartonQtyPcs?: number;
  cartonWeightKg?: number;
  oem: boolean;
  featured: boolean;
  newArrival: boolean;
  enabled?: boolean;
  images: string[];
  ogImage: string;
  seo: {
    title: string;
    description: string;
  };
  artType?: string;
  palette?: [string, string, string];
}
