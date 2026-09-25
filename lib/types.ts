export type ProductCategory =
  | "animal-squishy"
  | "food-dessert"
  | "cute-characters"
  | "stress-relief"
  | "custom-oem";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: ProductCategory;
  tags: string[];
  material: string;
  size: string;
  weight: string;
  moq: string;
  packaging: string;
  oem: boolean;
  featured: boolean;
  newArrival: boolean;
  images: string[];
  seo: {
    title: string;
    description: string;
  };
  artType: string;
  palette: [string, string, string];
}
