// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './Pages/Home';
import Modal from './components/Modal';
import MenuPage from './pages/Menu';
import { CartProvider } from './context/CartContext';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Functions to open the modals
  const openLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };
  const openSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

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
        <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
          <Login openSignUp={openSignUp} closeModal={() => setShowLogin(false)} />
        </Modal>

        {/* SignUp Modal */}
        <Modal isOpen={showSignUp} onClose={() => setShowSignUp(false)}>
          <SignUp openLogin={openLogin} closeModal={() => setShowSignUp(false)} />
        </Modal>
      </Router>
    </CartProvider>
  );
}

export default App;
