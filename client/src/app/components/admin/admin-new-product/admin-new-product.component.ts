import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';

interface FormErrors {
  namn?: string;
  bild?: string;
  sku?: string;
}

@Component({
  selector: 'app-admin-new-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-new-product.component.html',
  styleUrls: ['./admin-new-product.component.css']
})
export class AdminNewProductComponent {
  formData = {
    namn: '',
    beskrivning: '',
    bild: '',
    marke: '',
    sku: '',
    pris: '',
    publiceringsdatum: '',
    kategori: 'mobler'
  };
  errors: FormErrors = {};

  // Make router public so template can access it
  constructor(private productService: ProductService, public router: Router) {}

  // Add a cancel method for better practice
  cancel(): void {
    this.router.navigate(['/admin/table']);
  }

  handleChange(event: Event): void {
    const { id, value } = event.target as HTMLInputElement;
    this.formData = { ...this.formData, [id]: value };
  }

  // Helper method to generate URL slug from product name
  private generateUrlSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[åäö]/g, (match) => {
        const map: { [key: string]: string } = { 'å': 'a', 'ä': 'a', 'ö': 'o' };
        return map[match] || match;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Helper method to map category string to categoryId
  private getCategoryId(categoryString: string): number {
    const categoryMap: { [key: string]: number } = {
      'mobler': 1,
      'sofas': 1,
      'chairs': 2,
      'tables': 3,
      'storage': 4,
      'lighting': 5,
      'vardagsrum': 1,
      'kontor': 2,
      'kok': 3,
      'sovrum': 4
    };
    return categoryMap[categoryString.toLowerCase()] || 1; // Default to 1 if not found
  }

  validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!this.formData.namn) {
      newErrors.namn = 'Namn är obligatoriskt';
    } else if (this.formData.namn.length > 25) {
      newErrors.namn = 'Namn får vara högst 25 tecken';
    }

    if (!this.formData.bild) {
      newErrors.bild = 'Bild är obligatoriskt';
    }

    // Make SKU required with strict validation
    const skuRegex = /^[A-Z]{3}[0-9]{3}$/;
    if (!this.formData.sku) {
      newErrors.sku = 'SKU är obligatoriskt';
    } else if (!skuRegex.test(this.formData.sku)) {
      newErrors.sku = 'SKU måste vara i formatet XXXYYY där X är bokstäver och Y är siffror';
    }

    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  handleSubmit(event: Event): void {
    console.log('handleSubmit called!');
    event.preventDefault();

    console.log('Form data:', this.formData);
    console.log('Validation result:', this.validateForm());

    if (this.validateForm()) {
      const productData = {
        name: this.formData.namn,
        description: this.formData.beskrivning || '',
        image: this.formData.bild,
        brand: this.formData.marke || 'FreakyFurniture',
        price: parseFloat(this.formData.pris) || 0,
        urlSlug: this.generateUrlSlug(this.formData.namn),
        sku: this.formData.sku, // Required field
        categoryId: this.getCategoryId(this.formData.kategori)
      };

      console.log('Submitting product data:', productData);

      this.productService.addProduct(productData).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          alert('Produkt skapad framgångsrikt!');
          this.router.navigate(['/admin/table']);
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          alert('Ett fel uppstod när produkten skulle sparas.');
        }
      });
    } else {
      console.log('Form validation failed:', this.errors);
    }
  }
}
