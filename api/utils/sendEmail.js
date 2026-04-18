// utils/sendEmail.js
import nodemailer from 'nodemailer';

/**
 * Sends an email using Gmail's SMTP server via an App Password.
 */
const sendEmail = async (options) => {
  // 1. Create a transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `PixieNest Buildwell <${process.env.GMAIL_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: `<p>${options.message}</p>`, // Optional: Use this if your message is formatted with HTML
  };

  // 3. Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${options.email}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('System Error sending email via Gmail:', error);
    throw new Error('Email service failure.');
  }
};

export default sendEmail;