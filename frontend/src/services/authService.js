import api from './api';

export const loginUser = async (email, password) => {
  try {
    const res = await api.post('/api/v1/login', { email, password });
    return { ok: true, data: res.data };
  } catch (error) {
    const data = error.response?.data || { message: 'Network error' };
    return { ok: false, data };
  }
};

export const signupUser = async (payload) => {
  try {
    const res = await api.post('/api/v1/signup', payload);
    return { ok: true, data: res.data };
  } catch (error) {
    const data = error.response?.data || { message: 'Something went wrong. Please try again later.' };
    return { ok: false, data };
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const res = await api.post('/api/v1/verify-otp', { email, otp });
    return { ok: true, data: res.data };
  } catch (error) {
    const data = error.response?.data || { message: 'Error during OTP verification.' };
    return { ok: false, data };
  }
};

export const resetPassword = async (email, newPassword, otp) => {
  try {
    const res = await api.post('/api/v1/reset-password', { email, newPassword, otp });
    return { ok: true, data: res.data };
  } catch (error) {
    const data = error.response?.data || { message: 'Network error' };
    return { ok: false, data };
  }
};
