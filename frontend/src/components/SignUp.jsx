import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  // State for all form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lumsId, setLumsId]       = useState("");
  const [error, setError]         = useState("");

  // Handle form submission with validations
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Check if phone number (if entered) is exactly 11 digits
    const phoneRegex = /^\d{11}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      setError("Phone number must be exactly 11 digits");
      return;
    }
    
    // Clear errors if validations pass
    setError("");
    
    // Continue with submission logic (e.g., API call)
    console.log("Form submitted", {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      lumsId
    });
  };

  return (
    <div className="signup-container">
      {/* Left side: Background image with text overlay */}
      <div className="signup-left">
        <h1>ZAAN Rewards</h1>
        <p>
          Sign up now to earn points on every order and redeem exclusive discounts.
          Experience mouthwatering flavors with every bite!
        </p>
      </div>

      {/* Right side: Card-style sign-up form */}
      <div className="signup-right">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Create Your Account</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input 
              id="firstName"
              type="text" 
              placeholder="First Name" 
              required 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input 
              id="lastName"
              type="text" 
              placeholder="Last Name" 
              required 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="Email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              type="password" 
              placeholder="Confirm Password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input 
              id="phoneNumber"
              type="tel" 
              placeholder="Phone Number" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lumsId">LUMS ID (Optional)</label>
            <input 
              id="lumsId"
              type="text" 
              placeholder="LUMS ID (Optional)" 
              value={lumsId}
              onChange={(e) => setLumsId(e.target.value)}
            />
          </div>

          <button type="submit" className="btn create-account-btn">
            Create Account
          </button>

          <p className="already-member">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
