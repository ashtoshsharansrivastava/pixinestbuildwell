import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Base navigation links
  let navLinks = [
    { to: '/', label: 'Home', exact: true },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/properties', label: 'Properties' },
    { to: '/contact', label: 'Contact' },
  ];

  // --- UPDATED LOGIC (Kept exactly as provided) ---
  if (user && user.role === 'admin') {
    const adminLink = { to: '/admin', label: 'Admin Dashboard' };
    navLinks.splice(1, 0, adminLink);
  } else if (user && user.role === 'broker') {
    const brokerLink = { to: '/broker', label: 'Agent Dashboard' };
    navLinks.splice(1, 0, brokerLink);
  }
  // --- END OF UPDATED LOGIC ---

  // Adjusted padding (px-6 -> px-4) to fit better on smaller laptops
  const btnBase =
    'px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base lg:text-lg rounded-full font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md backdrop-blur-sm whitespace-nowrap';
  
  const navIdle =
    'text-gray-700 hover:text-amber-500 hover:drop-shadow-[0_0_8px_rgba(255,191,0,0.6)]';
  
  const navActive =
    'text-amber-600 border-b-4 border-amber-600 pb-1.5 font-extrabold drop-shadow-[0_0_6px_rgba(255,191,0,0.8)]';
  
  const authBtn =
    'bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white hover:from-amber-600 hover:via-orange-700 hover:to-red-700 shadow-lg hover:shadow-amber-500/50';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        
        {/* Logo & Title Section */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 lg:gap-4 flex-shrink-0 z-50">
          <motion.img
            src="/images/logo.jpg"
            alt="PNBW Official Logo"
            // Adjusted size: slightly smaller on mobile to save space
            className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-2 md:border-4 border-amber-400 shadow-[0_0_10px_rgba(255,191,0,0.8)]"
            initial={{ rotate: 0, scale: 1 }}
            whileHover={{ rotate: 12, scale: 1.12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          />
          <motion.h1
            // DRASTIC CHANGE HERE: Reduced text size significantly to fix the layout
            // Mobile: text-lg, Tablet: text-2xl, Desktop: text-3xl
            className="font-extrabold tracking-wide whitespace-nowrap text-lg sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
          >
            <span
              className="bg-gradient-to-b from-[#000000] to-[#ff3b3b] bg-clip-text text-transparent drop-shadow-[0_0_4px_rgba(0,0,0,0.65)]"
            >
              PixieNest BuildWell
            </span>
          </motion.h1>
        </Link>

        {/* Mobile Menu Toggle Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 rounded-md p-2"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? (
              // X Icon for close
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              // Hamburger Icon (Standard for menu) instead of vertical dots
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        {/* Changed 'hidden md:flex' to 'hidden lg:flex' to handle the wide logo better on tablets */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8">
          <nav className="flex gap-2 xl:gap-6">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `${btnBase} ${isActive ? navActive : navIdle}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {user ? (
            <motion.button
              onClick={handleLogout}
              className={`${btnBase} ${authBtn}`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              Logout
            </motion.button>
          ) : (
            <Link to="/login" className={`${btnBase} ${authBtn}`}>
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden w-full bg-white shadow-xl border-t border-gray-200 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-3">
              {navLinks.map(({ to, label, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `w-full text-center py-3 text-lg ${isActive ? 'text-amber-600 font-bold bg-amber-50 rounded-lg' : 'text-gray-700 hover:bg-gray-50 rounded-lg'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="w-full pt-2 border-t border-gray-100 mt-2">
                {user ? (
                  <motion.button
                    onClick={handleLogout}
                    className={`w-full ${btnBase} ${authBtn} py-3 justify-center flex`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Logout
                  </motion.button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex justify-center items-center ${btnBase} ${authBtn} py-3`}
                  >
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}