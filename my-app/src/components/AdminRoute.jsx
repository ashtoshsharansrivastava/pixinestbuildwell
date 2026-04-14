// src/components/AdminRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

export default function AdminRoute() {
  // --- THIS IS THE FIX ---
  // We select each piece of state individually.
  // This is a stable way to select from the store and prevents infinite loops.
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  // 1. While the store is loading, show a loading message
  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  // 2. After loading, check if user is an admin
  if (!user || user.role !== 'admin') {
    // If not, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // 3. If they are an admin, show the admin page content
  return <Outlet />;
}