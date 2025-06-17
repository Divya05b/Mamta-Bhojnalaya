import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Box } from "@mui/material";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

// Public Pages
import LandingPage from "./pages/LandingPage";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";

// Customer Pages
import CartPage from "./components/Cart/CartPage";
import OrdersPage from "./pages/OrdersPage";
import CheckoutPage from "./components/Cart/CheckoutPage";
import OrderSuccessPage from "./components/Cart/OrderSuccessPage";
import OrderTrackingPage from "./components/Cart/OrderTrackingPage";
import ReviewSubmissionPage from "./components/Cart/ReviewSubmissionPage";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ReviewManagement from "./pages/admin/ReviewManagement";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff5757",
    },
    secondary: {
      main: "#57d5ff",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 600 },
    h2: { fontSize: "2rem", fontWeight: 600 },
    h3: { fontSize: "1.8rem", fontWeight: 600 },
    h4: { fontSize: "1.5rem", fontWeight: 600 },
    h5: { fontSize: "1.25rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600 },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box sx={{ flexGrow: 1 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/menu" element={<MenuPage />} />

                  {/* Customer Routes */}
                  <Route path="/cart" element={
                    // <ProtectedRoute>
                      <CartPage />
                    // </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/order-success/:orderId" element={
                    <ProtectedRoute>
                      <OrderSuccessPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/order-tracking/:orderId" element={
                    <ProtectedRoute>
                      <OrderTrackingPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/review/:orderId" element={
                    <ProtectedRoute>
                      <ReviewSubmissionPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-orders" element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/menu" element={
                    <ProtectedRoute adminOnly>
                      <MenuManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <ProtectedRoute adminOnly>
                      <OrderManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/reviews" element={
                    <ProtectedRoute adminOnly>
                      <ReviewManagement />
                    </ProtectedRoute>
                  } />

                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
