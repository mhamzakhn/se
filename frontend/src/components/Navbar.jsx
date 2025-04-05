// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ openLogin, openSignup }) => {
  return (
    <nav className="navbar">
      {/* Left side: Logo or Brand */}
      <div className="nav-left">
        <img src="/zaanlogo.png" alt="Zaan Logo" className="zaan-logo" />
      </div>

      {/* Center: Navigation Links */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Our Menu</Link>
        <Link to="/franchise">Franchise</Link>
        <Link to="/contact">Contact</Link>
      </div>

      {/* Right side: Shopping Cart, Login, and Sign Up */}
      <div className="nav-right">
        <Link to="/cart" className="cart-icon">
          <FaShoppingCart size={20} color="#fff" />
        </Link>
        <button className="btn login-btn" onClick={openLogin}>Login</button>
        <button className="btn signup-btn" onClick={openSignup}>Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
