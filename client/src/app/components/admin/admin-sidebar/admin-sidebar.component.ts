import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  faBox = faBox;
  faPlus = faPlus;

  constructor(private router: Router) {}

  navigateToManageProducts() {
    this.router.navigate(['/admin/table']);
  }

  navigateToAddProduct() {
    this.router.navigate(['/admin/new-product']);
  }
}
