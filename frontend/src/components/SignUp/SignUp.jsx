// src/components/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import { signupUser, verifyOtp } from '../../services/authService';

const SignUp = ({ openLoginModal, closeModal }) => {
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    lumsId: '',
  });

  const [errorMessage, setErrorMessage] = useState(''); // State to store error message
  const [otpSent, setOtpSent] = useState(false); // State to indicate OTP has been sent
  const [otpInput, setOtpInput] = useState(''); // State to store OTP input from user
  const [verificationMessage, setVerificationMessage] = useState(''); // State for OTP verification message
  const [accountCreated, setAccountCreated] = useState(false); // State to indicate if account is created

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Validate form data before submission
  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    if (formData.phoneNumber && !/^\d{11}$/.test(formData.phoneNumber)) return "Phone number must be exactly 11 digits";
    return null;
  };

  // Handle signup form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setErrorMessage(validationError);

    setErrorMessage('');

    const { ok, data } = await signupUser(formData);

    if (!ok) {
      setErrorMessage(data.message || "Signup failed");
    } else {
      setOtpSent(true);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const { ok, data } = await verifyOtp(formData.email, otpInput);

    if (!ok) {
      setVerificationMessage(data.message || "OTP verification failed");
    } else {
      setVerificationMessage("Account created successfully!");
      setAccountCreated(true);
      setTimeout(() => {
        closeModal?.();
        navigate('/');
      }, 3000);
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
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {[
              { id: "firstName", label: "First Name", required: true },
              { id: "lastName", label: "Last Name", required: true },
              { id: "email", label: "Email", type: "email", required: true },
              { id: "password", label: "Password", type: "password", required: true },
              { id: "confirmPassword", label: "Confirm Password", type: "password", required: true },
              { id: "phoneNumber", label: "Phone Number", type: "tel" },
              { id: "lumsId", label: "LUMS ID" },
            ].map(({ id, label, type = "text", required }) => (
              <div className="form-group" key={id}>
                <label htmlFor={id}>{label}</label>
                <input
                  id={id}
                  type={type}
                  placeholder={label}
                  value={formData[id]}
                  required={required}
                  onChange={handleChange}
                />
              </div>
            ))}

            <button type="submit" className="btn create-account-btn">Create Account</button>

            <p className="already-member">
              Already have an account?{" "}
              {openLoginModal ? (
                <span className="login-link" onClick={openLoginModal}>Login</span>
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
                  <><span className="tick-icon">✔️</span> {verificationMessage}</>
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
            <button type="submit" className="btn verify-otp-btn">Verify OTP</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
