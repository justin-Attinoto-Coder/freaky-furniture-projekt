Freaky Angular Furniture Project

Welcome to the Freaky Angular Furniture Project, an e-commerce web application built with Angular and styled with Tailwind CSS. This project provides a robust platform for browsing, purchasing, and managing furniture products, with a responsive design and intuitive user experience. Deployed on Render.com, it showcases a full-stack solution with a Node.js backend and SQLite database.
Top 10 Accomplishments

Dynamic Product Catalog:

Implemented a product listing page with filtering and search capabilities, fetching data from the backend (/api/furniture) and displaying products with Tailwind-styled cards.


Product Details and Reviews:

Created a detailed product page (ProductDetailsComponent) with a "See all reviews" link that navigates to a dedicated reviews page (ProductReviewsComponent), fetching reviews from /api/reviews/:productId.


Shopping Cart Functionality:

Built a cart system (CartComponent) with add-to-cart functionality (AddToCartButtonComponent) that persists items via /api/cart, updating dynamically with Tailwind-styled quantity controls.


Checkout Process:

Developed a multi-step checkout flow (CheckoutShippingComponent, CheckoutPaymentComponent, CheckoutReviewComponent, CheckoutConfirmationComponent) with Tailwind-styled progress indicators and a celebratory confirmation page featuring festive FontAwesome icons.


Admin Dashboard:

Implemented an admin dashboard (AdminDashboardComponent) with navigation to manage products (/admin/table) and add new products (/admin/new-product), styled with Tailwind’s dark theme (bg-gray-800, bg-gray-900).


Product Management:

Enabled admins to view, edit, and delete products in a table (AdminTableComponent) and create new products via a form (AdminNewProductComponent), integrated with ProductService and validated with Tailwind-styled error messages.


Authentication and Authorization:

Added a login/registration page (LoginPageComponent) with role-based routing (admin to /admin/table, users to /), clearing auth tokens on logout and redirecting to /login.


Responsive Hamburger Menu:

Designed a hamburger menu (HamburgerMenuComponent) with links to all major routes (e.g., /home, /admin/table, /login), featuring Tailwind animations (animate-bounceIn, hover:scale-105).


Common Accordion Component:

Integrated a reusable CommonAccordionComponent across checkout pages to display cart items and order summaries in a collapsible format, styled with Tailwind (border-gray-200, hover:bg-gray-200).


Render.com Deployment:

Configured the project for deployment on Render.com as a static site named freaky-angular-furniture-project, with a rewrite rule (/* to /index.html) for Angular routing and plans for a separate backend web service.



Getting Started
Prerequisites

Node.js (v16+)
Angular CLI (npm install -g @angular/cli)
Git

Installation

Clone the repository:

git clone https://github.com/justin-Attinoto-Coder/freaky-furniture-projekt.git

cd freaky-angular-furniture-project/client


Install dependencies:npm install


Run the development server:npm run dev


Access the app at http://localhost:4200.

Deployment

Deployed on Render.com as a static site:
Name: freaky-angular-furniture-project
Build Command: npm install && npm run build --prod
Publish Directory: dist/freaky-angular-furniture-project
Rewrite Rule: /* to /index.html


Backend deployment (if applicable) requires a separate Render web service.

Contributing
Contributions are welcome! Please open an issue or submit a pull request on the repository.
License
This project is licensed under the MIT License.
