import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser, verifyOtp } from '../../services/authService';

const SignUp = ({ openLoginModal, closeModal }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    confirmPassword: '', phoneNumber: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);
  const [loading, setLoading] = useState(false); // ⬅️ New loading state

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    if (formData.phoneNumber && !/^\d{11}$/.test(formData.phoneNumber)) return "Phone number must be exactly 11 digits";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // ⛔ Prevent duplicate submission

    const validationError = validateForm();
    if (validationError) return setErrorMessage(validationError);

    setErrorMessage('');
    setLoading(true); // ⬅️ Start loading

    const { ok, data } = await signupUser(formData);

    setLoading(false); // ⬅️ Stop loading

    if (!ok) return setErrorMessage(data.message || "Signup failed");

    setOtpSent(true);
  };

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
    <div className="flex flex-col lg:flex-row w-full h-screen font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/3 bg-gradient-to-b from-[#042C5F] to-[#040304] text-white p-8 relative flex-col justify-start items-start">
        <img src="/zaanlogo.png" alt="Zaan Logo" className="w-16 absolute top-4 left-4 z-10" />
        <h1 className="pt-20 pl-6 text-2xl font-semibold max-w-[80%]">Sign Up to earn Points and Redeem Discounts!</h1>
        <img src="/chowmeinlogin2.png" alt="Chow Mein" className="absolute bottom-4 right-[-70px] w-[325px] z-0" />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-2/3 bg-gray-100 flex justify-center items-center rounded-none lg:rounded-l-[40px] p-4 overflow-y-auto">
        {!otpSent ? (
          <form onSubmit={handleSubmit} className="w-full max-w-sm bg-transparent p-4">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>

            {errorMessage && (
              <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded text-center font-semibold">
                {errorMessage}
              </div>
            )}

            {[
              { id: "firstName", label: "First Name", required: true },
              { id: "lastName", label: "Last Name", required: true },
              { id: "email", label: "Email", type: "email", required: true },
              { id: "password", label: "Password", type: "password", required: true },
              { id: "confirmPassword", label: "Confirm Password", type: "password", required: true },
              { id: "phoneNumber", label: "Phone Number", type: "tel" },
            ].map(({ id, label, type = "text", required }) => (
              <div key={id} className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  id={id}
                  type={type}
                  value={formData[id]}
                  placeholder={label}
                  required={required}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-2 rounded-md transition ${
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:from-red-700 hover:to-red-800'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              {openLoginModal ? (
                <span onClick={openLoginModal} className="text-red-600 font-semibold hover:underline cursor-pointer">
                  Login
                </span>
              ) : (
                <Link to="/login" className="text-red-600 font-semibold hover:underline">
                  Sign in
                </Link>
              )}
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="w-full max-w-sm bg-transparent p-4">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Verify OTP</h2>

            {verificationMessage && (
              <div className={`px-4 py-2 mb-4 rounded text-center font-semibold ${accountCreated ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {accountCreated ? `✔️ ${verificationMessage}` : verificationMessage}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                id="otp"
                type="text"
                value={otpInput}
                placeholder="OTP"
                required
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-2 rounded-md hover:from-red-700 hover:to-red-800 transition">
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
