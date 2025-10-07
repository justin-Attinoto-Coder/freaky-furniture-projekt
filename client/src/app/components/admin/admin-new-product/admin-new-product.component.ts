import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, CreateProductRequest, ApiResponse } from '../../../services/product.service';
import { Product } from '../../../models/product';

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
export class AdminNewProductComponent implements OnInit {
  isEditMode = false;
  editingProductId: number | null = null;
  pageTitle = 'Ny produkt';

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

  constructor(private productService: ProductService, public router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.editingProductId = +id;
      this.pageTitle = 'Redigera produkt';
      this.loadProductForEditing(+id);
    }
  }

  private loadProductForEditing(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product: Product | null) => {
        if (!product) {
          alert('Produkten hittades inte.');
          this.router.navigate(['/admin/table']);
          return;
        }
        this.formData = {
          namn: product.name,
          beskrivning: product.description || '',
          bild: product.image || '',
          marke: product.brand || '',
          sku: product.sku || '',
          pris: product.price.toString(),
          publiceringsdatum: '',
          kategori: this.getCategoryName(product.categoryId)
        };
      },
      error: (error) => {
        console.error('Error loading product for editing:', error);
        alert('Kunde inte ladda produkten för redigering.');
        this.router.navigate(['/admin/table']);
      }
    });
  }

  private getCategoryName(categoryId: number): string {
    const categoryMap: { [key: number]: string } = {
      1: 'mobler',
      2: 'forvaring',
      3: 'textil',
      4: 'detaljer'
    };
    return categoryMap[categoryId] || 'mobler';
  }

  cancel(): void {
    this.router.navigate(['/admin/table']);
  }

  handleChange(event: Event): void {
    const { id, value } = event.target as HTMLInputElement;
    this.formData = { ...this.formData, [id]: value };
  }

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

  private getCategoryId(categoryString: string): number {
    const categoryMap: { [key: string]: number } = {
      'mobler': 1,
      'forvaring': 2,
      'detaljer': 3,
      'textil': 4
    };
    return categoryMap[categoryString.toLowerCase()] || 1;
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
    console.log('handleSubmit called!');
    event.preventDefault();

    console.log('Form data:', this.formData);
    console.log('Validation result:', this.validateForm());

    if (this.validateForm()) {
      const productData: CreateProductRequest = {
        name: this.formData.namn,
        description: this.formData.beskrivning || '',
        image: this.formData.bild,
        brand: this.formData.marke || 'FreakyFurniture',
        price: parseFloat(this.formData.pris) || 0,
        urlSlug: this.generateUrlSlug(this.formData.namn),
        sku: this.formData.sku,
        categoryId: this.getCategoryId(this.formData.kategori)
      };

      console.log('Submitting product data:', productData);

      if (this.isEditMode && this.editingProductId) {
        // Update existing product
        this.productService.updateProduct(this.editingProductId, productData).subscribe({
          next: (response: ApiResponse<Product>) => {
            console.log('Product updated successfully:', response);
            alert('Produkt uppdaterad framgångsrikt!');
            this.router.navigate(['/admin/table']);
          },
          error: (error: any) => {
            console.error('Error updating product:', error);
            alert('Ett fel uppstod när produkten skulle uppdateras.');
          }
        });
      } else {
        // Create new product
        this.productService.addProduct(productData).subscribe({
          next: (response: ApiResponse<Product>) => {
            console.log('Product created successfully:', response);
            alert('Produkt skapad framgångsrikt!');
            this.router.navigate(['/admin/table']);
          },
          error: (error: any) => {
            console.error('Error submitting form:', error);
            alert('Ett fel uppstod när produkten skulle sparas.');
          }
        });
      }
    } else {
      console.log('Form validation failed:', this.errors);
    }
  }
}
