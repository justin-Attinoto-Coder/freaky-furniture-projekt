import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faLock, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule]
})
export class LoginPageComponent {
  isLoginMode = true; // Toggle between login and registration
  username = '';
  password = '';
  error = '';
  success = '';
  faUser = faUser;
  faLock = faLock;
  faSignInAlt = faSignInAlt;
  faUserPlus = faUserPlus;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.success = '';
    this.username = '';
    this.password = '';
  }

  handleLogin(event: Event): void {
    event.preventDefault();
    this.error = '';
    this.success = '';

    this.authService.login(this.username, this.password).subscribe({
      next: response => {
        const from = this.route.snapshot.queryParams['from'] || '/';
        if (response.role.toLowerCase().includes('admin')) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate([from]);
        }
      },
      error: error => {
        this.error = error.message || 'An error occurred. Please try again.';
      }
    });
  }

  handleRegister(event: Event): void {
    event.preventDefault();
    this.error = '';
    this.success = '';

    this.authService.register(this.username, this.password).subscribe({
      next: response => {
        this.success = response.message || 'Registration successful! Please log in.';
        this.isLoginMode = true; // Switch to login mode
        this.username = '';
        this.password = '';
      },
      error: error => {
        this.error = error.message || 'An error occurred. Please try again.';
      }
    });
  }
}
