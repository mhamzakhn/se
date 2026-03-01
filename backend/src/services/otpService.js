import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
});

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your OTP Code for Signup',
    text: `Your OTP code is: ${otp}`,
  });
};
