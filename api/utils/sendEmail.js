// utils/sendEmail.js

import sgMail from '@sendgrid/mail';

/**
 * Sends an email using the SendGrid API.
 * This function is designed to replace the original Nodemailer SMTP transport
 * to work with hosting providers like Render that block direct SMTP connections.
 *
 * @param {object} options - The email options.
 * @param {string} options.email - The recipient's email address.
 * @param {string} options.subject - The subject of the email.
 * @param {string} options.message - The plain text content of the email.
 */
const sendEmail = async (options) => {
  // Set the SendGrid API key from your environment variables
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Construct the email message
  const message = {
    to: options.email,
    from: 'your-verified-email@example.com', // IMPORTANT: Replace this with the single sender email you verified in your SendGrid account.
    subject: options.subject,
    text: options.message,
    // You can also include an HTML version of your message
    // html: `<strong>${options.message}</strong>`,
  };

  try {
    // Send the email using SendGrid's library
    await sgMail.send(message);
    console.log(`Email successfully sent to ${options.email}`);
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);

    // If SendGrid returns a detailed error response, log it
    if (error.response) {
      console.error(error.response.body);
    }

    // Throw a new error to be caught by the calling function (e.g., in authController.js)
    throw new Error('Email could not be sent.');
  }
};

export default sendEmail;