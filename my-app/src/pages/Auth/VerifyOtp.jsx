import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore'; // Ensure correct path

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const verifyOtp = useAuthStore((state) => state.verifyOtp);

  useEffect(() => {
    // Get email from the state passed during navigation
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      setError("Email and OTP are required.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // --- FIX IS HERE: Pass email and otp as separate arguments ---
      await verifyOtp(email, otp); 
      alert('Email verified successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="bg-indigo-600 text-white text-center py-4">
          <h1 className="text-2xl font-bold">Verify Your Account</h1>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-center">
            An OTP has been sent to your email address. Please enter it below.
          </p>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>}

          <label className="block">
            <span className="text-gray-700">Email Address</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              // Disable if email was passed from register page
              disabled={!!location.state?.email}
              className="mt-1 block w-full px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 transition disabled:bg-gray-200"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">One-Time Password (OTP)</span>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 transition"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition disabled:bg-indigo-400"
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </div>

        <div className="bg-gray-50 text-center py-4">
          <p className="text-sm text-gray-700">
            Didn't receive an OTP?{' '}
            <Link
              to="/register"
              className="text-indigo-600 hover:underline font-medium"
            >
              Register again
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
