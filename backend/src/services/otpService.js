import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendOTPEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your OTP Code for Signup',
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};
