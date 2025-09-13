import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const port = Number(process.env.EMAIL_PORT) || 587; // fallback to 587
  const host = process.env.EMAIL_HOST;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,            // true for 465, false for STARTTLS ports like 587 (or 487)
    requireTLS: port === 587,        // ask for STARTTLS on 587 (optional)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,                    // show logs in stdout/stderr
    debug: true,                     // show SMTP protocol traffic in logs
    connectionTimeout: 15000,        // 15s connection timeout
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });

  const message = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("Email sent:", info);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

export default sendEmail;
