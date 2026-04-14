import React, { useState } from 'react';
import { X, User, Mail, Phone } from 'lucide-react';
import { createBroker } from '../api/users.js';

export default function AddBrokerModal({ onClose, onBrokerAdded }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await createBroker(formData);
      
      if (response && (response.message === 'New broker created successfully.' || response.message === 'User role updated to broker.')) {
        alert(response.message);
        onBrokerAdded();
      } else {
        alert('Broker added, but response was unexpected.');
        onBrokerAdded();
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.response?.data?.message || 'Failed to create broker.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Broker</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" id="fullName" placeholder="Full Name" required onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg text-gray-900" />
          </div>
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" id="email" placeholder="Email Address" required onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg text-gray-900" />
          </div>
           <div className="relative">
            <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="tel" id="phoneNumber" placeholder="Phone Number" required onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg text-gray-900" />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Broker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}