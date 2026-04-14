// utils/sendEmail.js
import { Resend } from 'resend';

/**
 * Sends an email using the Resend API.
 * Replaces SendGrid to ensure compatibility with Render.
 */
const sendEmail = async (options) => {
  // Initialize Resend with your API Key
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      /* Note: If you haven't verified a custom domain yet, 
         you MUST use 'onboarding@resend.dev' as the "from" address.
      */
      from: 'pixienestbuildwell26@gmail.com', 
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html: `<p>${options.message}</p>`, // Optional: Use this for better formatting
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error('Email could not be sent.');
    }

    console.log(`Email successfully sent to ${options.email}. ID: ${data.id}`);
  } catch (error) {
    console.error('System Error sending email via Resend:', error);
    throw new Error('Email service failure.');
  }
};

export default sendEmail;