import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

interface User {
  id: number;
  username: string;
  role: string;
}

@Component({
  selector: 'app-admin-users-table',
  templateUrl: './admin-users-table.component.html',
  styleUrls: ['./admin-users-table.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminUsersTableComponent implements OnInit {
  users: User[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.http.get<User[]>('https://freaky-angular-furniture-backend.onrender.com/api/users', {
      headers: this.authService.getHeaders()
    }).subscribe({
      next: users => {
        this.users = users;
      },
      error: error => {
        console.error('Error fetching users:', error);
      }
    });
  }
}
