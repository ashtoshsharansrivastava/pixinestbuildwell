import React, { useState, useEffect } from 'react';
import * as propertiesApi from '../../api/properties.js'; // Use the correct properties API
import { Home, MapPin, Edit, Trash2, PlusCircle } from 'lucide-react';
import AddPropertyModal from '../../components/AddPropertyModal.jsx';

// Renamed component to PropertyManagement
export default function PropertyManagement() {
  const [properties, setProperties] = useState([]); // State now holds properties
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

  // Fetch properties from the backend when the component mounts
  useEffect(() => {
    async function fetchProperties() {
      try {
        setIsLoading(true);
        const data = await propertiesApi.getProperties();
        setProperties(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // Handler to delete a property
  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property permanently?')) {
      try {
        await propertiesApi.deleteProperty(id);
        setProperties(prevProperties => prevProperties.filter(p => p._id !== id));
      } catch (err)
      {
        console.error('Failed to delete property:', err);
        alert('Failed to delete property.');
      }
    }
  };

  // --- UPDATED FUNCTION ---
  // This function handles the form data submission to the backend.
  const handleAddProperty = async (formData) => {
    try {
      const data = new FormData();

      // Iterate over the form data and append it to the FormData object
      for (const key in formData) {
        if (key === 'images') {
          // Append each image file directly. Multer handles arrays of files.
          formData.images.forEach(file => {
            data.append('images', file);
          });
        } else if (Array.isArray(formData[key])) {
          // Convert arrays (like amenities and videoUrls) to JSON strings
          // so they can be parsed on the backend.
          data.append(key, JSON.stringify(formData[key]));
        } else {
          // Append all other non-empty fields
          if (formData[key] !== null && formData[key] !== '') {
            data.append(key, formData[key]);
          }
        }
      }

      // Call the API with the FormData object
      const newProperty = await propertiesApi.createProperty(data);

      // Add the newly created property to the top of the list
      setProperties(prev => [newProperty, ...prev]);

      // Close the modal on success
      setShowAddPropertyModal(false);

    } catch (err) {
      console.error('Failed to add property:', err);
      // Provide user-friendly feedback
      alert('Failed to add property. Please check the form data and try again.');
    }
  };


  if (isLoading) {
    return <div className="p-6 text-center text-lg font-semibold">Loading properties...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-10 p-6 bg-white rounded-xl shadow-xl border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-4 inline-block">
        Property Management
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowAddPropertyModal(true)}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <PlusCircle size={20} className="mr-2" /> Add New Property
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">All Properties</h2>
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-blue-50 text-blue-800 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Property Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.length > 0 ? (
                properties.map((p) => (
                  <tr key={p._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 font-semibold text-lg text-gray-900 flex items-center gap-2">
                      <Home size={18} className="text-gray-500" /> {p.title}
                    </td>
                    <td className="px-4 py-3 text-gray-700 flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" /> {p.locality}, {p.city}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => alert(`Editing property ID: ${p._id}`)} // Placeholder for edit
                          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit Property"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(p._id)}
                          className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500 text-lg">
                    No properties found. You can add one using the button above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddPropertyModal && <AddPropertyModal onClose={() => setShowAddPropertyModal(false)} onAddProperty={handleAddProperty} />}
    </div>
  );
}
