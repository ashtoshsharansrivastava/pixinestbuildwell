// frontend/src/pages/BrokerDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { Navigate, Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard.jsx';
import Loader from '../components/Loader.jsx';
import { User, Home, Eye, CheckCircle, XCircle } from 'lucide-react';
import { getBrokerDashboardData } from '../api/brokers.js';

export default function BrokerDashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [referredBrokers, setReferredBrokers] = useState([]);
  const [loading, setLoading] = useState(true);

  // redirect if not broker
  if (!user || user.role !== 'broker') {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (!user || !(user.id || user._id)) {
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        // use id if available, otherwise fallback to _id
        const brokerId = user.id || user._id;
        const data = await getBrokerDashboardData(brokerId);

        if (data) {
          setStats(data.stats);
          setListings(data.listings);
          setReferredBrokers(data.referredBrokers);
        }
      } catch (err) {
        console.error('Error loading broker dashboard data:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  if (!stats) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-xl border border-gray-100">
        <p className="text-red-600 text-xl font-semibold">
          Couldn’t load dashboard data. Please try again.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '–';
    const lakhs = Math.round(amount / 100000);
    return `₹${lakhs} Lakh`;
  };

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-24 py-8 space-y-10">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center drop-shadow-md">
        Agent <span className="text-blue-600">Dashboard</span>
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatsCard label="Referral Code" value={stats.referralCode ?? '–'} />
        <StatsCard label="Total Referrals" value={referredBrokers?.length ?? 0} />
        <StatsCard label="Active Listings" value={stats.activeListings ?? '–'} />
        <StatsCard label="Profit Earned" value={formatCurrency(stats.profit)} />
      </div>

      {/* Referral Brokers */}
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-emerald-500 pb-4 mb-6 inline-block">
          Your Referral Network
        </h2>
        {referredBrokers && referredBrokers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-emerald-50 text-emerald-800 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Name</th>
                  <th className="px-4 py-3 rounded-tr-lg">Email</th>
                </tr>
              </thead>
              <tbody>
                {referredBrokers.map((broker) => (
                  <tr
                    key={broker.id || broker._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 font-semibold text-lg text-gray-900 flex items-center gap-2">
                      <User size={18} className="text-gray-500" /> {broker.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{broker.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-6 text-center text-gray-500 text-lg">
            You have not referred any brokers yet.
          </p>
        )}
      </div>

      {/* Listings */}
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-6 inline-block">
          Your Listings
        </h2>
        {listings && listings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-blue-50 text-blue-800 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Property</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3 rounded-tr-lg text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((p) => (
                  <tr
                    key={p.id || p._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 font-semibold text-lg text-gray-900 flex items-center gap-2">
                      <Home size={18} className="text-gray-500" /> {p.title}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {p.status === 'published' ? (
                          <CheckCircle size={14} className="mr-1" />
                        ) : (
                          <XCircle size={14} className="mr-1" />
                        )}
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 flex items-center gap-2">
                      <Eye size={16} className="text-gray-400" /> {p.views ?? 0}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/properties/${p.id || p._id}`}
                          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                          title="View Property"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-6 text-center text-gray-500 text-lg">
            You have no active listings.
          </p>
        )}
      </div>
    </section>
  );
}
