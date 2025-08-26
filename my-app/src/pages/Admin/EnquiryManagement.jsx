// src/pages/Admin/EnquiryManagement.jsx

import React, { useEffect, useState } from 'react';
import { getEnquiries } from '../../api/enquiries.js';
import { ShieldAlert, LoaderCircle } from 'lucide-react';

export default function EnquiryManagement() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const data = await getEnquiries();
        setEnquiries(data);
      } catch (err) {
        setError('Failed to fetch enquiries. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircle className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50 p-6 rounded-lg">
        <ShieldAlert className="w-12 h-12 mb-4" />
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">
        Property Enquiries
      </h1>

      {enquiries.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          There are no enquiries yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Contact Info</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Property</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enquiries.map((enquiry) => (
                <tr key={enquiry._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap">{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">{enquiry.user?.fullName}</td>
                  
                  {/* --- THIS IS THE CHANGE --- */}
                  <td className="py-4 px-4 whitespace-nowrap text-gray-600 hidden md:table-cell">
                    <div>{enquiry.user?.email}</div>
                    {enquiry.user?.phoneNumber && (
                      <div className="text-xs text-gray-500 mt-1">{enquiry.user.phoneNumber}</div>
                    )}
                  </td>
                  
                  <td className="py-4 px-4 whitespace-nowrap text-gray-600">{enquiry.property?.title}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                      {enquiry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}