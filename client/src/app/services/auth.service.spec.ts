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
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockResponse = {
      id: 1,
      username: 'testuser',
      role: 'user',
      token: 'mock-jwt-token'
    };

    service.login('testuser', 'password').subscribe(response => {
      expect(response.token).toBe('mock-jwt-token');
      expect(response.role).toBe('user');
    });

    const req = httpMock.expectOne('http://localhost:5186/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'password' });
    req.flush(mockResponse);
  });

  it('should register successfully', () => {
    const mockResponse = { message: 'User registered successfully' };

    service.register('newuser', 'password').subscribe(response => {
      expect(response.message).toBe('User registered successfully');
    });

    const req = httpMock.expectOne('http://localhost:5186/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'newuser', password: 'password', role: 'user' });
    req.flush(mockResponse);
  });
});
