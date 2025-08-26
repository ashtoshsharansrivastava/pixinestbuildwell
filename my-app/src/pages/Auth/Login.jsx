import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js';

const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [tab, setTab] = useState('email');
  const [step, setStep] = useState('enterPhone');
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Removed: const [role, setRole] = useState('customer');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const validatePhone = (number) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(number)) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const validateEmail = (emailAddress) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(emailAddress)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError || value.includes('@')) {
      validateEmail(value);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email) || !password) return;

    setLoading(true);
    try {
      // Modified: Removed 'role' from the login call
      const user = await login({ email, password });
      
      if (user && user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    console.log(`Pretending to send OTP to ${phone}`); // Modified: Removed role from log
    setStep('enterOtp');
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
        // Modified: Removed 'role' from the login call
        const user = await login({ phone, otp });

        if (user && user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const isEmailValid = email.length > 0 && !emailError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500">Access your real estate dashboard.</p>
        </div>

        {/* Removed: Role selection UI block */}

        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => { setTab('email'); setError(null); }}
            className={`w-full py-2 rounded-md font-semibold text-sm transition-colors ${
              tab === 'email' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Email & Password
          </button>
          <button
            onClick={() => { setTab('phone'); setStep('enterPhone'); setError(null); }}
            className={`w-full py-2 rounded-md font-semibold text-sm transition-colors ${
              tab === 'phone' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Phone (OTP)
          </button>
        </div>

        <div className="space-y-4">
          {tab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Icon path="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.9-3.563A3.75 3.75 0 1112 15.563a3.75 3.75 0 01-1.15-2.813z" className="w-5 h-5 text-slate-400"/>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  placeholder="example@domain.com"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-800 rounded-lg placeholder-slate-400 border transition-colors ${
                    emailError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                  } focus:outline-none focus:ring-2`}
                />
              </div>
              {emailError && <p className="text-red-600 text-xs font-medium">{emailError}</p>}
              
              <div className="relative">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" className="w-5 h-5 text-slate-400"/>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-800 rounded-lg placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!isEmailValid || !password || loading}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          {tab === 'phone' && (
            <div className="space-y-4">
                {/* ...Phone UI is here... */}
            </div>
          )}

        </div>

        {error && (
          <div className="text-center text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
          <Link to="/forgot-password" className="font-medium text-blue-700 hover:text-blue-600 transition-colors">
            Forgot Password?
          </Link>
          <span className="mx-2">·</span>
          <span>
            New user?{' '}
            <Link to="/register" className="font-medium text-blue-700 hover:text-blue-600 transition-colors">
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}