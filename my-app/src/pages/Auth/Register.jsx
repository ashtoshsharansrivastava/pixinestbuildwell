import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(formData);
      alert('Registration successful! Please check your email for an OTP.');
      // Pass the email to the verification page via state
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
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
          <h1 className="text-2xl font-bold">Create an Account</h1>
        </div>

        <div className="p-6 space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>}

          <label className="block">
            <span className="text-gray-700">Full Name</span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 transition"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Email Address</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 transition"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength="6"
              className="mt-1 block w-full px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 transition"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Phone Number</span>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 555 123 4567"
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 transition"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition disabled:bg-indigo-400"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>

        <div className="bg-gray-50 text-center py-4">
          <p className="text-sm text-gray-700">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-600 hover:underline font-medium"
            >
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
