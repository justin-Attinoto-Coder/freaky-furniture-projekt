import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './admin-topbar.component.html',
  styleUrls: ['./admin-topbar.component.css']
})
export class AdminTopbarComponent {
  faSignOutAlt = faSignOutAlt;

  constructor(private router: Router) {}

  logout() {
    console.log('AdminTopbar: Logging out');
    localStorage.removeItem('authToken'); // Remove token if used
    this.router.navigate(['/login']);
  }
}
