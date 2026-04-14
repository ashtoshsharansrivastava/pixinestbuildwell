import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as authApi from '../../api/auth';
// Import icons for a better UI
import { KeyRound, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await authApi.resetPassword(token, { password });
      setMessage(data.message + ". You will be redirected to the login page shortly.");
      setTimeout(() => navigate('/login'), 4000); // Increased delay for reading the message
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="bg-indigo-600 text-white text-center py-5 px-6">
          <h1 className="text-3xl font-bold tracking-tight">Set a New Password</h1>
          <p className="text-indigo-200 mt-1">Create a strong, new password for your account.</p>
        </div>

        <div className="p-6 sm:p-8">
          {/* Success Message */}
          {message && (
            <div className="flex flex-col items-center text-center p-4 mb-6 bg-green-50 text-green-800 rounded-lg border border-green-200">
              <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
              <p className="font-semibold">{message}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center p-4 mb-6 bg-red-50 text-red-800 rounded-lg border border-red-200">
              <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Form appears only if there's no success message */}
          {!message && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Input */}
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm New Password Input */}
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:-translate-y-0.5 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
