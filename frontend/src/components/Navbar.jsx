// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left side: Logo or Brand */}
      <div className="nav-left">
        <h2>ZAAN</h2>
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
        <Link to="/login">
          <button className="btn login-btn">Login</button>
        </Link>
        <Link to="/signup">
          <button className="btn signup-btn">Sign Up</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
