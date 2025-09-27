import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    // Mock JWT token (base64 encoded payload with test data)
    const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoidGVzdHVzZXIiLCJyb2xlIjoidXNlciIsImV4cCI6OTk5OTk5OTk5OX0.fake-signature';

    const mockResponse = {
      accessToken: mockJwtToken,
      tokenType: 'Bearer',
      expiresIn: 3600
    };

    service.login('testuser', 'password').subscribe(response => {
      expect(response.token).toBe(mockJwtToken);
      expect(response.role).toBe('user');
      expect(response.username).toBe('testuser');
    });

    const req = httpMock.expectOne('http://localhost:5186/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'password' });
    req.flush(mockResponse);
  });

  it('should register successfully', () => {
    // Mock JWT token for registration response
    const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJuYW1lIjoibmV3dXNlciIsInJvbGUiOiJ1c2VyIiwiZXhwIjo5OTk5OTk5OTk5fQ.fake-signature';

    const mockResponse = {
      accessToken: mockJwtToken,
      tokenType: 'Bearer',
      expiresIn: 3600
    };

    service.register('newuser', 'password123', 'password123').subscribe(response => {
      expect(response.token).toBe(mockJwtToken);
      expect(response.role).toBe('user');
      expect(response.username).toBe('newuser');
    });

    const req = httpMock.expectOne('http://localhost:5186/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'newuser',
      password: 'password123',
      confirmPassword: 'password123'
    });
    req.flush(mockResponse);
  });

  it('should logout successfully', () => {
    // Set initial data
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('role', 'user');
    localStorage.setItem('username', 'testuser');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
    expect(service.getToken()).toBeNull();
    expect(service.getRole()).toBeNull();
    expect(service.getUsername()).toBeNull();
  });

  it('should check if user is authenticated', () => {
    // Test with no token
    expect(service.isAuthenticated()).toBeFalsy();

    // Test with valid token (far future expiry)
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoidGVzdCIsInJvbGUiOiJ1c2VyIiwiZXhwIjo5OTk5OTk5OTk5fQ.fake-signature';
    localStorage.setItem('token', validToken);
    service = TestBed.inject(AuthService); // Reinitialize to load token

    expect(service.isAuthenticated()).toBeTruthy();
  });

  it('should check if user is admin', () => {
    // Test with regular user
    localStorage.setItem('role', 'user');
    service = TestBed.inject(AuthService);
    expect(service.isAdmin()).toBeFalsy();

    // Test with admin user
    localStorage.clear();
    localStorage.setItem('role', 'admin');
    service = TestBed.inject(AuthService);
    expect(service.isAdmin()).toBeTruthy();
  });

  it('should handle login error', () => {
    const errorResponse = { error: 'Invalid credentials' };

    service.login('wronguser', 'wrongpass').subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.message).toBe('Invalid credentials');
      }
    });

    const req = httpMock.expectOne('http://localhost:5186/api/auth/login');
    req.flush(errorResponse, { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle register error', () => {
    const errorResponse = { error: 'Username already exists' };

    service.register('existinguser', 'password123', 'password123').subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.message).toBe('Username already exists');
      }
    });

    const req = httpMock.expectOne('http://localhost:5186/api/auth/register');
    req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
  });
});
