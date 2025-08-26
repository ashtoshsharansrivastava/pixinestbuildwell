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

  // --- UPDATED LOGIC ---
  // The link now correctly points to the appropriate dashboard
  if (user && user.role === 'admin') {
    const adminLink = { to: '/admin', label: 'Admin Dashboard' };
    navLinks.splice(1, 0, adminLink);
  } else if (user && user.role === 'broker') {
    const brokerLink = { to: '/broker', label: 'Agent Dashboard' };
    navLinks.splice(1, 0, brokerLink);
  }
  // --- END OF UPDATED LOGIC ---

  const btnBase =
    'px-6 py-2.5 text-lg rounded-full font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md backdrop-blur-sm';
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
    <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between px-4 py-3 md:px-8 md:py-4 bg-white shadow-lg border-b border-gray-200">
      <Link to="/" className="flex items-center gap-3 md:gap-5 flex-grow md:flex-grow-0 justify-center md:justify-start">
        <motion.img
          src="/images/logo.jpg"
          alt="PNBW Official Logo"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 md:border-4 border-amber-400 shadow-[0_0_10px_rgba(255,191,0,0.8)]"
          initial={{ rotate: 0, scale: 1 }}
          whileHover={{ rotate: 12, scale: 1.12 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        />
        <motion.h1
          className="header-title text-4xl md:text-6xl font-extrabold tracking-wide whitespace-nowrap"
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

      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 rounded-md p-2"
          aria-label="Toggle navigation"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="hidden md:flex items-center gap-10">
        <nav className="flex gap-7">
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

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 w-full bg-white py-4 shadow-lg z-40 border-t border-gray-200"
          >
            <nav className="flex flex-col items-center gap-4 px-4">
              {navLinks.map(({ to, label, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `w-full text-center ${btnBase} ${isActive ? navActive : navIdle}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="w-full mt-4">
                {user ? (
                  <motion.button
                    onClick={handleLogout}
                    className={`w-full ${btnBase} ${authBtn} py-3`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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