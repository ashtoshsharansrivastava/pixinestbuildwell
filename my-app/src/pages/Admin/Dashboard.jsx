import React from 'react';
import { Link } from 'react-router-dom';
// 1. Import the new icon
import { Users, MapPin, MessageSquare } from 'lucide-react'; 

export default function Dashboard() {
  return (
    <section className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Admin <span className="text-indigo-600">Dashboard</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Streamline your workflow with essential management tools.
          </p>
        </div>

        {/* 2. Updated grid to have 3 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Manage Users Card */}
          <Link
            to="users"
            className="group flex flex-col items-center justify-center p-10 bg-white rounded-3xl shadow-lg border border-gray-200
                       hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1
                       focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <div className="text-indigo-600 mb-6 transition-all duration-300 group-hover:scale-110">
              <Users size={80} strokeWidth={1.5} />
            </div>
            <span className="text-3xl font-bold text-gray-900 mb-2">Manage Users</span>
            <p className="text-gray-600 text-center text-lg">
              View, edit, and manage user accounts and their roles.
            </p>
          </Link>

          {/* Manage Properties Card */}
          <Link
            to="properties"
            className="group flex flex-col items-center justify-center p-10 bg-white rounded-3xl shadow-lg border border-gray-200
                       hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1
                       focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <div className="text-indigo-600 mb-6 transition-all duration-300 group-hover:scale-110">
              <MapPin size={80} strokeWidth={1.5} />
            </div>
            <span className="text-3xl font-bold text-gray-900 mb-2">Manage Properties</span>
            <p className="text-gray-600 text-center text-lg">
              Add new properties, update existing listings, and manage locations.
            </p>
          </Link>

          {/* 3. Added Manage Enquiries Card */}
          <Link
            to="enquiries"
            className="group flex flex-col items-center justify-center p-10 bg-white rounded-3xl shadow-lg border border-gray-200
                       hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1
                       focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <div className="text-indigo-600 mb-6 transition-all duration-300 group-hover:scale-110">
              <MessageSquare size={80} strokeWidth={1.5} />
            </div>
            <span className="text-3xl font-bold text-gray-900 mb-2">Manage Enquiries</span>
            <p className="text-gray-600 text-center text-lg">
              View and track user interest and follow up on property enquiries.
            </p>
          </Link>

        </div>
      </div>
    </section>
  );
}