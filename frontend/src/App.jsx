import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AllShopsPage from './pages/AllShopsPage';
import AllFabricsPage from './pages/AllFabricsPage';
import AllTailorsPage from './pages/AllTailorsPage';
import TailorPortfolioPage from './pages/TailorPortfolioPage';
import FabricDetailsPage from './pages/FabricDetailsPage';
import ShopDetailsPage from './pages/ShopDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';
import TailorDashboard from './pages/tailor/TailorDashboard';
import ShopDashboard from './pages/shop/ShopDashboard';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Import CSS
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
              <Navbar />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Customer Routes */}
                <Route 
                  path="/cart" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CartPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/shops" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <AllShopsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fabrics" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <AllFabricsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tailors" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <AllTailorsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tailor/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <TailorPortfolioPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fabric/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <FabricDetailsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/shop/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <ShopDetailsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/profile" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerProfile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Tailor Routes */}
                <Route 
                  path="/tailor/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['tailor']}>
                      <TailorDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Shop Routes */}
                <Route 
                  path="/shop/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['shop']}>
                      <ShopDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
