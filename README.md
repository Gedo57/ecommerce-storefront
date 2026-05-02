# SET Store — E-Commerce Storefront & Marketplace Dashboard

SET Store is a portfolio-ready e-commerce frontend built with React, Vite, Tailwind CSS, React Router, Redux Toolkit, and local browser persistence.

The project demonstrates a complete commerce experience: storefront browsing, product details, wishlist, cart, checkout, customer account area, local authentication, admin dashboard, vendor workspace, multi-currency support, and operational management screens.

---

## Key Features

### Storefront Experience
- Responsive homepage.
- Hero section.
- Best sellers section.
- Category showcase.
- Flash sale section.
- Product grid.
- Product cards with quick actions.
- Mega menu navigation.
- Search overlay.
- Trust badges and footer sections.

### Product Discovery
- Category listing pages.
- Product details page.
- Product option handling.
- Search results page.
- Wishlist page.
- Cart drawer.
- Checkout page.
- Track order page.
- Support page.

### Account & Authentication
- Local login workflow.
- Customer registration.
- Vendor registration.
- Local session persistence.
- Password hashing simulation.
- Email verification code simulation.
- Password reset code simulation.
- Customer account page.
- Address management.
- Order history simulation.

### Admin Dashboard
- Admin dashboard overview.
- Orders management.
- Products management.
- Vendors management.
- Customers management.
- Inventory page.
- Promotions page.
- Reviews page.
- Refunds page.
- Reports page.
- Roles page.
- CMS page.
- Settings page.
- Notifications page.
- Payouts page.
- Detail pages for orders, products, vendors, and customers.

### Vendor Workspace
- Vendor dashboard.
- Vendor orders.
- Vendor products.
- Product creation and edit workflow.
- Vendor product details.
- Vendor order details.
- Inventory page.
- Promotions page.
- Reviews page.
- Earnings page.
- Payouts page.
- Settings page.
- Pending vendor state.

### Commerce Operations
- Redux cart state.
- Redux wishlist state.
- Local cart persistence.
- Local wishlist persistence.
- Local customer/vendor/admin data persistence.
- Dashboard report export utilities.
- Currency switching utilities.
- Arabic/English text mapping utilities.
- Toast notifications.
- SEO helper utilities.

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- Redux Toolkit
- React Redux

### State & Persistence
- Redux Toolkit
- React Context
- Browser `localStorage`
- Mock commerce data modules

---

## Key Routes

### Public Storefront

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/category/:categoryKey` | Category listing page |
| `/product/:productId` | Product details page |
| `/checkout` | Checkout page |
| `/wishlist` | Wishlist page |
| `/login` | Login, customer registration, vendor registration, and reset UI |
| `/support` | Support page |
| `/track-order` | Track order page |
| `/content-studio` | Content studio page |
| `/search` | Search results page |

### Customer Area

| Route | Purpose |
|---|---|
| `/account` | Customer account, addresses, and orders |

### Admin Area

| Route | Purpose |
|---|---|
| `/admin` | Admin dashboard |
| `/admin/orders` | Admin orders |
| `/admin/orders/:orderId` | Admin order details |
| `/admin/products` | Admin products |
| `/admin/products/:productId` | Admin product details |
| `/admin/vendors` | Admin vendors |
| `/admin/vendors/:vendorId` | Admin vendor details |
| `/admin/customers` | Admin customers |
| `/admin/customers/:customerId` | Admin customer details |
| `/admin/inventory` | Admin inventory |
| `/admin/promotions` | Admin promotions |
| `/admin/reviews` | Admin reviews |
| `/admin/refunds` | Admin refunds |
| `/admin/reports` | Admin reports |
| `/admin/roles` | Admin roles |
| `/admin/cms` | Admin CMS |
| `/admin/settings` | Admin settings |
| `/admin/notifications` | Admin notifications |
| `/admin/payouts` | Admin payouts |

### Vendor Area

| Route | Purpose |
|---|---|
| `/vendor/pending` | Pending vendor approval page |
| `/vendor` | Vendor dashboard |
| `/vendor/orders` | Vendor orders |
| `/vendor/orders/:orderId` | Vendor order details |
| `/vendor/products` | Vendor products |
| `/vendor/products/new` | New vendor product form |
| `/vendor/products/:productId` | Vendor product details |
| `/vendor/products/:productId/edit` | Edit vendor product form |
| `/vendor/inventory` | Vendor inventory |
| `/vendor/promotions` | Vendor promotions |
| `/vendor/reviews` | Vendor reviews |
| `/vendor/earnings` | Vendor earnings |
| `/vendor/payouts` | Vendor payouts |
| `/vendor/settings` | Vendor settings |

---

## Demo Accounts

Seeded local accounts:

| Role | Email | Password | Purpose |
|---|---|---|---|
| Admin | `Admin@admin.com` | `1234` | Admin dashboard access |
| Vendor | `vendor@vendor.com` | `1234` | Approved vendor workspace access |

Customers can also be created from the registration screen.

---

## Local Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

---

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
```

---

## Project Structure

```txt
ecommerce/
├── public/
├── src/
│   ├── admin/
│   │   ├── components/
│   │   ├── data/
│   │   └── pages/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── redux/
│   ├── services/
│   ├── utils/
│   ├── vendor/
│   │   ├── components/
│   │   ├── data/
│   │   └── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

---

## Portfolio Positioning

**SET Store** is best presented as a multi-role e-commerce storefront and marketplace management interface.

It is suitable for showcasing:

- E-commerce UI/UX design.
- Product browsing and checkout flows.
- Cart and wishlist state management.
- Customer account workflows.
- Admin operations dashboard design.
- Vendor dashboard workflows.
- Role-based route protection.
- Local persistence and mock business logic.
- Responsive frontend architecture.

---

## Current Scope Boundaries

This project is frontend-centered.

It does not include:

- A real backend database.
- Real payment processing.
- Real shipping provider integration.
- Real email delivery.
- Real vendor verification.
- Real admin permissions from a server.
- Production authentication.
- Production inventory synchronization.

Commerce behavior is simulated locally to demonstrate product flow, role-based interfaces, dashboard workflows, and marketplace UX thinking.

---

## Recommended Portfolio Screens

- Homepage hero and best sellers.
- Category listing page.
- Product details page.
- Cart drawer.
- Checkout page.
- Login and registration page.
- Customer account page.
- Admin dashboard.
- Admin orders/products/customers pages.
- Vendor dashboard.
- Vendor product creation/edit page.
- Wishlist page.

---

## Portfolio Summary

SET Store demonstrates the ability to design and implement a multi-role e-commerce frontend with storefront browsing, cart and wishlist state, checkout flow, local authentication, customer account tools, admin management screens, vendor workflows, local persistence, and responsive marketplace UI architecture.
