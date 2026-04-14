import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader.jsx';
import { getUsers, deleteUser } from '../../api/users.js';
import { getPendingApplications, approveApplication, rejectApplication } from '../../api/brokerApplications.js';
import AddBrokerModal from '../../components/AddBrokerModal.jsx';
import { User, Mail, Phone, Trash2, PlusCircle, Check, X } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersData = await getUsers();
      const applicationsData = await getPendingApplications();
      
      console.log('Received applications data:', applicationsData);
      
      setUsers(usersData);
      setApplications(applicationsData.data);
    } catch (err) {
      setError('Failed to load data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };
  
  const handleBrokerAdded = () => {
    setIsModalOpen(false);
    fetchData();
  };

  const handleApprove = async (appId) => {
    try {
      await approveApplication(appId);
      alert('Broker approved and account created!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve broker.');
    }
  };

  const handleReject = async (appId) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      try {
        await rejectApplication(appId);
        fetchData();
      } catch (err) {
        alert('Failed to reject application.');
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <>
      {isModalOpen && <AddBrokerModal onClose={() => setIsModalOpen(false)} onBrokerAdded={handleBrokerAdded} />}
      
      <div className="space-y-12 p-6 bg-white rounded-xl shadow-xl">
        
        {/* PENDING BROKER APPLICATIONS SECTION */}
        <div>
           <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-amber-500 pb-4 mb-6 inline-block">Pending Broker Applications</h2>
           {applications && applications.length > 0 ? (
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-left">
                  <thead className="bg-amber-50 text-amber-800 uppercase text-sm">
                      <tr>
                        <th className="px-4 py-3">Applicant Name</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Experience</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {applications.map((app) => (
                        <tr key={app._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold text-gray-900">{app.fullName ?? 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-700">{app.email ?? 'N/A'}<br/>{app.phone ?? 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-700">{app.experience ?? 'N/A'} years</td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => handleApprove(app._id)} className="p-2 rounded-full text-green-600 hover:bg-green-100" title="Approve"><Check size={20} /></button>
                            <button onClick={() => handleReject(app._id)} className="p-2 rounded-full text-red-600 hover:bg-red-100" title="Reject"><X size={20} /></button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
            </div>
           ) : <p className="text-gray-500">No pending applications.</p>}
        </div>
        
        {/* USER MANAGEMENT SECTION (UPDATED) */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 inline-block">User Management</h1>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
              <PlusCircle size={20} /> Add Broker Manually
            </button>
          </div>

          {users && users.length > 0 ? (
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-left">
                <thead className="bg-blue-50 text-blue-800 uppercase text-sm">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Properties Listed</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{user.fullName ?? 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-700 capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' ? 'bg-red-200 text-red-800' :
                          user.role === 'broker' ? 'bg-green-200 text-green-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{user.email ?? 'N/A'} <br /> {user.phoneNumber ?? 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-700">{user.propertyCount ?? 0}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleDeleteUser(user._id)} className="p-2 rounded-full text-red-600 hover:bg-red-100" title="Delete User">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </div>

      </div>
    </>
  );
}