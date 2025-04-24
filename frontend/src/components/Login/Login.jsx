import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';

const LoginPage = ({ openSignupModal, closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setErrorMessage("");

    try {
      const { data, error } = await loginUser(email, password);
      if (error) return setErrorMessage(error);

      const { token, user } = data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('studentStatus', data.user.student_status);

      setLoginSuccess(true);

      setTimeout(() => {
        closeModal?.();
      }, 1000);
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again later.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen font-sans">
      {/* Left Panel - hidden on small screens */}
      <div className="hidden lg:flex w-1/3 bg-gradient-to-b from-[#042C5F] to-[#040304] text-white p-8 relative flex-col justify-start items-start">
        <img src="/zaanlogo.png" alt="Zaan Logo" className="w-16 absolute top-4 left-4 z-10" />
        <h1 className="pt-20 pl-6 text-2xl font-semibold">Welcome Back!</h1>
        <p className="pl-8 mt-2 text-sm w-4/5 leading-relaxed">Sign in to continue ordering your favorite meals.</p>
        <img src="/chowmeinlogin2.png" alt="Chow Mein" className="absolute bottom-4 right-[-70px] w-[325px] z-0" />
      </div>

      {/* Right Panel / Full Width on Mobile */}
      <div className="w-full lg:w-2/3 flex justify-center items-center bg-gray-100 rounded-none lg:rounded-l-[40px]">
        <form onSubmit={handleLogin} className="bg-transparent p-6 w-full max-w-sm">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Login to your Account</h2>

          {errorMessage && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded text-center font-semibold">{errorMessage}</div>}
          {loginSuccess && <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded text-center font-semibold">✔️ Login successful!</div>}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-900 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-800 transition">Sign In</button>

          <p className="text-center text-sm text-gray-600 mt-4">
            <Link to="/forgot-password" className="text-red-600 hover:underline">Forgot Password?</Link>
          </p>

          <p className="text-center text-sm text-gray-600 mt-2">
            Don’t have an account? {openSignupModal ? (
              <span className="text-red-600 font-semibold hover:underline cursor-pointer" onClick={openSignupModal}>Sign Up</span>
            ) : (
              <Link to="/signup" className="text-red-600 font-semibold hover:underline">Sign Up</Link>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
