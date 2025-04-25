// backend/utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const transporter = nodemailer.createTransport({
  host:     process.env.SMTP_HOST,
  port:     Number(process.env.SMTP_PORT),
  secure:   false,              // STARTTLS on 587
  auth: {
    user:   process.env.SMTP_USER,
    pass:   process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,  // helpful for some providers
  },
});

export const sendMail = (opts) =>
  transporter.sendMail({
    from: `"ZAAN" <${process.env.SMTP_FROM}>`,
    ...opts,
  });
