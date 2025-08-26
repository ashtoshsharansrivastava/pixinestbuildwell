// src/store/useAuthStore.js
import create from 'zustand';
import * as authAPI from '../api/auth.js';

export const useAuthStore = create((set) => ({
  // initial user (from localStorage)
  user: authAPI.getCurrentUser() || null,

  // login(payload) → { phone, otp } or { email, otp }
  login: async (creds) => {
    const u = await authAPI.login(creds);
    set({ user: u });
    return u;
  },

  // signup(data) → { name, email, phone, applyBroker, ref? }
  signup: async (data) => {
    const u = await authAPI.signup(data);
    set({ user: u });
    return u;
  },

  // clear user
  logout: () => {
    authAPI.logout();
    set({ user: null });
  },
}));
