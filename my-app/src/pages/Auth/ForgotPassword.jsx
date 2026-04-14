// src/pages/Auth/ForgotPassword.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authAPI from '../../api/auth.js'; // Ensure this path is correct
import { Mail, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (emailAddress) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(emailAddress);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setLoading(true);
    try {
      // --- THIS IS THE API CALL ---
      // It calls the 'forgotPassword' function from your auth.js file.
      await authAPI.forgotPassword({ email });
      
      setSuccess('If an account with that email exists, a password reset link has been sent.');
      setTimeout(() => navigate('/login'), 5000);

    } catch (err) {
      // For security, we show a generic success message even on an error,
      // but the real error will be in your browser's developer console (F12).
      setSuccess('If an account with that email exists, a password reset link has been sent.');
      console.error('Forgot password error:', err);
      setTimeout(() => navigate('/login'), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">
            Forgot Password
          </h1>
          <p className="text-slate-500">
            No problem! We'll send you a link to reset it.
          </p>
        </div>

        {success && (
          <div className="flex items-center p-4 text-center bg-green-50 text-green-800 rounded-lg border border-green-200">
            <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0 text-green-500" />
            <p className="font-semibold">{success}</p>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-800 rounded-lg placeholder-slate-400 border transition-colors ${
                    error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                  } focus:outline-none focus:ring-2`}
                />
              </div>
              {error && (
                <div className="flex items-center text-red-600 text-sm font-medium mt-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={!email || !validateEmail(email) || loading}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}
        
        <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
          <Link to="/login" className="font-medium text-blue-700 hover:text-blue-600 transition-colors">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}