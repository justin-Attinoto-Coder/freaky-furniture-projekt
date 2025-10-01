// src/app/models/product.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  image?: string;
  brand: string;
  urlSlug: string;
  sku: string;
  categoryId: number;
  categoryName?: string;
  categorySlug?: string;
  // Add these fields to match your C# Product model
  size?: string;
  dimensions?: string;
  weight?: string;
  material?: string;
  specifications?: string;
  publishingDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
