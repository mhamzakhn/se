// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext'; // import your CartContext hook
import './Navbar.css';

const Navbar = ({ openLogin, openSignup }) => {
  // Use the cart context to get the current cart count
  const { getCartCount } = useCart();
  const cartCount = getCartCount();  // sum of quantities of all cart items

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
      <div className="nav-right" style={{ position: 'relative' }}>
        <Link to="/cart" className="cart-icon" style={{ position: 'relative' }}>
          <FaShoppingCart size={20} color="#fff" />
          {cartCount > 0 && (
            <span className="cart-count-badge">{cartCount}</span>
          )}
        </Link>
        <button className="btn login-btn" onClick={openLogin}>Login</button>
        <button className="btn signup-btn" onClick={openSignup}>Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
