import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import NotFoundPage from './pages/NotFoundPage';
import SupportPage from './pages/SupportPage';
import TrackOrderPage from './pages/TrackOrderPage';
import ContentStudioPage from './pages/ContentStudioPage';
import SearchResultsPage from './pages/SearchResultsPage';
import { ToastProvider } from './context/ToastContext';
import PageTracker from './components/PageTracker';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminOrdersPage from './admin/pages/AdminOrdersPage';
import AdminProductsPage from './admin/pages/AdminProductsPage';
import AdminVendorsPage from './admin/pages/AdminVendorsPage';
import AdminCustomersPage from './admin/pages/AdminCustomersPage';
import AdminInventoryPage from './admin/pages/AdminInventoryPage';
import AdminPromotionsPage from './admin/pages/AdminPromotionsPage';
import AdminReviewsPage from './admin/pages/AdminReviewsPage';
import AdminRefundsPage from './admin/pages/AdminRefundsPage';
import AdminReportsPage from './admin/pages/AdminReportsPage';
import AdminRolesPage from './admin/pages/AdminRolesPage';
import AdminCmsPage from './admin/pages/AdminCmsPage';
import AdminSettingsPage from './admin/pages/AdminSettingsPage';
import AdminNotificationsPage from './admin/pages/AdminNotificationsPage';
import AdminPayoutsPage from './admin/pages/AdminPayoutsPage';
import AdminOrderDetailsPage from './admin/pages/AdminOrderDetailsPage';
import AdminVendorDetailsPage from './admin/pages/AdminVendorDetailsPage';
import AdminProductDetailsPage from './admin/pages/AdminProductDetailsPage';
import AdminCustomerDetailsPage from './admin/pages/AdminCustomerDetailsPage';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import VendorLayout from './vendor/components/VendorLayout';
import VendorDashboardPage from './vendor/pages/VendorDashboardPage';
import VendorOrdersPage from './vendor/pages/VendorOrdersPage';
import VendorProductsPage from './vendor/pages/VendorProductsPage';
import VendorInventoryPage from './vendor/pages/VendorInventoryPage';
import VendorPendingPage from './vendor/pages/VendorPendingPage';
import VendorPromotionsPage from './vendor/pages/VendorPromotionsPage';
import VendorReviewsPage from './vendor/pages/VendorReviewsPage';
import VendorEarningsPage from './vendor/pages/VendorEarningsPage';
import VendorPayoutsPage from './vendor/pages/VendorPayoutsPage';
import VendorSettingsPage from './vendor/pages/VendorSettingsPage';
import VendorProductFormPage from './vendor/pages/VendorProductFormPage';
import VendorProductDetailsPage from './vendor/pages/VendorProductDetailsPage';
import VendorOrderDetailsPage from './vendor/pages/VendorOrderDetailsPage';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const isWorkspaceRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor');

  return (
    <ToastProvider>
      <ScrollToTop />
      <PageTracker />
      <div className="min-h-screen">
        {!isWorkspaceRoute ? <Navbar onOpenCart={() => setIsCartOpen(true)} /> : null}
        <main>
          <Routes>
            <Route path="/" element={<HomePage onOpenCart={() => setIsCartOpen(true)} />} />
            <Route path="/category/:categoryKey" element={<CategoryPage onOpenCart={() => setIsCartOpen(true)} />} />
            <Route path="/product/:productId" element={<ProductDetailsPage onOpenCart={() => setIsCartOpen(true)} />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage onOpenCart={() => setIsCartOpen(true)} />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<RoleProtectedRoute allowRoles={['customer']} redirectTo="/login" />}>
              <Route path="/account" element={<AccountPage />} />
            </Route>
            <Route path="/support" element={<SupportPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/content-studio" element={<ContentStudioPage />} />
            <Route path="/search" element={<SearchResultsPage />} />

            <Route element={<RoleProtectedRoute allowRoles={['admin']} redirectTo="/login" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="orders/:orderId" element={<AdminOrderDetailsPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/:productId" element={<AdminProductDetailsPage />} />
                <Route path="vendors" element={<AdminVendorsPage />} />
                <Route path="vendors/:vendorId" element={<AdminVendorDetailsPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="customers/:customerId" element={<AdminCustomerDetailsPage />} />
                <Route path="inventory" element={<AdminInventoryPage />} />
                <Route path="promotions" element={<AdminPromotionsPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="refunds" element={<AdminRefundsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="roles" element={<AdminRolesPage />} />
                <Route path="cms" element={<AdminCmsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="notifications" element={<AdminNotificationsPage />} />
                <Route path="payouts" element={<AdminPayoutsPage />} />
              </Route>
            </Route>

            <Route element={<RoleProtectedRoute allowRoles={['vendor']} redirectTo="/login" />}>
              <Route path="/vendor/pending" element={<VendorPendingPage />} />
            </Route>

            <Route element={<RoleProtectedRoute allowRoles={['vendor']} requireApprovedVendor redirectTo="/login" />}>
              <Route path="/vendor" element={<VendorLayout />}>
                <Route index element={<VendorDashboardPage />} />
                <Route path="orders" element={<VendorOrdersPage />} />
                <Route path="orders/:orderId" element={<VendorOrderDetailsPage />} />
                <Route path="products" element={<VendorProductsPage />} />
                <Route path="products/new" element={<VendorProductFormPage />} />
                <Route path="products/:productId" element={<VendorProductDetailsPage />} />
                <Route path="products/:productId/edit" element={<VendorProductFormPage />} />
                <Route path="inventory" element={<VendorInventoryPage />} />
                <Route path="promotions" element={<VendorPromotionsPage />} />
                <Route path="reviews" element={<VendorReviewsPage />} />
                <Route path="earnings" element={<VendorEarningsPage />} />
                <Route path="payouts" element={<VendorPayoutsPage />} />
                <Route path="settings" element={<VendorSettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {!isWorkspaceRoute ? <Footer /> : null}
        {!isWorkspaceRoute ? <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> : null}
      </div>
    </ToastProvider>
  );
}
