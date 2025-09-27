// src/app/models/product.ts
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  urlSlug: string;
  brand?: string;
  sku?: string;
  categoryId?: number; // Add this if it's missing
  publishing_date?: string; // Ensure backend returns ISO 8601 format (e.g., "2023-10-01T00:00:00Z")
}
