import React from 'react';
// 1. Import 'Link' from react-router-dom
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js';
import { LayoutDashboard, Users, MapPin, LogOut, MessageSquare } from 'lucide-react';

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3 rounded-lg text-lg font-medium transition-all duration-200 ease-in-out
     ${isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
     }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white text-gray-800 p-6 flex flex-col shadow-2xl border-r border-gray-200">
        <div className="mb-10 text-center">
          {/* 2. Wrap the h2 tag with the Link component */}
          <Link to="/" label='Home'>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
              PNBW <span className="text-blue-600">Admin</span>
            </h2>
          </Link>
          {user && (
            <p className="text-sm text-gray-500 mt-2">Welcome, {user.fullName || 'Admin User'}</p>
          )}
        </div>

        <nav className="flex-1 space-y-3">
          <NavLink to="/admin" end className={navLinkClass}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClass}>
            <Users size={20} /> User Management
          </NavLink>
          <NavLink to="/admin/properties" className={navLinkClass}>
            <MapPin size={20} /> Property Management
          </NavLink>
          <NavLink to="/admin/enquiries" className={navLinkClass}>
            <MessageSquare size={20} /> Enquiries
          </NavLink>
        </nav>

        {/* User & Logout */}
        {user && (
          <div className="mt-auto pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || 'https://i.pravatar.cc/40?img=6'}
                alt="Admin avatar"
                className="w-10 h-10 rounded-full border-2 border-blue-400 shadow-md"
              />
              <span className="text-gray-800 font-semibold">{user.fullName || 'Admin'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-md"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}