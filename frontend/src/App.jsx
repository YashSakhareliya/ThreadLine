import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadFromStorage } from "./redux/slices/authSlice";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Tailors from "./pages/Tailors";
import Fabrics from "./pages/Fabrics";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/admin/Dashboard";
import TailorLayout from "./pages/tailor/TailorLayout";
import AddProduct from "./pages/tailor/AddProduct";
import SellerLayout from "./pages/seller/SellerLayout";
import AddSellerProduct from "./pages/seller/AddProduct";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Common Navbar */}
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Authentication Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Tailor Routes */}
          <Route
            path="/tailor"
            element={
              <ProtectedRoute allowedRoles={["tailor"]}>
                <TailorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="products/add" element={<AddProduct />} />
          </Route>

          {/* Seller Routes */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="products/add" element={<AddSellerProduct />} />
          </Route>

          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/tailors" element={<Tailors />} />
          <Route path="/fabrics" element={<Fabrics />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      {/* Common Footer */}
      <Footer />
    </div>
  );
}

export default App;
