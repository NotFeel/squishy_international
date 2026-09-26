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
  oem: boolean;
  featured: boolean;
  newArrival: boolean;
  images: string[];
  ogImage: string;
  seo: {
    title: string;
    description: string;
  };
  artType?: string;
  palette?: [string, string, string];
}
