import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const socialIcons = [
    { href: 'https://x.com', icon: Twitter, color: 'hover:text-[#1DA1F2]' },
    { href: 'https://facebook.com', icon: Facebook, color: 'hover:text-[#4267B2]' },
    { href: 'https://instagram.com', icon: Instagram, color: 'hover:text-[#E1306C]' },
    { href: 'https://linkedin.com', icon: Linkedin, color: 'hover:text-[#0077B5]' },
  ];

  return (
    <footer className="bg-white text-gray-900 py-12 sm:py-16 border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-24 flex flex-col sm:flex-row items-center justify-between gap-8">
        {/* Logo and Copyright */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
          <Link to="/" className="flex items-center gap-3">
            <motion.img
              src="/images/logo.jpg"
              alt="PNBW Official Logo"
              className="w-12 h-12 rounded-full object-cover border-4 border-orange-500 shadow-[0_0_15px_rgba(255,100,0,0.4)]"
              initial={{ rotate: 0, scale: 1 }}
              whileHover={{ rotate: -12, scale: 1.12 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            />
            <span className="header-title text-3xl font-extrabold tracking-wide">
              <span className="text-gray-900">
                PixieNest BuildWell
              </span>
            </span>
          </Link>
          <p className="text-gray-600 text-sm mt-2">
            © {new Date().getFullYear()} PixieNest BuildWell Pvt Ltd. All rights reserved.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex gap-6 text-2xl">
          {socialIcons.map(({ href, icon: Icon, color }) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-500 ${color} transition-colors duration-300 transform hover:scale-125`}
              whileHover={{ scale: 1.25 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Icon size={28} />
            </motion.a>
          ))}
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center sm:items-end text-center sm:text-right space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Links</h3>
          <Link to="/" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 text-sm">Home</Link>
          <Link to="/about" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 text-sm">About Us</Link>
          <Link to="/services" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 text-sm">Services</Link>
          <Link to="/properties" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 text-sm">Properties</Link>
          <Link to="/contact" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 text-sm">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

