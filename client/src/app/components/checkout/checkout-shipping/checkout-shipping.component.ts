import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faBoxOpen, faCreditCard, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-checkout-shipping',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './checkout-shipping.component.html',
  styleUrls: ['./checkout-shipping.component.css']
})
export class CheckoutShippingComponent {
  provinces = [
    "Stockholm", "Västra Götaland", "Skåne", "Uppsala", "Södermanland", "Östergötland",
    "Jönköping", "Kronoberg", "Kalmar", "Gotland", "Blekinge", "Halland", "Värmland",
    "Örebro", "Västmanland", "Dalarna", "Gävleborg", "Västernorrland", "Jämtland",
    "Västerbotten", "Norrbotten"
  ];

  cities = [
    "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping",
    "Helsingborg", "Jönköping", "Norrköping", "Lund", "Umeå", "Gävle", "Borås",
    "Södertälje", "Eskilstuna", "Karlstad", "Täby", "Växjö", "Halmstad"
  ];

  shippingDetails = {
    fullName: '',
    phoneNumber: '',
    province: '',
    city: '',
    streetAddress: '',
    postalCode: '',
    shippingMethod: '',
    carrier: '',
    deliveryTime: ''
  };

  customerDetails: any = {};
  cartItems: any[] = [];
  totalPrice: number = 0;
  error: string | null = null;

  carrierDeliveryTimes: { [key: string]: string } = {
    "DHL Express": "08:00-16:00",
    "EarlyBird": "01:00-07:00",
    "AirMe": "17:00-22:00",
    "DHL": "08:00-16:00",
    "Schenker Parcel": "08:00-16:00",
    "InstaBox": "08:00-16:00",
    "PostNord": "08:00-16:00"
  };

  faArrowLeft = faArrowLeft;
  faBoxOpen = faBoxOpen;
  faCreditCard = faCreditCard;
  faClipboardCheck = faClipboardCheck;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.route.paramMap.subscribe(() => {
      const state = history.state;
      this.customerDetails = state.customerDetails || {};
      this.cartItems = state.cartItems || [];
      this.totalPrice = state.totalPrice || 0;
      this.error = state.error || null;
      console.log('Checkout-Shipping: Received state:', { customerDetails: this.customerDetails, cartItems: this.cartItems, totalPrice: this.totalPrice, error: this.error });
    });
  }

  handleChange(event: Event) {
    const { name, value } = event.target as HTMLInputElement;
    this.shippingDetails = {
      ...this.shippingDetails,
      [name]: value
    };
    if (name === 'carrier') {
      this.shippingDetails.deliveryTime = this.carrierDeliveryTimes[value] || '';
    }
    console.log('Checkout-Shipping: Shipping details updated:', this.shippingDetails);
  }

  getCarrierOptions() {
    switch (this.shippingDetails.shippingMethod) {
      case 'Home Delivery':
        return ['AirMe', 'EarlyBird', 'PostNord'];
      case 'Pickup at Service Point':
        return ['DHL', 'Schenker Parcel', 'InstaBox'];
      case 'Express Shipping':
        return ['DHL Express', 'AirMe', 'EarlyBird'];
      default:
        return [];
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    console.log('Checkout-Shipping: Submitting shipping details:', this.shippingDetails);
    console.log('Checkout-Shipping: Checking field values:');
    Object.entries(this.shippingDetails).forEach(([key, value]) => {
      console.log(`  ${key}: "${value}" (length: ${value.length}, empty: ${!value.trim()})`);
    });

    if (!Object.values(this.shippingDetails).every(field => field.trim())) {
      this.error = 'Please fill out all shipping fields.';
      console.error('Checkout-Shipping: Form validation failed:', this.shippingDetails);
      const emptyFields = Object.entries(this.shippingDetails)
        .filter(([_, value]) => !value.trim())
        .map(([key, _]) => key);
      console.error('Checkout-Shipping: Empty fields:', emptyFields);
      return;
    }

    // Convert camelCase to PascalCase for C# API
    const shippingDetailsDto = {
      FullName: this.shippingDetails.fullName,
      PhoneNumber: this.shippingDetails.phoneNumber,
      Province: this.shippingDetails.province,
      City: this.shippingDetails.city,
      StreetAddress: this.shippingDetails.streetAddress,
      PostalCode: this.shippingDetails.postalCode,
      ShippingMethod: this.shippingDetails.shippingMethod,
      Carrier: this.shippingDetails.carrier,
      DeliveryTime: this.shippingDetails.deliveryTime
    };

    console.log('Checkout-Shipping: Sending DTO to API:', shippingDetailsDto);

    this.http.post(`${environment.apiBaseUrl}/api/shipping-details`, shippingDetailsDto).subscribe({
      next: (response) => {
        console.log('Checkout-Shipping: Shipping details saved, response:', response);
        this.error = null;
        this.router.navigate(['/checkout-payment'], {
          state: {
            customerDetails: this.customerDetails,
            shippingDetails: this.shippingDetails,
            cartItems: this.cartItems,
            totalPrice: this.totalPrice
          }
        }).then(success => {
          console.log('Checkout-Shipping: Navigation to /checkout-payment successful:', success);
        }).catch(error => {
          console.error('Checkout-Shipping: Navigation to /checkout-payment failed:', error);
          this.error = 'Failed to navigate to payment. Please try again.';
        });
      },
      error: (error) => {
        console.error('Checkout-Shipping: Error saving shipping details:', error);
        console.error('Checkout-Shipping: Error status:', error.status);
        console.error('Checkout-Shipping: Error message:', error.message);
        console.error('Checkout-Shipping: Error details:', error.error);
        console.error('Checkout-Shipping: Full error object:', JSON.stringify(error, null, 2));

        if (error.status === 401) {
          this.error = 'Authentication required. Please log in first.';
        } else if (error.status === 400) {
          this.error = `Validation error: ${JSON.stringify(error.error)}`;
        } else {
          this.error = `Failed to save shipping details. Error: ${error.status} - ${error.message}`;
        }
      }
    });
  }

  setCustomerAddress() {
    this.shippingDetails = {
      fullName: this.customerDetails.fullName || '',
      phoneNumber: this.customerDetails.phoneNumber || '',
      province: this.customerDetails.province || '',
      city: this.customerDetails.city || '',
      streetAddress: this.customerDetails.streetAddress || '',
      postalCode: this.customerDetails.postalCode || '',
      shippingMethod: '',
      carrier: '',
      deliveryTime: ''
    };
    console.log('Checkout-Shipping: Set shipping details to customer address:', this.shippingDetails);
  }

  navigateToCart() {
    console.log('Checkout-Shipping: Navigating to cart');
    this.router.navigate(['/cart']);
  }
}
