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
  private apiUrl = 'https://localhost:7001/api/products';
  private baseImageUrl = 'https://localhost:7001/images/products';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getFurnitureItems(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(products => {
        console.log('✅ Products loaded from API:', products.length);
      }),
      catchError(error => {
        console.warn('⚠️ API not available, using generated mock data:', error.message);
        return of(this.generateLargeProductCatalog());
      })
    );
  }

  getProducts(): Observable<Product[]> {
    return this.getFurnitureItems();
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap(product => {
        console.log('✅ Product loaded:', product.name);
      }),
      catchError(error => {
        console.warn(`⚠️ Product ${id} not found, using mock data:`, error.message);
        const mockProduct = this.generateLargeProductCatalog().find(p => p.id === id);
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
          categoryName: this.getCategoryStringFromId(productData.categoryId), // FIXED: category -> categoryName
          price: productData.price,
          description: productData.description,
          image: productData.image,
          urlSlug: productData.urlSlug,
          brand: productData.brand,
          sku: productData.sku,
          categoryId: productData.categoryId,
          publishingDate: new Date() // FIXED: publishing_date -> publishingDate (and Date object instead of string)
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
      map(products => products.filter(p => p.categoryName === category)) // FIXED: category -> categoryName
    );
  }

  // Fix: Handle optional brand property safely
  searchProducts(query: string): Observable<Product[]> {
    return this.getFurnitureItems().pipe(
      map(products => products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(query.toLowerCase())) // Fixed: Check if brand exists
      ))
    );
  }

  private getCategoryStringFromId(categoryId: number): string {
    const categoryMap: { [key: number]: string } = {
      1: 'Möbler',      // Changed to proper category names
      2: 'Förvaring',
      3: 'Dekoration',
      4: 'Textilier'
    };
    return categoryMap[categoryId] || 'Möbler';
  }

  private generateLargeProductCatalog(): Product[] {
    console.log('🎨 Generating large freaky furniture catalog...');

    const categories = ['mobler', 'forvaring', 'dekoration', 'textilier']; // Updated category slugs
    const categoryNames = ['Möbler', 'Förvaring', 'Dekoration', 'Textilier']; // Proper Swedish names

    const productData = {
      mobler: {
        types: [
          'Chair', 'Sofa', 'Armchair', 'Bench', 'Loveseat', 'Sectional', 'Stool', 'Recliner',
          'Ottoman', 'Chaise', 'Dining Chair', 'Accent Chair', 'Bar Stool', 'Lounge Chair',
          'Rocking Chair', 'Swivel Chair', 'Bean Bag', 'Floor Cushion', 'Pouf', 'Daybed',
          'Futon', 'Sleeper Sofa', 'Modular Sofa', 'Corner Sofa', 'Chesterfield'
        ],
        basePrice: 1200,
        priceRange: 4000
      },
      forvaring: {
        types: [
          'Storage Box', 'Cabinet', 'Wardrobe', 'Chest', 'Dresser', 'Shelf', 'Organizer',
          'Bookcase', 'Sideboard', 'Credenza', 'Armoire', 'Hutch', 'Storage Bench',
          'TV Stand', 'Media Console', 'Display Cabinet', 'Curio Cabinet', 'Wine Rack',
          'Storage Ottoman', 'Storage Trunk', 'File Cabinet', 'Shoe Rack', 'Coat Rack',
          'Storage Cart', 'Pantry Cabinet'
        ],
        basePrice: 600,
        priceRange: 2800
      },
      dekoration: { // Changed from 'detaljer'
        types: [
          'Lamp', 'Mirror', 'Clock', 'Vase', 'Art Piece', 'Sculpture', 'Candle Holder',
          'Plant Pot', 'Frame', 'Wall Art', 'Table Lamp', 'Floor Lamp', 'Pendant Light',
          'Chandelier', 'Sconce', 'Decorative Bowl', 'Figurine', 'Wind Chime',
          'Wall Clock', 'Desk Clock', 'Photo Frame', 'Jewelry Box', 'Bookend',
          'Decorative Tray', 'Ornament'
        ],
        basePrice: 150,
        priceRange: 1500
      },
      textilier: { // Changed from 'textil'
        types: [
          'Cushion', 'Throw', 'Blanket', 'Pillow', 'Rug', 'Curtain', 'Tapestry', 'Cover',
          'Bedding', 'Sheet Set', 'Duvet Cover', 'Pillowcase', 'Throw Pillow', 'Floor Pillow',
          'Table Runner', 'Placemat', 'Napkin', 'Tablecloth', 'Window Treatment', 'Valance',
          'Room Divider', 'Wall Hanging', 'Bath Towel', 'Hand Towel', 'Bath Mat'
        ],
        basePrice: 80,
        priceRange: 800
      }
    };

    const brands = [
      'Freaky Furniture', 'Avant-Garde Design', 'Wild Creations', 'Eccentric Home',
      'Psychedelic Living', 'Bold Interiors', 'Artistic Spaces', 'Unique Designs',
      'Kaleidoscope Home', 'Neon Dreams', 'Electric Aesthetics', 'Cosmic Comfort',
      'Rainbow Living', 'Prismatic Design', 'Abstract Spaces', 'Surreal Style'
    ];

    const adjectives = [
      'Psychedelic', 'Vibrant', 'Rainbow', 'Colorful', 'Bold', 'Artistic', 'Unique', 'Funky',
      'Wild', 'Eccentric', 'Avant-Garde', 'Electric', 'Neon', 'Surreal', 'Abstract',
      'Kaleidoscope', 'Prismatic', 'Cosmic', 'Holographic', 'Iridescent', 'Fluorescent',
      'Glowing', 'Shimmering', 'Sparkling', 'Dazzling', 'Radiant', 'Luminous', 'Brilliant'
    ];

    const qualityDescriptors = [
      'Premium', 'Luxury', 'Deluxe', 'Professional', 'Designer', 'Custom', 'Handcrafted',
      'Artisan', 'Limited Edition', 'Signature', 'Exclusive', 'Masterpiece', 'Collector\'s'
    ];

    const imageFiles = Array.from({ length: 11 }, (_, i) => `freaky-furniture-ai-cs-${i + 1}.jpg`);

    const products: Product[] = [];
    let productId = 1;

    categories.forEach((category, catIndex) => {
      const categoryData = productData[category as keyof typeof productData];
      const productsPerCategory = 25;

      for (let i = 0; i < productsPerCategory; i++) {
        const productType = categoryData.types[i % categoryData.types.length];
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const quality = qualityDescriptors[Math.floor(Math.random() * qualityDescriptors.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];

        const name = Math.random() > 0.7 ?
          `${quality} ${adjective} ${productType}` :
          `${adjective} ${productType}`;

        const urlSlug = name.toLowerCase()
          .replace(/'/g, '')
          .replace(/\s+/g, '-') + `-${productId}`;

        const daysAgo = Math.floor(Math.random() * 120);
        const publishingDate = new Date();
        publishingDate.setDate(publishingDate.getDate() - daysAgo);

        const imageFile = imageFiles[(productId - 1) % imageFiles.length];
        const imageUrl = `${this.baseImageUrl}/${category}/${imageFile}`;

        const basePriceMultiplier = name.includes('Premium') || name.includes('Luxury') ? 1.5 : 1;
        const price = Math.floor((categoryData.basePrice + Math.floor(Math.random() * categoryData.priceRange)) * basePriceMultiplier);

        products.push({
          id: productId,
          name,
          categoryName: categoryNames[catIndex], // FIXED: category -> categoryName with proper Swedish name
          price,
          description: this.generateRichDescription(name, brand, category, productType),
          image: imageUrl,
          urlSlug,
          brand, // Always set brand - it's not optional in our generated data
          sku: `FREAKY-${category.toUpperCase()}-${String(productId).padStart(3, '0')}`,
          categoryId: catIndex + 1,
          publishingDate: publishingDate // FIXED: publishing_date -> publishingDate (Date object)
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
}
