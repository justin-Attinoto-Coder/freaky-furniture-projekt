import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faStroopwafel , faStar } from '@fortawesome/free-solid-svg-icons';
import { CommonAccordionComponent } from 'app/components/common/common-accordion/common-accordion.component';
import { CommonAccordionItemComponent } from 'app/components/common/common-accordion-item/common-accordion-item.component';

@Component({
  selector: 'app-checkout-confirmation',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, CommonAccordionComponent, CommonAccordionItemComponent],
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
