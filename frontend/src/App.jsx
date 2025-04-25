// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './pages/Home';
import Modal from './components/Modal';
import MenuPage from './pages/Menu';
import AdminMenuPage from './pages/AdminMenu';
import AdminDashboard from './pages/AdminDashboard';
import SendEmail from './pages/SendEmail';
import Checkout from './pages/Checkout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Contact from './pages/Contact';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import useModal from './hooks/useModal';

function App() {
  const {
    showLoginModal,
    showSignUpModal,  
    openLoginModal,
    openSignUpModal,
    closeLoginModal,
    closeSignUpModal
  } = useModal();

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar
            openLoginModal={openLoginModal}
            openSignUpModal={openSignUpModal}
          />

          <Routes>
            <Route path="/" element={<Home openLoginModal={openLoginModal} />} />
            <Route
              path="/menu"
              element={<MenuPage openLogin={openLoginModal} />}
            />
            <Route path="/admin/menu" element={<AdminMenuPage />} />
            <Route path="/admin/send-email" element={<SendEmail />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>

          {/* Login Modal */}
          <Modal isOpen={showLoginModal} onClose={closeLoginModal}>
            <Login
              openSignupModal={openSignUpModal}
              closeModal={closeLoginModal}
            />
          </Modal>

          {/* SignUp Modal */}
          <Modal isOpen={showSignUpModal} onClose={closeSignUpModal}>
            <SignUp
              openLoginModal={openLoginModal}
              closeModal={closeSignUpModal}
            />
          </Modal>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
