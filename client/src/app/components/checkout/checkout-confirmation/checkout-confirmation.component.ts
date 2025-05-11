import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faStroopwafel , faStar } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-checkout-confirmation',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule ],
  // Note: The imports array is used to import other components or modules that this component depends on.
  // In this case, it imports CommonModule for common Angular directives, FontAwesomeModule for FontAwesome icons,
  // and two custom components: CommonAccordionComponent and CommonAccordionItemComponent.
  templateUrl: './checkout-confirmation.component.html',
  styleUrls: ['./checkout-confirmation.component.css']
})
export class CheckoutConfirmationComponent {
  faCheckCircle = faCheckCircle;
  faStroopwafel = faStroopwafel;
  faStar = faStar;

  constructor(private router: Router) {}

  goToHome() {
    console.log('Checkout-Confirmation: Navigating to home');
    this.router.navigate(['/home']);
  }
}
