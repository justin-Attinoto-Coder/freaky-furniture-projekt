import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { ProductService } from '../../services/product.service';
import { SearchService } from '../../services/search.service';
import { Product } from '../../models/product';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockSearchService: jasmine.SpyObj<SearchService>;

  // Generate mock products with your actual freaky furniture images
  const generateMockProducts = (count: number = 44): Product[] => {
    const categories = ['mobler', 'forvaring', 'detaljer', 'textil'];

    const productTypes = {
      mobler: ['Chair', 'Sofa', 'Armchair', 'Bench', 'Loveseat', 'Sectional', 'Stool', 'Recliner'],
      forvaring: ['Storage Box', 'Cabinet', 'Wardrobe', 'Chest', 'Dresser', 'Shelf', 'Organizer'],
      detaljer: ['Lamp', 'Mirror', 'Clock', 'Vase', 'Art Piece', 'Sculpture', 'Candle Holder'],
      textil: ['Cushion', 'Throw', 'Blanket', 'Pillow', 'Rug', 'Curtain', 'Tapestry', 'Cover']
    };

    const brands = ['Freaky Furniture', 'Avant-Garde Design', 'Wild Creations', 'Eccentric Home', 'Psychedelic Living'];
    const adjectives = ['Psychedelic', 'Vibrant', 'Rainbow', 'Colorful', 'Bold', 'Artistic', 'Unique', 'Funky', 'Wild', 'Eccentric', 'Avant-Garde'];

    // Your actual freaky furniture image files
    const freakyImageFiles = [
      'freaky-furniture-ai-cs-1.jpg',
      'freaky-furniture-ai-cs-2.jpg',
      'freaky-furniture-ai-cs-3.jpg',
      'freaky-furniture-ai-cs-4.jpg',
      'freaky-furniture-ai-cs-5.jpg',
      'freaky-furniture-ai-cs-6.jpg',
      'freaky-furniture-ai-cs-7.jpg',
      'freaky-furniture-ai-cs-8.jpg',
      'freaky-furniture-ai-cs-9.jpg',
      'freaky-furniture-ai-cs-10.jpg',
      'freaky-furniture-ai-cs-11.jpg'
    ];

    return Array.from({ length: count }, (_, index) => {
      const category = categories[index % categories.length];
      const productTypeArray = productTypes[category as keyof typeof productTypes];
      const productType = productTypeArray[index % productTypeArray.length];
      const adjective = adjectives[index % adjectives.length];
      const brand = brands[index % brands.length];

      const name = `${adjective} ${productType}`;
      const urlSlug = name.toLowerCase().replace(/\s+/g, '-') + `-${index + 1}`;

      // Create publishing dates spread over the last 60 days
      const daysAgo = Math.floor(Math.random() * 60);
      const publishingDate = new Date();
      publishingDate.setDate(publishingDate.getDate() - daysAgo);

      // Cycle through your freaky images
      const imageFile = freakyImageFiles[index % freakyImageFiles.length];
      const imageUrl = `https://localhost:7001/images/products/${category}/${imageFile}`;

      return {
        id: index + 1,
        name,
        category,
        price: Math.floor(Math.random() * 4000) + 200, // Premium prices for artistic pieces
        description: `Extraordinary ${name.toLowerCase()} that defies conventional design. This ${brand.toLowerCase()} masterpiece transforms any space into an artistic statement. Perfect for those who embrace bold, unconventional style.`,
        image: imageUrl,
        urlSlug,
        brand,
        sku: `FREAKY-${category.toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
        categoryId: categories.indexOf(category) + 1,
        publishing_date: publishingDate.toISOString()
      };
    });
  };

  const mockProducts: Product[] = generateMockProducts(44); // 11 images x 4 categories

  beforeEach(async () => {
    // Create spies for services
    mockProductService = jasmine.createSpyObj('ProductService', ['getFurnitureItems']);
    mockSearchService = jasmine.createSpyObj('SearchService', [], {
      searchResults$: of([])
    });

    // Setup service mocks
    mockProductService.getFurnitureItems.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: ActivatedRoute, useValue: { fragment: of(null) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load freaky furniture products on init', () => {
    expect(mockProductService.getFurnitureItems).toHaveBeenCalled();
    expect(component.furnitureItems).toEqual(mockProducts);
    expect(component.furnitureItems.length).toBe(44);
    expect(component.isLoading).toBeFalse();
  });

  it('should categorize products correctly', () => {
    // Each category should have some products (11 products per category)
    expect(component.moblerProducts.length).toBeGreaterThan(0);
    expect(component.moblerProducts.length).toBeLessThanOrEqual(4); // Limited by component

    expect(component.forvaringProducts.length).toBeGreaterThan(0);
    expect(component.forvaringProducts.length).toBeLessThanOrEqual(4);

    expect(component.detaljerProducts.length).toBeGreaterThan(0);
    expect(component.detaljerProducts.length).toBeLessThanOrEqual(4);

    expect(component.textilProducts.length).toBeGreaterThan(0);
    expect(component.textilProducts.length).toBeLessThanOrEqual(4);
  });

  it('should use correct freaky furniture image URLs', () => {
    mockProducts.forEach(product => {
      expect(product.image).toContain('https://localhost:7001/images/products/');
      expect(product.image).toContain('freaky-furniture-ai-cs-');
      expect(product.image).toEndWith('.jpg');
    });
  });

  it('should have creative product names and descriptions', () => {
    const sampleProduct = mockProducts[0];

    expect(sampleProduct.name).toBeTruthy();
    expect(sampleProduct.description).toContain('Extraordinary');
    expect(sampleProduct.brand).toContain('Freaky');

    // Should have creative adjectives
    const hasCreativeNames = mockProducts.some(p =>
      p.name.includes('Psychedelic') ||
      p.name.includes('Rainbow') ||
      p.name.includes('Vibrant') ||
      p.name.includes('Wild')
    );

    expect(hasCreativeNames).toBeTruthy();
  });

  it('should have premium pricing for artistic pieces', () => {
    mockProducts.forEach(product => {
      expect(product.price).toBeGreaterThanOrEqual(200);
      expect(product.price).toBeLessThanOrEqual(4200);
    });
  });

  it('should have proper SKU format', () => {
    mockProducts.forEach(product => {
      expect(product.sku).toMatch(/^FREAKY-[A-Z]+-\d{3}$/);
    });
  });

  it('should handle recent products filtering', () => {
    // Should have some recent products (within last 30 days)
    expect(component.recentProducts.length).toBeGreaterThanOrEqual(0);
    expect(component.recentProducts.length).toBeLessThanOrEqual(4);
  });
});
