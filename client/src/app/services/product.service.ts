import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

// Interface for creating new products
export interface CreateProductRequest {
  name: string;
  description: string;
  image: string;
  brand: string;
  price: number;
  urlSlug: string;
  sku: string;
  categoryId: number;
}

// Interface for API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Use environment configuration for API URL
  private apiUrl = `${environment.apiBaseUrl}/api/products`;
  private baseImageUrl = environment.apiBaseUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getFurnitureItems(): Observable<Product[]> {
    // Use the /all endpoint for better performance
    return this.http.get<any>(`${this.apiUrl}/all`).pipe(
      tap(response => {
        console.log('🔍 Raw API response from /all:', response);
        if (Array.isArray(response)) {
          console.log('✅ Products loaded from API:', response.length);
          console.log('🔍 First 3 products:', response.slice(0, 3).map(p => ({
            name: p.name,
            urlSlug: p.urlSlug,
            categoryName: p.categoryName
          })));
        }
      }),
      map(response => {
        // Handle direct array response from /all endpoint
        if (Array.isArray(response)) {
          return response.map(this.mapApiProductToClientProduct);
        }
        console.warn('⚠️ Unexpected API response format');
        return [];
      }),
      catchError(error => {
        console.error('❌ API not available:', error.message);
        // Return empty array instead of Swedish mock data
        return of([]);
      })
    );
  }

  // Map API product to client product format
  private mapApiProductToClientProduct = (apiProduct: any): Product => {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      description: apiProduct.description,
      price: apiProduct.price,
      imageUrl: apiProduct.image ? `${this.baseImageUrl}${apiProduct.image}` : this.getPlaceholderImage(),
      categoryId: apiProduct.categoryId,
      categoryName: apiProduct.categoryName,
      publishingDate: apiProduct.publishingDate || new Date().toISOString(),
      brand: apiProduct.brand || 'Freaky Furniture',
      sku: apiProduct.sku || 'N/A',
      urlSlug: apiProduct.urlSlug,
      image: apiProduct.image || ''
    };
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(apiProduct => {
        if (apiProduct) {
          return this.mapApiProductToClientProduct(apiProduct);
        }
        return null;
      }),
      tap(product => {
        console.log('✅ Product loaded:', product?.name || 'Unknown');
      }),
      catchError(error => {
        console.warn(`⚠️ Product ${id} not found:`, error.message);
        return of(null);
      })
    );
  }

  addProduct(productData: CreateProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, productData, this.httpOptions).pipe(
      tap(response => {
        console.log('✅ Product added successfully:', response.data);
      }),
      catchError(error => {
        console.error('❌ Error adding product:', error);
        throw error;
      })
    );
  }

  updateProduct(id: number, productData: Partial<CreateProductRequest>): Observable<ApiResponse<Product>> {
    // Create JsonPatchDocument operations for all fields
    const patchOperations = [];

    if (productData.name !== undefined) {
      patchOperations.push({ op: 'replace', path: '/name', value: productData.name });
    }
    if (productData.description !== undefined) {
      patchOperations.push({ op: 'replace', path: '/description', value: productData.description });
    }
    if (productData.price !== undefined) {
      patchOperations.push({ op: 'replace', path: '/price', value: productData.price });
    }
    if (productData.image !== undefined) {
      patchOperations.push({ op: 'replace', path: '/image', value: productData.image });
    }
    if (productData.brand !== undefined) {
      patchOperations.push({ op: 'replace', path: '/brand', value: productData.brand });
    }
    if (productData.sku !== undefined) {
      patchOperations.push({ op: 'replace', path: '/sku', value: productData.sku });
    }
    if (productData.categoryId !== undefined) {
      patchOperations.push({ op: 'replace', path: '/categoryId', value: productData.categoryId });
    }

    return this.http.patch<ApiResponse<Product>>(`${this.apiUrl}/${id}`, patchOperations, this.httpOptions).pipe(
      tap(response => {
        console.log('✅ Product updated successfully:', response.data);
      }),
      catchError(error => {
        console.error('❌ Error updating product:', error);
        throw error;
      })
    );
  }

  deleteProduct(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      tap(response => {
        console.log('✅ Product deleted successfully');
      }),
      catchError(error => {
        console.error('❌ Error deleting product:', error);
        throw error;
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getFurnitureItems().pipe(
      map(products => {
        if (!Array.isArray(products)) {
          console.error('❌ Products is not an array:', products);
          return [];
        }

        console.log(`🔍 Searching for category: "${category}"`);

        // Clean category mapping - only English database categories
        const categoryMap: { [key: string]: string[] } = {
          'mobler': ['Mobler'],
          'furniture': ['Mobler'],
          'forvaring': ['Forvaring'],
          'storage': ['Forvaring'],
          'textil': ['Textil'],
          'textile': ['Textil'],
          'detaljer': ['Detaljer'],
          'details': ['Detaljer']
        };

        const searchCategory = category.toLowerCase();
        const possibleMatches = categoryMap[searchCategory] || [category];

        const filtered = products.filter(p => {
          const productCategory = p.categoryName;
          return possibleMatches.some(match =>
            productCategory && productCategory.toLowerCase() === match.toLowerCase()
          );
        });

        console.log(`📊 Found ${filtered.length} products for category "${category}"`);
        return filtered;
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.getFurnitureItems().pipe(
      map(products => {
        if (!Array.isArray(products)) {
          return [];
        }
        return products.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(query.toLowerCase()))
        );
      })
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.getFurnitureItems();
  }

  getProducts(): Observable<Product[]> {
    return this.getFurnitureItems();
  }

  private getPlaceholderImage(): string {
    return `${this.baseImageUrl}/images/placeholder.jpg`;
  }
}
