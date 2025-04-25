// src/services/authService.js
export const loginUser = async (email, password) => {
  try {
    const res = await fetch("http://localhost:4000/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    return { ok: res.ok, data };
  } catch (error) {
    console.error("API login error:", error);
    return { ok: false, data: { message: "Network error" } };
  }
};

  export const signupUser = async (payload) => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error("Signup error:", error);
      return { ok: false, data: { message: "Something went wrong. Please try again later." } };
    }
  };
  
  export const verifyOtp = async (email, otp) => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error("OTP verification error:", error);
      return { ok: false, data: { message: "Error during OTP verification." } };
    }
  };

  export const requestPasswordReset = async (email) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Request password reset error:', error);
      return { ok: false, data: { message: 'Network error' } };
    }
  };
  
  export const verifyPasswordResetOTP = async (email, otp) => {
    try {
      const response = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
  
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { ok: false, data: { message: 'Network error' } };
    }
  };
  
  export const resetPassword = async (email, newPassword, otp) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword, otp }),
      });
  
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Reset password error:', error);
      return { ok: false, data: { message: 'Network error' } };
    }
  };