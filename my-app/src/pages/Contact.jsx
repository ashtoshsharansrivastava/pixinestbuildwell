// File: frontend/src/pages/Contact.jsx

import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Send, UserPlus, Tag } from 'lucide-react'; // Added Tag icon
import { sendContactMessage } from '../api/contact'; 
import { submitBrokerApplication } from '../api/brokerApplications';

export default function Contact() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactFormStatus, setContactFormStatus] = useState(''); // 'success', 'error', 'sending', ''

  // ✅ UPDATED: Added a new field for the referral code
  const [brokerForm, setBrokerForm] = useState({ fullName: '', dob: '', phone: '', email: '', experience: '', locations: '', brokerMessage: '', referralCodeUsed: '' });
  const [brokerFormStatus, setBrokerFormStatus] = useState(''); // 'success', 'error', 'sending', ''

  const handleContactFormChange = (e) => {
    setContactForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    setContactFormStatus('sending');
    try {
      await sendContactMessage(contactForm);
      setContactFormStatus('success');
      setContactForm({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (error) {
      setContactFormStatus('error');
      console.error('Error sending contact form:', error);
    }
  };

  const handleBrokerFormChange = (e) => {
    // Correctly handles both the old fields and the new referral code field
    setBrokerForm((prev) => ({ ...prev, [e.target.id.replace('broker-', '')]: e.target.value }));
  };

  const handleBrokerFormSubmit = async (e) => {
    e.preventDefault();
    setBrokerFormStatus('sending');
    try {
      await submitBrokerApplication(brokerForm);
      setBrokerFormStatus('success');
      // ✅ UPDATED: Clears the new field after successful submission
      setBrokerForm({ fullName: '', dob: '', phone: '', email: '', experience: '', locations: '', brokerMessage: '', referralCodeUsed: '' });
    } catch (error) {
      setBrokerFormStatus('error');
      console.error('Error submitting broker form:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 py-16 sm:py-20">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        <header className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 drop-shadow-md">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-gray-700 text-xl max-w-3xl mx-auto">
            We're here to help you with all your real estate needs. Reach out to us today!
          </p>
        </header>

        <section className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-8 inline-block">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-xl shadow-md">
              <PhoneCall size={48} strokeWidth={1.5} className="text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-700">+91 8860719916</p>
              <p className="text-gray-700">+91 9871309875</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-xl shadow-md">
              <Mail size={48} strokeWidth={1.5} className="text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-700">pixienestbuildwell35@gmail.com</p>
              <p className="text-gray-700"></p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-xl shadow-md">
              <MapPin size={48} strokeWidth={1.5} className="text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Registered Office</h3>
              <p className="text-gray-700">176, Vikas Nagar, Loni Ghaziabad, U.P 201102</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-xl shadow-md">
              <MapPin size={48} strokeWidth={1.5} className="text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Corporate Office</h3>
              <p className="text-gray-700">2nd Floor, SBI Grahak Seva Kendra Building
                                          Major Mohit Sharma Marg, near Sahni Tower
                                          Rajendra Nagar, Sector 5
                                          Sahibabad, Ghaziabad, Uttar Pradesh - 201005</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-8 inline-block">Send Us a Message</h2>
          <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleContactFormSubmit}>
            <div>
              <label htmlFor="name" className="block text-gray-700 text-lg font-semibold mb-2">Your Name</label>
              <input type="text" id="name" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" placeholder="Enter your full name" value={contactForm.name} onChange={handleContactFormChange} required />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-lg font-semibold mb-2">Your Email</label>
              <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" placeholder="your.email@example.com" value={contactForm.email} onChange={handleContactFormChange} required />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700 text-lg font-semibold mb-2">Subject</label>
              <input type="text" id="subject" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" placeholder="Regarding property inquiry, partnership, etc." value={contactForm.subject} onChange={handleContactFormChange} required />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-lg font-semibold mb-2">Your Message</label>
              <textarea id="message" rows="5" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" placeholder="Type your message here..." value={contactForm.message} onChange={handleContactFormChange} required></textarea>
            </div>
             <div className="text-center">
                <button
                type="submit"
                className="inline-flex items-center justify-center px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                disabled={contactFormStatus === 'sending'}
              >
                {contactFormStatus === 'sending' ? 'Sending...' : <><Send size={20} className="mr-2" /> Send Message</>}
              </button>
            </div>
            {contactFormStatus === 'success' && <p className="text-center text-green-600 mt-4 font-semibold">Message sent successfully!</p>}
            {contactFormStatus === 'error' && <p className="text-center text-red-600 mt-4 font-semibold">Failed to send message. Please try again.</p>}
          </form>
        </section>

        <section className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-green-500 pb-4 mb-8 inline-block">Join Our Network</h2>
          <p className="text-gray-800 leading-relaxed text-lg max-w-3xl mx-auto mb-8">
            Are you a passionate and professional real estate agent looking to expand your reach and grow with a trusted partner? Join PixieNest Buildwell  esteemed network! (charges may apply)
          </p>
          <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleBrokerFormSubmit}>
            <div>
              <label htmlFor="broker-fullName" className="block text-gray-700 text-lg font-semibold mb-2">Full Name</label>
              <input type="text" id="broker-fullName" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" placeholder="Enter your full name" value={brokerForm.fullName} onChange={handleBrokerFormChange} required />
            </div>
            <div>
              <label htmlFor="broker-dob" className="block text-gray-700 text-lg font-semibold mb-2">Date of Birth</label>
              <input type="date" id="broker-dob" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" value={brokerForm.dob} onChange={handleBrokerFormChange} required />
            </div>
            <div>
              <label htmlFor="broker-phone" className="block text-gray-700 text-lg font-semibold mb-2">Contact Number</label>
              <input type="tel" id="broker-phone" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" placeholder="e.g., +91 9876543210" value={brokerForm.phone} onChange={handleBrokerFormChange} required />
            </div>
            <div>
              <label htmlFor="broker-email" className="block text-gray-700 text-lg font-semibold mb-2">Email Address</label>
              <input type="email" id="broker-email" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" placeholder="your.broker.email@example.com" value={brokerForm.email} onChange={handleBrokerFormChange} required />
            </div>
            <div>
              <label htmlFor="broker-experience" className="block text-gray-700 text-lg font-semibold mb-2">Years of Experience in Real Estate</label>
              <input type="number" id="broker-experience" min="0" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" placeholder="e.g., 5" value={brokerForm.experience} onChange={handleBrokerFormChange} />
            </div>
            <div>
              <label htmlFor="broker-locations" className="block text-gray-700 text-lg font-semibold mb-2">Preferred Operating Locations</label>
              <textarea id="broker-locations" rows="3" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" placeholder="List cities or regions where you primarily operate" value={brokerForm.locations} onChange={handleBrokerFormChange}></textarea>
            </div>
            {/* ✅ NEW REFERRAL CODE INPUT FIELD */}
            <div>
              <label htmlFor="broker-referralCodeUsed" className="block text-gray-700 text-lg font-semibold mb-2">Referral Code (Optional)</label>
              <div className="relative">
                <Tag size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="broker-referralCodeUsed"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-gray-900"
                  placeholder="Enter a referral code if you have one"
                  value={brokerForm.referralCodeUsed}
                  onChange={handleBrokerFormChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="broker-message" className="block text-gray-700 text-lg font-semibold mb-2">Brief Message (Optional)</label>
              <textarea id="broker-message" rows="3" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" placeholder="Tell us a bit about yourself or your specialization" value={brokerForm.brokerMessage} onChange={handleBrokerFormChange}></textarea>
            </div>
            <div className="text-center">
                <button
                type="submit"
                className="inline-flex items-center justify-center px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                disabled={brokerFormStatus === 'sending'}
              >
                {brokerFormStatus === 'sending' ? 'Submitting...' : <><UserPlus size={20} className="mr-2" /> Submit Application</>}
            </button>
            </div>
            {brokerFormStatus === 'success' && <p className="text-center text-green-600 mt-4 font-semibold">Application submitted successfully! We will review it and get back to you.</p>}
            {brokerFormStatus === 'error' && <p className="text-center text-red-600 mt-4 font-semibold">Failed to submit application. Please try again.</p>}
          </form>
        </section>

        {/* ... Map section */}
        <section className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-8 inline-block">Find Us on the Map</h2>
          <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.3510993447157!2d77.3567899761921!3d28.67914218196133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfbf26ab05e39%3A0x50df6e2cf4c4b8dc!2sPixieNest%20Buildwell%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1756010262316!5m2!1sen!2sin" 
              className="w-full h-full border-0"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Office Location"
            ></iframe>
          </div>
        </section>
        
      </div>
    </main>
  );
}