// src/components/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignUp.css'

const SignUp = ({ openLogin, closeModal }) => {
  const navigate = useNavigate();
  
  // Signup form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lumsId, setLumsId]       = useState("");
  const [error, setError]         = useState("");
  
  // OTP-related states
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate phone number format (if provided)
    const phoneRegex = /^\d{11}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      setError("Phone number must be exactly 11 digits");
      return;
    }
  
    setError("");
  
    // Create the payload
    const payload = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      lumsId,
    };
    
    console.log("Sending signup data:", payload);
    
    try {
      const response = await fetch("http://localhost:4000/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Signup failed");
      } else {
        console.log("OTP sent to email");
        setOtpSent(true);
        setError("");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  // Handle OTP verification form submission
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/v1/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpInput }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        setVerificationMessage(data.message || "OTP verification failed");
      } else {
        setVerificationMessage("Account created successfully!");
        setAccountCreated(true);
        // Close the modal after 1 second and navigate to home
        setTimeout(() => {
          closeModal();
          navigate("/");
        }, 3000); // 1 second delay
      }
    } catch (err) {
      console.error("Error during OTP verification:", err);
      setVerificationMessage("Error during OTP verification.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src="/zaanlogo.png" alt="Zaan Logo" className="zaan-logo" />
        <h1>Sign Up to earn Points and Redeem Discounts!</h1>
        <img src="/chowmeinlogin2.png" alt="Chow Mein" className="chowmein-image" />
      </div>
      <div className="signup-right">
        {!otpSent ? (
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
            
            <button type="submit" className="btn create-account-btn">
              Create Account
            </button>
            
            <p className="already-member">
              Already have an account?{" "}
              {openLogin ? (
                <span className="login-link" onClick={openLogin}>
                  Login
                </span>
              ) : (
                <Link to="/login">Sign in</Link>
              )}
            </p>
          </form>
        ) : (
          <form className="signup-form" onSubmit={handleVerifyOtp}>
            <h2>Verify OTP</h2>
            {verificationMessage && (
              <div className="info-message">
                {accountCreated ? (
                  <>
                    <span className="tick-icon">✔️</span> {verificationMessage}
                  </>
                ) : (
                  verificationMessage
                )}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input 
                id="otp"
                type="text" 
                placeholder="OTP" 
                required 
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn verify-otp-btn">
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
