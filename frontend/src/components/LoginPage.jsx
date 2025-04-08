// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ openSignup, closeModal }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    console.log("Logging in with:", { email, password });
    
    try {
      const response = await fetch("http://localhost:4000/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
      } else {
        console.log("Login successful:", data);
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('studentStatus', data.user.student_status);
        setLoginSuccess(true);
        // After a delay, close the modal (if closeModal is provided) and navigate to home
        setTimeout(() => {
          if (typeof closeModal === "function") {
            closeModal();
          }
          navigate("/");
        }, 1000); // 1 second delay
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/zaanlogo.png" alt="Zaan Logo" className="zaan-logo" />
        <h1>Welcome Back!</h1>
        <p>Sign in to continue ordering your favorite meals.</p>
        <img 
          src="/chowmeinlogin2.png" 
          alt="Chow Mein" 
          className="chowmein-image" 
        />
      </div>
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login to your Account</h2>
          {error && <div className="error-message">{error}</div>}
          {loginSuccess && (
            <div className="success-message">
              <span className="tick-icon">✔️</span> Login successful!
            </div>
          )}
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
            Don't have an account?{" "}
            {openSignup ? (
              <span className="signup-link" onClick={openSignup}>
                Sign Up
              </span>
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
