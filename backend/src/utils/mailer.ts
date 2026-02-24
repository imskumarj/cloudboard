import nodemailer from "nodemailer";
import { ENV } from "../config/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.SMTP_EMAIL,
    pass: ENV.SMTP_PASSWORD,
  },
});

export const sendOtpEmail = async (
  to: string,
  name: string,
  otp: string
) => {
  await transporter.sendMail({
    from: `"CloudBoard" <${ENV.SMTP_EMAIL}>`,
    to,
    subject: "Your CloudBoard Verification Code",
    html: `
      <h3>Hello ${name},</h3>
      <p>Your verification code is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 10 minutes.</p>
    `,
    replyTo: "no-reply@cloudboard.com",
  });
};