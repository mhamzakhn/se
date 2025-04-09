// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import SignUp from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import Home from './pages/Home/Home';
import Modal from './components/Modal/Modal';
import MenuPage from './pages/Menu/Menu';
import { CartProvider } from './context/CartContext';

import useModal from './hooks/useModal';

function App() {
  const {
    showLogin,
    showSignUp,
    openLogin,
    openSignUp,
    closeLogin,
    closeSignUp
  } = useModal();

  return (
    <CartProvider>
      <Router>
        {/* Pass the modal trigger functions to Navbar */}
        <Navbar openLogin={openLogin} openSignUp={openSignUp} />

        <Routes>
          <Route path="/" element={<Home />} />
          {/* Pass openLogin as a prop to MenuPage so it can trigger login modal if needed */}
          <Route path="/menu" element={<MenuPage openLogin={openLogin} />} />
        </Routes>

        {/* Login Modal */}
        <Modal isOpen={showLogin} onClose={closeLogin}>
          <Login openSignUp={openSignUp} closeModal={closeLogin} />
        </Modal>

        {/* SignUp Modal */}
        <Modal isOpen={showSignUp} onClose={closeSignUp}>
          <SignUp openLogin={openLogin} closeModal={closeSignUp} />
        </Modal>
      </Router>
    </CartProvider>
  );
}

export default App;
