// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ openSignup }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    console.log("Logging in with:", { email, password });
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/zaanlogo.png" alt="Zaan Logo" className="zaan-logo" />
        <h1>Welcome Back!</h1>
        <p>Sign in to continue ordering your favorite meals.</p>

        {/* Add your chowmein image here */}
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
          
          <p  className="no-account">
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
