import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-table', // Corrected selector
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css'],
  standalone: true,
  imports: [CommonModule, FaIconComponent]
})
export class AdminTableComponent implements OnInit {
  furniture: Product[] = [];
  faEdit = faEdit;
  faTrash = faTrash;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productService.getFurnitureItems().subscribe({
      next: items => {
        this.furniture = items;
      },
      error: error => {
        console.error('Error fetching furniture data:', error);
      }
    });
  }

  handleEdit(id: number): void {
    console.log('Edit product with ID:', id);
    // Navigate to edit page (not implemented)
  }

  handleDelete(id: number): void {
    console.log('Delete product with ID:', id);
    // Implement delete logic if needed
  }

  navigateToNewProduct(): void {
    this.router.navigate(['admin/products/new']);
  }
}
