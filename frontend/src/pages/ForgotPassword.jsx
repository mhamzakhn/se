import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/api/v1/forgot-password', { email });
      setMessage(res.data.message);

      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] via-[#0a0f1f] to-[#0f172a] px-4">
      <div className="w-full max-w-md bg-card text-white p-8 rounded-2xl shadow-2xl border border-border">
        <h2 className="text-3xl font-extrabold text-center mb-4">Forgot Password</h2>
        <p className="text-sm text-center text-muted mb-6">
          Enter your registered email address. We'll send you an OTP to reset your password.
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
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-md bg-muted text-white border border-border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
