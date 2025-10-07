import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css']
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
    this.router.navigate(['admin/edit-product', id]);
  }

  handleDelete(id: number): void {
    console.log('Delete product with ID:', id);
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          // Refresh the list
          this.ngOnInit();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }

  navigateToNewProduct(): void {
    this.router.navigate(['admin/new-product']);
  }
}
