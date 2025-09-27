import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../../services/auth.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = {
      snapshot: {
        queryParams: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginPageComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in login mode', () => {
    expect(component.isLoginMode).toBe(true);
    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(component.confirmPassword).toBe('');
  });

  it('should toggle between login and register modes', () => {
    component.username = 'test';
    component.password = 'test';
    component.confirmPassword = 'test';
    component.error = 'some error';

    component.toggleMode();

    expect(component.isLoginMode).toBe(false);
    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(component.confirmPassword).toBe('');
    expect(component.error).toBe('');
  });

  describe('handleLogin', () => {
    it('should show error if username is empty', () => {
      component.username = '';
      component.password = 'password';

      const event = new Event('submit');
      component.handleLogin(event);

      expect(component.error).toBe('Please enter username and password.');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should show error if password is empty', () => {
      component.username = 'username';
      component.password = '';

      const event = new Event('submit');
      component.handleLogin(event);

      expect(component.error).toBe('Please enter username and password.');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should login successfully and navigate to home for regular user', () => {
      component.username = 'testuser';
      component.password = 'password';

      const mockResponse = {
        token: 'mock-token',
        role: 'user',
        username: 'testuser'
      };

      authService.login.and.returnValue(of(mockResponse));

      const event = new Event('submit');
      component.handleLogin(event);

      expect(authService.login).toHaveBeenCalledWith('testuser', 'password');
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should login successfully and navigate to admin panel for admin user', () => {
      component.username = 'admin';
      component.password = 'password';

      const mockResponse = {
        token: 'mock-token',
        role: 'admin',
        username: 'admin'
      };

      authService.login.and.returnValue(of(mockResponse));

      const event = new Event('submit');
      component.handleLogin(event);

      expect(authService.login).toHaveBeenCalledWith('admin', 'password');
      expect(router.navigate).toHaveBeenCalledWith(['/admin/table']);
    });

    it('should handle login error', () => {
      component.username = 'testuser';
      component.password = 'wrongpassword';

      const errorResponse = new Error('Invalid credentials');
      authService.login.and.returnValue(throwError(() => errorResponse));

      const event = new Event('submit');
      component.handleLogin(event);

      expect(component.error).toBe('Invalid credentials');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('handleRegister', () => {
    beforeEach(() => {
      component.isLoginMode = false;
    });

    it('should show error if any field is empty', () => {
      component.username = '';
      component.password = 'password';
      component.confirmPassword = 'password';

      const event = new Event('submit');
      component.handleRegister(event);

      expect(component.error).toBe('Please fill in all fields.');
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should show error if passwords do not match', () => {
      component.username = 'testuser';
      component.password = 'password';
      component.confirmPassword = 'different';

      const event = new Event('submit');
      component.handleRegister(event);

      expect(component.error).toBe('Passwords do not match.');
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should show error if password is too short', () => {
      component.username = 'testuser';
      component.password = '123';
      component.confirmPassword = '123';

      const event = new Event('submit');
      component.handleRegister(event);

      expect(component.error).toBe('Password must be at least 6 characters long.');
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should register successfully and redirect regular user', (done) => {
      component.username = 'newuser';
      component.password = 'password123';
      component.confirmPassword = 'password123';

      const mockResponse = {
        token: 'mock-token',
        role: 'user',
        username: 'newuser'
      };

      authService.register.and.returnValue(of(mockResponse));

      const event = new Event('submit');
      component.handleRegister(event);

      expect(authService.register).toHaveBeenCalledWith('newuser', 'password123', 'password123');
      expect(component.success).toBe('Registration successful! Redirecting...');

      // Wait for setTimeout to complete
      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        done();
      }, 1600);
    });

    it('should handle registration error', () => {
      component.username = 'existinguser';
      component.password = 'password123';
      component.confirmPassword = 'password123';

      const errorResponse = new Error('Username already exists');
      authService.register.and.returnValue(throwError(() => errorResponse));

      const event = new Event('submit');
      component.handleRegister(event);

      expect(component.error).toBe('Username already exists');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  it('should navigate from query params on successful login', () => {
    activatedRoute.snapshot.queryParams = { from: '/products' };
    component.username = 'testuser';
    component.password = 'password';

    const mockResponse = {
      token: 'mock-token',
      role: 'user',
      username: 'testuser'
    };

    authService.login.and.returnValue(of(mockResponse));

    const event = new Event('submit');
    component.handleLogin(event);

    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});
