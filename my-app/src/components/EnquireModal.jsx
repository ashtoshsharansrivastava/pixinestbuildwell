import React, { useState } from "react";
// import { postEnquiry } from "../api"; // adjust the import path to wherever you export your API helpers

export default function EnquireModal({ isOpen, onClose, property, user }) {
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState(null); // 'success', 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!message.trim()) {
      setFeedback({ type: "error", text: "Please enter a message." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // --- Backend Integration (Placeholder) ---
    // In a real commercial application, you would send this data to your backend API.
    // The backend would then securely send the email using a service like SendGrid, Mailgun, Nodemailer, etc.
    // This is crucial for reliability, security, and tracking.
    // Example:
    /*
    try {
      const result = await postEnquiry(
        {
          propertyId: property.id,
          propertyName: property.title,
          userEmail: user?.email, // Assuming user email is available
          userName: user?.name, // Assuming user name is available
          userPhone: user?.phone, // Assuming user phone is available
          enquiryMessage: message,
        },
        user?.token // Pass user token for authentication if needed
      );

      if (result._id) {
        setFeedback({ type: "success", text: "Enquiry sent successfully via backend!" });
        setMessage("");
        setTimeout(onClose, 2000); // Auto-close after success
      } else {
        setFeedback({ type: "error", text: result.message || "Failed to send enquiry via backend." });
      }
    } catch (err) {
      setFeedback({ type: "error", text: err.message || "Network error or unexpected issue." });
    } finally {
      setIsSubmitting(false);
    }
    */

    // --- Client-Side Mailto Link (For Demonstration/Fallback) ---
    // This will open the user's default email client.
    // It's not reliable for commercial use as it depends on client setup.
    const recipientEmail = '@gmail.com';
    const subject = `Property Enquiry: ${property.title} (ID: ${property.id})`;
    const body = `
Dear PNBW Officials,

I am writing to inquire about the property:
Property Name: ${property.title}
Property ID: ${property.id}
Location: ${property.locality}, ${property.city}
Price: ${property.price ? (property.price / 100000).toFixed(2) + ' Lakh' : 'N/A'}

My message:
${message}

---
User Details:
Name: ${user?.name || 'Not logged in'}
Email: ${user?.email || 'N/A'}
Contact Number: ${user?.phone || 'N/A'}
`;

    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the mail client
    window.location.href = mailtoLink;

    // Simulate success feedback after opening mail client
    setTimeout(() => {
      setFeedback({ type: "success", text: "Your mail client has opened with the enquiry. Please send it!" });
      setMessage("");
      setIsSubmitting(false);
      // onClose(); // You might want to close the modal immediately or after user sends email
    }, 500); // Short delay to allow mail client to open

  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white text-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-all duration-300 scale-100 animate-scale-in">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Enquire About Property</h2>
        <p className="text-gray-700 text-center mb-6">
          Property: <span className="font-semibold">{property.title}</span> (ID: {property.id})
        </p>

        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-800"
          rows={5}
          placeholder="Hi, I’m interested in this property. Please share more details or arrange a visit. My name is [Your Name] and my contact number is [Your Contact Number]."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
        />

        {feedback && (
          <p
            className={`mb-4 text-center text-sm font-semibold ${
              feedback.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {feedback.text}
          </p>
        )}

        <div className="flex justify-end space-x-3">
          <button
            className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Opening Mail Client..." : "Send Enquiry"}
          </button>
        </div>
      </div>
    </div>
  );
}