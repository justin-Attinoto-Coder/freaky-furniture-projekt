import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faLock, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  isLoginMode = true;
  username = '';
  password = '';
  confirmPassword = '';
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
    this.confirmPassword = '';
  }

  handleLogin(event: Event): void {
    event.preventDefault();
    this.error = '';
    this.success = '';

    // Validation
    if (!this.username || !this.password) {
      this.error = 'Please enter username and password.';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: response => {
        const from = this.route.snapshot.queryParams['from'] || '/';

        // Fixed: Add null check and use response.role directly
        if (response && response.role && response.role.toLowerCase() === 'admin') {
          this.router.navigate(['/admin/table']);
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

    // Validation
    if (!this.username || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    this.authService.register(this.username, this.password, this.confirmPassword).subscribe({
      next: response => {
        // Updated: Register now returns token, auto-login user
        this.success = 'Registration successful! Redirecting...';

        const from = this.route.snapshot.queryParams['from'] || '/';
        setTimeout(() => {
          if (response && response.role && response.role.toLowerCase() === 'admin') {
            this.router.navigate(['/admin/table']);
          } else {
            this.router.navigate([from]);
          }
        }, 1500);
      },
      error: error => {
        this.error = error.message || 'An error occurred. Please try again.';
      }
    });
  }
}
