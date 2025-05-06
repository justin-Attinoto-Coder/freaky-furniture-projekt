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
    this.authService.getUserData().subscribe({
      next: data => {
        this.userData = data;
      },
      error: () => {
        this.error = 'Failed to fetch user data';
      }
    });
  }
}
