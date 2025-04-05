import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Helper function to generate a 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendOTPEmail = async (email, otp) => {
  // Configure Nodemailer (ensure you set your SMTP settings correctly)
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
    port: process.env.SMTP_PORT, // e.g., 587
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Email message configuration
  let mailOptions = {
    from: process.env.SMTP_FROM, // Your email address
    to: email,
    subject: 'Your OTP Code for Signup',
    text: `Your OTP code is: ${otp}`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};
