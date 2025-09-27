import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

import { UserDashboardComponent } from './user-dashboard.component';
import { AuthService } from '../../../services/auth.service';

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let usernameSubject: BehaviorSubject<string | null>;
  let roleSubject: BehaviorSubject<string | null>;

  beforeEach(async () => {
    // Create BehaviorSubjects for reactive streams
    usernameSubject = new BehaviorSubject<string | null>(null);
    roleSubject = new BehaviorSubject<string | null>(null);

    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUsername',
      'getRole'
    ], {
      username$: usernameSubject.asObservable(),
      role$: roleSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        UserDashboardComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error when user is not authenticated', () => {
    // Set no user data
    usernameSubject.next(null);
    roleSubject.next(null);

    fixture.detectChanges();

    expect(component.error).toBe('User not authenticated');
    expect(component.userData).toBeNull();
  });

  it('should display user data when authenticated', () => {
    // Set user data
    usernameSubject.next('testuser');
    roleSubject.next('user');

    fixture.detectChanges();

    expect(component.userData).toEqual({
      username: 'testuser',
      role: 'user'
    });
    expect(component.error).toBe('');
  });

  it('should display admin role correctly', () => {
    // Set admin user data
    usernameSubject.next('admin');
    roleSubject.next('admin');

    fixture.detectChanges();

    expect(component.userData).toEqual({
      username: 'admin',
      role: 'admin'
    });
    expect(component.error).toBe('');
  });

  it('should update user data when auth state changes', () => {
    // Initially no user
    usernameSubject.next(null);
    roleSubject.next(null);
    fixture.detectChanges();

    expect(component.error).toBe('User not authenticated');
    expect(component.userData).toBeNull();

    // User logs in
    usernameSubject.next('newuser');
    roleSubject.next('user');
    fixture.detectChanges();

    expect(component.userData).toEqual({
      username: 'newuser',
      role: 'user'
    });
    expect(component.error).toBe('');
  });

  it('should render welcome message when user is authenticated', () => {
    usernameSubject.next('testuser');
    roleSubject.next('user');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Welcome back, testuser!');
  });

  it('should show admin panel link for admin users', () => {
    usernameSubject.next('admin');
    roleSubject.next('admin');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Admin Panel');
    expect(compiled.textContent).toContain('Go to Admin');
  });

  it('should not show admin panel link for regular users', () => {
    usernameSubject.next('user');
    roleSubject.next('user');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('Admin Panel');
  });

  it('should display error message in template', () => {
    usernameSubject.next(null);
    roleSubject.next(null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorDiv = compiled.querySelector('.bg-red-100');
    expect(errorDiv).toBeTruthy();
    expect(errorDiv?.textContent).toContain('User not authenticated');
  });

  it('should display loading state when userData is null and no error', () => {
    // Set initial state without triggering auth streams
    component.userData = null;
    component.error = '';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Loading user data...');
  });

  it('should render navigation links correctly', () => {
    usernameSubject.next('testuser');
    roleSubject.next('user');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a[routerLink]');

    // Should have products and cart links
    const linkTexts = Array.from(links).map(link => link.textContent?.trim());
    expect(linkTexts).toContain('View Products →');
    expect(linkTexts).toContain('View Cart →');
  });

  it('should handle role badge styling correctly', () => {
    usernameSubject.next('admin');
    roleSubject.next('admin');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const roleBadge = compiled.querySelector('.bg-purple-100');
    expect(roleBadge).toBeTruthy();
    expect(roleBadge?.textContent?.trim()).toBe('Admin');
  });
});
