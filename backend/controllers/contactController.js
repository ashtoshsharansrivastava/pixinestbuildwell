import asyncHandler from 'express-async-handler';
import sendEmail from '../utils/sendEmail.js'; // Assuming your email utility is here

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please fill out all fields.');
  }

  const recipientEmail = 'ashutoshsharansrivastava@gmail.com'; // The email where you receive messages
  const emailSubject = `New Contact Form Message: ${subject}`;
  
  // Create a clean HTML body for the email
  const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">You've received a new message from your website's contact form!</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>
  `;

  try {
    await sendEmail({
      email: recipientEmail,
      subject: emailSubject,
      html: emailBody,
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500);
    throw new Error('Email could not be sent.');
  }
});

export { submitContactForm };