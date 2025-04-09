// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import './Login.css';

const LoginPage = ({ openSignupModal, closeModal }) => {
  const [email, setEmail] = useState(''); // State to store email input
  const [password, setPassword] = useState(''); // State to store password input
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
  const [loginSuccess, setLoginSuccess] = useState(false); // State to indicate login success
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault(); 

    // Validate inputs
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setErrorMessage("");

    try {
      const { data, error } = await loginUser(email, password);
      if (error) return setErrorMessage(error);

      // Store login information and token in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('studentStatus', data.user.student_status);

      setLoginSuccess(true);

      // Close modal and navigate to the home page after a successful login 
      setTimeout(() => {
        closeModal?.();
        navigate('/');
      }, 1000);
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again later.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/zaanlogo.png" alt="Zaan Logo" className="zaan-logo" />
        <h1>Welcome Back!</h1>
        <p>Sign in to continue ordering your favorite meals.</p>
        <img src="/chowmeinlogin2.png" alt="Chow Mein" className="chowmein-image" />
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login to your Account</h2>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {loginSuccess && <div className="success-message">✔️ Login successful!</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn signin-btn">Sign In</button>

          <p className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>

          <p className="no-account">
            Don’t have an account?{" "}
            {openSignupModal ? (
              <span className="signup-link" onClick={openSignupModal}>Sign Up</span>
            ) : (
              <Link to="/signup">Sign Up</Link>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
