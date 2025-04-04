// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import LoginPage from './components/LoginPage';
import Home from './Pages/Home';
import Modal from './components/Modal';

function App() {

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Functions to open the modals
  const openLogin = () => {
    // Optionally close login modal if open
    setShowSignup(false);
    setShowLogin(true);
  };
  const openSignup = () => {
    // Optionally close login modal if open
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <Router>
      {/* Pass the modal trigger functions to Navbar */}
      <Navbar openLogin={openLogin} openSignup={openSignup} />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/menu" element={<MenuPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/franchise" element={<FranchisePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} /> */}
      </Routes>

      {/* Login Modal */}
      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <LoginPage openSignup={openSignup} />
      </Modal>

      {/* Signup Modal */}
      <Modal isOpen={showSignup} onClose={() => setShowSignup(false)}>
        <SignUp openLogin={openLogin} />
      </Modal>

    </Router>
  );
}

export default App;
