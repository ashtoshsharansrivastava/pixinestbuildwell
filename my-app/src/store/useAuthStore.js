// src/store/useAuthStore.js

import { create } from 'zustand';
import axios from 'axios';
import * as authAPI from '../api/auth.js';

const BACKEND_URL = 'http://localhost:5000';

// Helper function to get user info from localStorage
const getStoredUserInfo = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (e) {
    console.error("Failed to parse user info from localStorage", e);
    return null;
  }
};

export const useAuthStore = create((set) => ({
  // Initialize state by trying to load from localStorage
  user: getStoredUserInfo()?.user || null,
  token: getStoredUserInfo()?.token || null,
  isLoading: false,
  error: null,
  loading: false,
  isAuthenticated: !!getStoredUserInfo(),
  isAdmin: getStoredUserInfo()?.user?.role === 'admin',
  isBroker: getStoredUserInfo()?.user?.role === 'broker',

  init: () => {
    console.log("Auth store initialized. User from storage:", getStoredUserInfo());
  },

  login: async (creds) => {
    set({ loading: true, error: null });
    try {
      const loginResponse = await authAPI.login(creds);
      const { token, ...userData } = loginResponse;

      const userInfoToStore = { user: userData, token: token };
      localStorage.setItem('userInfo', JSON.stringify(userInfoToStore));
      console.log('User info saved to localStorage:', userInfoToStore);

      set({
        user: userData,
        token,
        isAuthenticated: true,
        isAdmin: userData?.role === 'admin',
        isBroker: userData?.role === 'broker',
        loading: false,
        error: null
      });
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, userData);
      set({
        loading: false,
        error: null
      });
      return response.data.message || 'Registration successful. Please check your email for an OTP.';
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  verifyOtp: async (email, otp) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/verify-otp`, { email, otp });
      set({ loading: false, error: null });
      return response.data.message;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'OTP verification failed.';
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null, token: null, isAuthenticated: false, isAdmin: false, isBroker: false });
  },
}));