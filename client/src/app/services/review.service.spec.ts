import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService, Review, NewReview, ApiResponse } from './review.service';
import { AuthService } from './auth.service';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReviewService,
        { provide: AuthService, useValue: authSpy }
      ]
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should include auth headers when token exists', () => {
    mockAuthService.getToken.and.returnValue('test-token');

    service.getReviewsByProductId(1).subscribe();

    const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/1');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush([]);
  });

  it('should handle missing auth token', () => {
    mockAuthService.getToken.and.returnValue(null);

    service.getReviewsByProductId(1).subscribe();

    const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/1');
    expect(req.request.headers.get('Authorization')).toBe('');
    req.flush([]);
  });

  describe('getReviewsByProductId', () => {
    it('should get reviews for a specific product', () => {
      const mockReviews: Review[] = [
        {
          id: 1,
          productId: 6,
          rating: 5,
          reviewText: 'Amazing quality! This exceeded all my expectations.',
          reviewerName: 'Sarah Johnson',
          createdAt: '2024-01-01T10:00:00Z'
        },
        {
          id: 2,
          productId: 6,
          rating: 4,
          reviewText: 'Really happy with this purchase!',
          reviewerName: 'Mike Wilson',
          createdAt: '2024-01-02T14:30:00Z'
        }
      ];

      service.getReviewsByProductId(6).subscribe((reviews: Review[]) => {
        expect(reviews).toEqual(mockReviews);
        expect(reviews.length).toBe(2);
        expect(reviews[0].productId).toBe(6);
        expect(reviews[1].productId).toBe(6);
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/6');
      expect(req.request.method).toBe('GET');
      req.flush(mockReviews);
    });

    it('should handle empty reviews array', () => {
      const mockReviews: Review[] = [];

      service.getReviewsByProductId(999).subscribe((reviews: Review[]) => {
        expect(reviews).toEqual([]);
        expect(reviews.length).toBe(0);
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/999');
      expect(req.request.method).toBe('GET');
      req.flush(mockReviews);
    });

    it('should handle different product IDs correctly', () => {
      const mockReviews: Review[] = [
        {
          id: 10,
          productId: 42,
          rating: 3,
          reviewText: 'Average product, could be better.',
          reviewerName: 'John Doe',
          createdAt: '2024-01-03T09:15:00Z'
        }
      ];

      service.getReviewsByProductId(42).subscribe((reviews: Review[]) => {
        expect(reviews).toEqual(mockReviews);
        expect(reviews[0].productId).toBe(42);
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/42');
      expect(req.request.method).toBe('GET');
      req.flush(mockReviews);
    });

    it('should handle API error for getReviewsByProductId', () => {
      service.getReviewsByProductId(1).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/1');
      req.flush('Reviews not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getAverageRating', () => {
    it('should get average rating and total reviews for a product', () => {
      const mockAverageResponse = {
        averageRating: 4.5,
        totalReviews: 10
      };

      service.getAverageRating(6).subscribe((response) => {
        expect(response.averageRating).toBe(4.5);
        expect(response.totalReviews).toBe(10);
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/6/average');
      expect(req.request.method).toBe('GET');
      req.flush(mockAverageResponse);
    });

    it('should handle product with no reviews', () => {
      const mockAverageResponse = {
        averageRating: 0,
        totalReviews: 0
      };

      service.getAverageRating(999).subscribe((response) => {
        expect(response.averageRating).toBe(0);
        expect(response.totalReviews).toBe(0);
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/999/average');
      expect(req.request.method).toBe('GET');
      req.flush(mockAverageResponse);
    });

    it('should handle perfect rating (5.0)', () => {
      const mockAverageResponse = {
        averageRating: 5.0,
        totalReviews: 3
      };

      service.getAverageRating(1).subscribe((response) => {
        expect(response.averageRating).toBe(5.0);
        expect(response.totalReviews).toBe(3);
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/1/average');
      expect(req.request.method).toBe('GET');
      req.flush(mockAverageResponse);
    });

    it('should handle minimum rating (1.0)', () => {
      const mockAverageResponse = {
        averageRating: 1.0,
        totalReviews: 2
      };

      service.getAverageRating(5).subscribe((response) => {
        expect(response.averageRating).toBe(1.0);
        expect(response.totalReviews).toBe(2);
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/5/average');
      expect(req.request.method).toBe('GET');
      req.flush(mockAverageResponse);
    });

    it('should handle decimal ratings correctly', () => {
      const mockAverageResponse = {
        averageRating: 3.7,
        totalReviews: 15
      };

      service.getAverageRating(10).subscribe((response) => {
        expect(response.averageRating).toBe(3.7);
        expect(response.totalReviews).toBe(15);
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/10/average');
      expect(req.request.method).toBe('GET');
      req.flush(mockAverageResponse);
    });

    it('should handle API error for getAverageRating', () => {
      service.getAverageRating(1).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/1/average');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('API URL construction', () => {
    it('should construct correct URL for getReviewsByProductId', () => {
      const productId = 123;

      service.getReviewsByProductId(productId).subscribe();

      const req = httpMock.expectOne(`http://localhost:5186/api/reviews/product/${productId}`);
      expect(req.request.url).toBe('http://localhost:5186/api/reviews/product/123');
      req.flush([]);
    });

    it('should construct correct URL for getAverageRating', () => {
      const productId = 456;

      service.getAverageRating(productId).subscribe();

      const req = httpMock.expectOne(`http://localhost:5186/api/reviews/product/${productId}/average`);
      expect(req.request.url).toBe('http://localhost:5186/api/reviews/product/456/average');
      req.flush({ averageRating: 0, totalReviews: 0 });
    });
  });

  describe('Review data validation', () => {
    it('should handle reviews with all required fields', () => {
      const mockReview: Review = {
        id: 1,
        productId: 1,
        rating: 5,
        reviewText: 'Excellent product!',
        reviewerName: 'Test User',
        createdAt: '2024-01-01T12:00:00Z'
      };

      service.getReviewsByProductId(1).subscribe((reviews: Review[]) => {
        expect(reviews[0].id).toBeDefined();
        expect(reviews[0].productId).toBeDefined();
        expect(reviews[0].rating).toBeDefined();
        expect(reviews[0].reviewText).toBeDefined();
        expect(reviews[0].reviewerName).toBeDefined();
        expect(reviews[0].createdAt).toBeDefined();
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/1');
      req.flush([mockReview]);
    });

    it('should handle reviews without optional createdAt field', () => {
      const mockReview: Review = {
        id: 1,
        productId: 1,
        rating: 4,
        reviewText: 'Good product!',
        reviewerName: 'Test User'
        // createdAt is optional
      };

      service.getReviewsByProductId(1).subscribe((reviews: Review[]) => {
        expect(reviews[0].createdAt).toBeUndefined();
        expect(reviews[0].rating).toBe(4);
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/1');
      req.flush([mockReview]);
    });

    it('should handle reviews with valid rating range (1-5)', () => {
      const mockReviews: Review[] = [
        { id: 1, productId: 1, rating: 1, reviewText: 'Poor', reviewerName: 'User1' },
        { id: 2, productId: 1, rating: 3, reviewText: 'Average', reviewerName: 'User2' },
        { id: 3, productId: 1, rating: 5, reviewText: 'Perfect', reviewerName: 'User3' }
      ];

      service.getReviewsByProductId(1).subscribe((reviews: Review[]) => {
        expect(reviews[0].rating).toBe(1);
        expect(reviews[1].rating).toBe(3);
        expect(reviews[2].rating).toBe(5);

        // Verify all ratings are within valid range
        reviews.forEach(review => {
          expect(review.rating).toBeGreaterThanOrEqual(1);
          expect(review.rating).toBeLessThanOrEqual(5);
        });
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/1');
      req.flush(mockReviews);
    });
  });

  describe('Network error handling', () => {
    it('should handle network error for getReviewsByProductId', () => {
      service.getReviewsByProductId(1).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.error).toBeInstanceOf(ErrorEvent);
        }
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/1');
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle network error for getAverageRating', () => {
      service.getAverageRating(1).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.error).toBeInstanceOf(ErrorEvent);
        }
      });

      const req = httpMock.expectOne('http://localhost:5186/api/reviews/product/1/average');
      req.error(new ErrorEvent('Network error'));
    });
  });
});
