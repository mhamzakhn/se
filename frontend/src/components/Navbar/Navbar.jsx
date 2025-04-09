// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useCart } from '../../context/CartContext'; // import your CartContext hook
import './Navbar.css';

const Navbar = ({ openLoginModal, openSignUpModal }) => {
  // Track logged-in state based on whether a token exists
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('token')));
  const [userProfile, setUserProfile] = useState(null); // State to store user profile data
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);  // State to control dropdown visibility 
  const dropdownRef = useRef(null); // Ref for the dropdown to detect clicks outside

  // Poll for token changes every second (for demo purposes)
  useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(Boolean(localStorage.getItem('token')));
    };
    const intervalId = setInterval(checkToken, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // When logged in, fetch the user's profile data from the backend
  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      fetch('http://localhost:4000/api/v1/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Sending token as Authorization header
        }
      })
        .then(response => response.json())
        .then(data => setUserProfile(data))
        .catch(error => console.error('Error fetching profile:', error));
    } else {
      setUserProfile(null);
    }
  }, [isLoggedIn]);

  // Close the profile dropdown if user clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileDropdown]);

  // Logout handler: Remove token from localStorage and reset state
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserProfile(null);
    setShowProfileDropdown(false);
  };

  // Use the cart context to get the current cart item count
  const { getCartCount } = useCart();
  const cartCount = getCartCount();  // Get the total number of items in the cart

  return (
    <nav className="navbar">
      {/* Left side: Logo */}
      <div className="nav-left">
        <img src="/zaanlogo.png" alt="Zaan Logo" className="zaan-logo" />
      </div>

      {/* Center: Navigation Links */}
      <div className="nav-links">
      {userProfile?.role === 'admin' ? (
        <>
          <Link to="/">Home</Link>
          <Link to="/admin/menu">Menu</Link>
          <Link to="/admin/dashboard">Dashboard</Link>
        </>
      ) : (
        <>
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/franchise">Franchise</Link>
          <Link to="/contact">Contact</Link>
        </>
      )}
      </div>

      {/* Right side: Cart icon and Login/Signup or User Icon */}
      <div className="nav-right" style={{ position: 'relative' }}>
        <Link to="/cart" className="cart-icon" style={{ position: 'relative' }}>
          <FaShoppingCart size={20} color="#fff" />
          {cartCount > 0 && (
            <span className="cart-count-badge">{cartCount}</span>
          )}
        </Link>
        
        {/* If the user is logged in, show the user icon and profile dropdown */}
        {isLoggedIn ? (
          <div className="user-indicator-container">
            <div 
              className="user-indicator" 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <FaUserCircle size={26} color="#fff" />
            </div>
            {showProfileDropdown && (
              <div className="profile-dropdown" ref={dropdownRef}>
                <p>{userProfile ? `Hello, ${userProfile.name}` : 'Loading...'}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="btn login-btn" onClick={openLoginModal}>Login</button>
            <button className="btn signup-btn" onClick={openSignUpModal}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
