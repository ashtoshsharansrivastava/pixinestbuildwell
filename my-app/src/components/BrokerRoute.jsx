// frontend/src/components/BrokerRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function BrokerRoute() {
  const { user } = useAuthStore();

  // If user exists and role is broker, show the nested route
  if (user && user.role === 'broker') {
    return <Outlet />;
  }

  // Otherwise, redirect to the login page
  return <Navigate to="/login" replace />;
}