import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Review {
  id: number;
  productId: number;
  rating: number;
  reviewText: string;
  reviewerName: string;
  createdAt?: string;
  isSeeded?: boolean;
}

export interface NewReview {
  productId: number;
  rating: number;
  reviewText: string;
  reviewerName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = 'http://localhost:5186/api/reviews';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getReviewsByProductId(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/product/${productId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(reviews => {
        console.log(`✅ Reviews loaded for product ${productId}:`, reviews.length);
      }),
      catchError(error => {
        console.error(`❌ Error fetching reviews for product ${productId}:`, error);
        // Return empty array instead of throwing error
        return of([]);
      })
    );
  }

  addReview(review: NewReview): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review, {
      headers: this.getHeaders()
    }).pipe(
      tap(addedReview => {
        console.log('✅ Review added successfully:', addedReview);
      }),
      catchError(error => {
        console.error('❌ Error adding review:', error);
        throw error; // Re-throw for component to handle
      })
    );
  }

  getAverageRating(productId: number): Observable<{ averageRating: number; totalReviews: number }> {
    return this.http.get<{ averageRating: number; totalReviews: number }>(`${this.apiUrl}/product/${productId}/average`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => {
        console.log(`✅ Average rating for product ${productId}:`, data);
      }),
      catchError(error => {
        console.error(`❌ Error fetching average rating for product ${productId}:`, error);
        // Return default values instead of throwing error
        return of({ averageRating: 0, totalReviews: 0 });
      })
    );
  }

  updateReview(id: number, reviewData: Partial<NewReview>): Observable<ApiResponse<Review>> {
    return this.http.put<ApiResponse<Review>>(`${this.apiUrl}/${id}`, reviewData, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => {
        console.log('✅ Review updated successfully:', response.data);
      }),
      catchError(error => {
        console.error('❌ Error updating review:', error);
        throw error;
      })
    );
  }

  deleteReview(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => {
        console.log('✅ Review deleted successfully');
      }),
      catchError(error => {
        console.error('❌ Error deleting review:', error);
        throw error;
      })
    );
  }

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/all`, {
      headers: this.getHeaders()
    }).pipe(
      tap(reviews => {
        console.log('✅ All reviews loaded:', reviews.length);
      }),
      catchError(error => {
        console.error('❌ Error fetching all reviews:', error);
        return of([]);
      })
    );
  }

  getReviewsByRating(rating: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/rating/${rating}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(reviews => {
        console.log(`✅ Reviews with ${rating} stars loaded:`, reviews.length);
      }),
      catchError(error => {
        console.error(`❌ Error fetching reviews with ${rating} stars:`, error);
        return of([]);
      })
    );
  }
}
