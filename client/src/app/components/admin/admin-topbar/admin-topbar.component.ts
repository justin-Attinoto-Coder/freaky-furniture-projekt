import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-topbar.component.html',
  styleUrls: ['./admin-topbar.component.css']
})
export class AdminTopbarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
