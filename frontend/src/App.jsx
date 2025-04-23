// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import SignUp from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import Home from './pages/Home/Home';
import Modal from './components/Modal/Modal';
import MenuPage from './pages/Menu/Menu';
import AdminMenuPage from './pages/AdminMenu';
import Checkout from './pages/Checkout/Checkout';
import { CartProvider } from './context/CartContext';

import useModal from './hooks/useModal';

function App() {
  const {
    showLoginModal,  // state to control whether the login modal is visible
    showSignUpModal, // state to control whether the sign-up modal is visible
    openLoginModal,  // function to show the login modal
    openSignUpModal, // function to show the sign-up modal
    closeLoginModal, // function to close the login modal
    closeSignUpModal // function to close the sign-up modal
  } = useModal();

  return (
    <CartProvider>
      <Router>
        {/* Pass the modal trigger functions as props to Navbar for opening modals */}
        <Navbar openLoginModal={openLoginModal} openSignUpModal={openSignUpModal} />

        <Routes>
          <Route path="/" element={<Home />} />
          {/* Pass openLoginModal as a prop to MenuPage so it can trigger login modal if needed */}
          <Route path="/menu" element={<MenuPage openLogin={openLoginModal} />} />
          <Route path="/admin/menu" element={<AdminMenuPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>

        {/* Login Modal */}
        <Modal isOpen={showLoginModal} onClose={closeLoginModal}>
          <Login openSignupModal={openSignUpModal} closeModal={closeLoginModal} />
        </Modal>

        {/* SignUp Modal */}
        <Modal isOpen={showSignUpModal} onClose={closeSignUpModal}>
          <SignUp openLoginModal={openLoginModal} closeModal={closeSignUpModal} />
        </Modal>
      </Router>
    </CartProvider>
  );
}

export default App;