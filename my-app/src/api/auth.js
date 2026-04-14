import api from './apiClient'; // The configured axios instance is imported as 'api'

const LS_KEY = 'userInfo';

/**
 * Get the currently logged-in user data from localStorage.
 */
export function getCurrentUser() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse user data from localStorage", e);
    return null;
  }
}

/**
 * Register a new user.
 */
export async function register(userData) {
  const response = await api.post('/auth/register', userData);
  return response.data;
}

/**
 * Verify the user's OTP.
 */
export async function verifyOtp(otpData) {
  const response = await api.post('/auth/verify-otp', otpData);
  return response.data;
}

/**
 * Log in with email and password.
 */
export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials);
  if (data && data.token) {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(LS_KEY);
  }
  return data;
}

/**
 * Log out by clearing localStorage.
 */
export function logout() {
  localStorage.removeItem(LS_KEY);
}
   
// --- Forgot Password ---
export const forgotPassword = async (emailData) => {
  // --- FIX: Use 'api' instead of 'apiClient' ---
  const { data } = await api.post('/auth/forgot-password', emailData);
  return data;
};

// --- Reset Password ---
export const resetPassword = async (token, passwordData) => {
  // --- FIX: Use 'api' instead of 'apiClient' ---
  const { data } = await api.post(`/auth/reset-password/${token}`, passwordData);
  return data;
};