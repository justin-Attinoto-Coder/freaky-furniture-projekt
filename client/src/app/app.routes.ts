import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { AdminDashboardComponent } from './components/pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminTableComponent } from './components/admin/admin-table/admin-table.component';
import { AdminNewProductComponent } from './components/admin/admin-new-product/admin-new-product.component';
import { AdminUsersTableComponent } from './components/admin/admin-users-table/admin-users-table.component';
import { UserDashboardComponent } from './components/pages/user-dashboard/user-dashboard.component';
import { CheckoutShippingComponent } from './components/checkout/checkout-shipping/checkout-shipping.component';
import { CheckoutPaymentComponent } from './components/checkout/checkout-payment/checkout-payment.component';
import { CheckoutReviewComponent } from './components/checkout/checkout-review/checkout-review.component';
import { CheckoutConfirmationComponent } from './components/checkout/checkout-confirmation/checkout-confirmation.component';
import { ProductDetailsComponent } from './components/product/product-details/product-details.component';
import { SearchPageComponent } from './components/pages/search/search-page/search-page.component';
import { ProductReviewsComponent } from './components/product/product-reviews/product-reviews.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'product/:urlSlug', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/table', component: AdminTableComponent },
  { path: 'admin/new-product', component: AdminNewProductComponent },
  { path: 'admin/users', component: AdminUsersTableComponent },
  { path: 'user/dashboard', component: UserDashboardComponent },
  { path: 'checkout-shipping', component: CheckoutShippingComponent },
  { path: 'checkout-payment', component: CheckoutPaymentComponent },
  { path: 'checkout-review', component: CheckoutReviewComponent },
  { path: 'checkout-confirmation', component: CheckoutConfirmationComponent },
  { path: 'product/:urlSlug/reviews', component: ProductReviewsComponent },
  { path: '**', redirectTo: 'home' }
];
