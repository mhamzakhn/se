import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillEmail = location.state?.email || '';

  const [form, setForm] = useState({ email: prefillEmail, otp: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/api/v1/auth/reset-password', form);
      setMessage(res.data.message);

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] via-[#0a0f1f] to-[#0f172a] px-4">
      <div className="w-full max-w-md bg-card text-white p-8 rounded-2xl shadow-2xl border border-border">
        <h2 className="text-3xl font-extrabold text-center mb-4">Reset Password</h2>
        <p className="text-sm text-center text-muted mb-6">
          Enter your email, OTP, and a new password to complete the reset process.
        </p>

        {message && (
          <div className="bg-green-100 text-green-900 font-medium text-sm px-4 py-2 rounded mb-4 text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-900 font-medium text-sm px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              value={form.email}
              className="w-full px-4 py-2 rounded-md bg-muted text-white border border-border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium mb-1">OTP</label>
            <input
              type="text"
              name="otp"
              id="otp"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 rounded-md bg-muted text-white border border-border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="New Password"
              className="w-full px-4 py-2 rounded-md bg-muted text-white border border-border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white font-semibold py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              loading
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
