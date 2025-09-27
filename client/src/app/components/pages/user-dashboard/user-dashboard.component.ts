import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

interface User {
  username: string;
  role: string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UserDashboardComponent implements OnInit {
  userData: User | null = null;
  error = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Get user data from JWT token stored locally
    const username = this.authService.getUsername();
    const role = this.authService.getRole();

    if (username && role) {
      this.userData = {
        username: username,
        role: role
      };
    } else {
      this.error = 'User not authenticated';
    }

    // Optional: Subscribe to changes in user data
    this.authService.username$.subscribe(username => {
      if (username && this.authService.getRole()) {
        this.userData = {
          username: username,
          role: this.authService.getRole()!
        };
        this.error = '';
      }
    });
  }
}
