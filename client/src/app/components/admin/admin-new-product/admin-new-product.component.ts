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

  constructor(private productService: ProductService, private router: Router) {}

  handleChange(event: Event): void {
    const { id, value } = event.target as HTMLInputElement;
    this.formData = { ...this.formData, [id]: value };
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
    event.preventDefault();
    if (this.validateForm()) {
      const productData = {
        name: this.formData.namn,
        description: this.formData.beskrivning,
        image: this.formData.bild,
        brand: this.formData.marke,
        sku: this.formData.sku,
        price: parseFloat(this.formData.pris),
        publishing_date: this.formData.publiceringsdatum,
        category: this.formData.kategori
      };

      this.productService.addProduct(productData).subscribe({
        next: () => {
          this.router.navigate(['/admin/table']);
        },
        error: error => {
          console.error('Error submitting form:', error);
        }
      });
    }
  }
}
