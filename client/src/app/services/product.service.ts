import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Product } from '../models/product';

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
  // Updated to match your running backend
  private apiUrl = 'http://localhost:5186/api/products';
  private baseImageUrl = 'http://localhost:5186/images/products';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getFurnitureItems(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(response => {
        console.log('🔍 Raw API response:', response);
        console.log('🔍 Response type:', typeof response);
        console.log('🔍 Is array:', Array.isArray(response));

        if (Array.isArray(response)) {
          console.log('✅ Products loaded from API:', response.length);
        } else {
          console.log('⚠️ API response is not an array, structure:', response);
        }
      }),
      map(response => {
        // Handle different API response formats
        if (Array.isArray(response)) {
          return response;
        }
        // If the API returns an object with a data property containing the array
        if (response && typeof response === 'object' && 'data' in response) {
          const data = (response as any).data;
          if (Array.isArray(data)) {
            console.log('✅ Extracted products from response.data:', data.length);
            return data;
          }
        }
        // If response has other structure, log and fallback
        console.warn('⚠️ Unexpected API response format, using mock data');
        return this.getCachedMockProducts();
      }),
      catchError(error => {
        console.warn('⚠️ API not available, using generated mock data:', error.message);
        return of(this.getCachedMockProducts());
      })
    );
  }

  getProducts(): Observable<Product[]> {
    return this.getFurnitureItems();
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap(product => {
        console.log('✅ Product loaded:', product?.name || 'Unknown');
      }),
      catchError(error => {
        console.warn(`⚠️ Product ${id} not found, using mock data:`, error.message);
        const mockProduct = this.getCachedMockProducts().find(p => p.id === id);
        return of(mockProduct || null);
      })
    );
  }

  addProduct(productData: CreateProductRequest): Observable<ApiResponse<Product>> {
    console.log('🔄 Adding product:', productData);

    return this.http.post<ApiResponse<Product>>(this.apiUrl, productData, this.httpOptions).pipe(
      tap(response => {
        console.log('✅ Product added successfully:', response.data);
      }),
      catchError(error => {
        console.warn('⚠️ API not available, simulating add product:', error.message);

        const mockProduct: Product = {
          id: Date.now(),
          name: productData.name,
          categoryName: this.getCategoryStringFromId(productData.categoryId),
          price: productData.price,
          description: productData.description,
          image: productData.image,
          urlSlug: productData.urlSlug,
          brand: productData.brand,
          sku: productData.sku,
          categoryId: productData.categoryId,
          publishingDate: new Date()
        };

        const mockResponse: ApiResponse<Product> = {
          success: true,
          data: mockProduct,
          message: 'Product created successfully (mock)'
        };

        return of(mockResponse);
      })
    );
  }

  updateProduct(id: number, productData: Partial<CreateProductRequest>): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, productData, this.httpOptions).pipe(
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
        return products.filter(p => p.categoryName === category);
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.getFurnitureItems().pipe(
      map(products => {
        if (!Array.isArray(products)) {
          console.error('❌ Products is not an array:', products);
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

  private getCategoryStringFromId(categoryId: number): string {
    const categoryMap: { [key: number]: string } = {
      1: 'Möbler',
      2: 'Förvaring',
      3: 'Textilier',
      4: 'Detaljer'  // Added the missing category
    };
    return categoryMap[categoryId] || 'Möbler';
  }

  private generateLargeProductCatalog(): Product[] {
    console.log('🎨 Generating large freaky furniture catalog...');

    // Updated to match your actual categories
    const categories = ['mobler', 'forvaring', 'textilier', 'detaljer'];
    const categoryNames = ['Möbler', 'Förvaring', 'Textilier', 'Detaljer'];

    const productData = {
      mobler: {
        types: ['Soffa', 'Stol', 'Bord', 'Säng', 'Byrå', 'Garderob', 'Bokhylla', 'Fåtölj'],
        brands: ['IKEA', 'Mio', 'Ellos', 'Jysk', 'Designtorget', 'Svenskt Tenn'],
        adjectives: ['Bekväm', 'Stilren', 'Modern', 'Klassisk', 'Robust', 'Elegant']
      },
      forvaring: {
        types: ['Låda', 'Korg', 'Hylla', 'Skåp', 'Organizer', 'Box'],
        brands: ['IKEA', 'Elfa', 'String', 'Nomess', 'Hay'],
        adjectives: ['Praktisk', 'Snygg', 'Funktionell', 'Diskret', 'Flexibel']
      },
      textilier: {
        types: ['Kudde', 'Pläd', 'Matta', 'Gardin', 'Överkast', 'Handduk'],
        brands: ['H&M Home', 'Zara Home', 'Linum', 'Lexington', 'Gant Home'],
        adjectives: ['Mjuk', 'Varm', 'Lyxig', 'Bekväm', 'Stilfull']
      },
      detaljer: {
        types: ['Vas', 'Ljusstake', 'Spegel', 'Tavla', 'Skulptur', 'Prydnad'],
        brands: ['Designtorget', 'Svenskt Tenn', 'Hay', 'Muuto', 'Normann Copenhagen'],
        adjectives: ['Elegant', 'Unik', 'Konstnärlig', 'Påfallande', 'Vacker', 'Stilfull']
      }
    };

    // Use the actual image files you have (1-11)
    const imageFiles = Array.from({ length: 11 }, (_, i) => `freaky-furniture-ai-cs-${i + 1}.jpg`);

    const products: Product[] = [];
    let productId = 1;

    categories.forEach((category, catIndex) => {
      const categoryData = productData[category as keyof typeof productData];
      const productsPerCategory = 25; // Distribute 100 products across 4 categories

      for (let i = 0; i < productsPerCategory; i++) {
        const type = categoryData.types[Math.floor(Math.random() * categoryData.types.length)];
        const brand = categoryData.brands[Math.floor(Math.random() * categoryData.brands.length)];
        const adjective = categoryData.adjectives[Math.floor(Math.random() * categoryData.adjectives.length)];

        const name = `${adjective} ${type}`;
        const price = Math.floor(Math.random() * 5000) + 200;
        const urlSlug = name.toLowerCase().replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/\s+/g, '-');
        const publishingDate = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString();

        // Use actual product images, cycling through available images
        const imageFile = imageFiles[(productId - 1) % imageFiles.length];
        const imageUrl = `${this.baseImageUrl}/${category}/${imageFile}`;

        console.log(`🖼️ Generated image URL for ${name}: ${imageUrl}`);

        products.push({
          id: productId,
          name,
          categoryName: categoryNames[catIndex],
          price,
          description: this.generateRichDescription(name, brand, category, type),
          image: imageUrl,
          urlSlug,
          brand,
          sku: `FREAKY-${category.toUpperCase()}-${String(productId).padStart(3, '0')}`,
          categoryId: catIndex + 1, // Maps to 1, 2, 3, 4
          publishingDate: new Date(publishingDate)
        });

        productId++;
      }
    });

    const shuffledProducts = this.shuffleArray(products);
    console.log(`✅ Generated ${shuffledProducts.length} dynamic products across ${categories.length} categories`);

    return shuffledProducts;
  }

  private generateRichDescription(name: string, brand: string, category: string, productType: string): string {
    const features = [
      'Made with premium materials', 'Designed for modern living', 'Handcrafted with attention to detail',
      'Sustainable and eco-friendly', 'Easy to maintain', 'Durable construction',
      'Unique artistic design', 'Perfect for contemporary spaces', 'Statement piece',
      'Conversation starter', 'Bold visual impact', 'Transforms any room'
    ];

    const benefits = [
      'Adds personality to your space', 'Creates a focal point', 'Enhances your interior design',
      'Reflects your individual style', 'Built to last for years', 'Comfortable and functional',
      'Perfect for entertaining', 'Makes everyday living more beautiful', 'Inspires creativity',
      'Brings joy to your daily routine', 'Elevates your home aesthetic'
    ];

    const selectedFeatures = this.getRandomItems(features, 2);
    const selectedBenefits = this.getRandomItems(benefits, 2);

    return `Extraordinary ${name.toLowerCase()} from ${brand} that defies conventional design rules. ${selectedFeatures.join('. ')}. This ${productType.toLowerCase()} ${selectedBenefits.join(' and ')}. Perfect for those who embrace bold, unconventional style and want to make their space truly unique.`;
  }

  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Add cache to prevent infinite loops
  private cachedMockProducts: Product[] | null = null;

  private getCachedMockProducts(): Product[] {
    if (this.cachedMockProducts === null) {
      this.cachedMockProducts = this.generateLargeProductCatalog();
    }
    return this.cachedMockProducts;
  }
}
