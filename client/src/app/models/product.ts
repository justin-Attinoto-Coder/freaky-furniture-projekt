// src/app/models/product.ts
export interface Product {
  id: number;
  name: string;
  brand?: string;
  price: number;
  description?: string;
  sku?: string;
  publishing_date?: string; // Ensure backend returns ISO 8601 format (e.g., "2023-10-01T00:00:00Z")
  urlSlug: string;
  category: string; // Made required for HomeComponent and SimilarProductsComponent
  image: string; // Matches backend field (verify if it's image or imageURL)
  size?: string;
  dimensions?: string;
  weight?: string;
  material?: string;
  specifications?: string | { [key: string]: string }; // Allow string or key-value pairs
  stock?: number; // Optional for inventory management
}
