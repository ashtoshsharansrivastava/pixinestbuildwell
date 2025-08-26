// src/pages/Home.jsx

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as api from '../api/properties';
import SearchBar from '../components/SearchBar.jsx';
import PropertyGrid from '../components/PropertyGrid.jsx';
import Loader from '../components/Loader.jsx'; // Make sure this path is correct

export default function Home() {
  const { search: queryString } = useLocation();
  const navigate = useNavigate();
  const qs = new URLSearchParams(queryString);

  const [search, setSearch] = useState(qs.get('search') || '');
  const [sort, setSort] = useState(qs.get('sort') || 'popular'); 
  const [props, setProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update the URL with search and sort query params
  useEffect(() => {
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (sort) p.set('sort', sort);
    navigate(`/?${p.toString()}`, { replace: true });
  }, [search, sort, navigate]);

  /* Load properties from the API */
  useEffect(() => {
    setLoading(true);
    setError(null);
    api.getProperties()
      .then(data => {
        // Ensure data is an array before setting state
        setProps(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Failed to load properties:", err);
        setError("Failed to load properties. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Sorting and filtering logic
  const display = useMemo(() => {
    let list = props.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.locality?.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase())
    );

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'location-asc':
        list.sort((a, b) => (a.city || '').localeCompare(b.city || ''));
        break;
      case 'location-desc':
        list.sort((a, b) => (b.city || '').localeCompare(a.city || ''));
        break;
      case 'newest':
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      case 'oldest':
        list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        break;
      case 'popular':
      default:
        list.sort((a, b) =>
          (b.views ?? b.rating ?? 0) - (a.views ?? a.rating ?? 0)
        );
        break;
    }

    return list;
  }, [props, search, sort]);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <section className="relative py-20 px-6 bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}>
        <div className="absolute inset-0 bg-white opacity-60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow-lg leading-tight animate-fade-in-up">
            Find Your Dream <span className="text-orange-500">Property</span> Today
          </h1>
          {/* ✅ UPDATED TEXT HERE */}
          <p className="text-xl md:text-2xl text-gray-700 mt-4 max-w-3xl mx-auto drop-shadow animate-fade-in-up delay-200">
            Explore top listings in Delhi-NCR and other premier states across the nation.
          </p>
          <div className="mt-10 flex justify-center animate-fade-in-up delay-400">
            <SearchBar
              value={search}
              onChange={setSearch}
              sort={sort}
              onSort={setSort}
              onSearch={(q) => setSearch(q)}
              className="w-full max-w-4xl bg-white backdrop-blur-sm rounded-xl shadow-2xl p-4 flex items-center space-x-3"
              inputClassName="flex-1 px-4 py-3 text-lg text-gray-900 placeholder-gray-500 rounded-md bg-transparent focus:outline-none"
              selectClassName="px-3 py-3 text-lg text-gray-900 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              buttonClassName="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 space-y-10">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 drop-shadow-md">Featured Properties</h2>
        
        {/* Conditional rendering to prevent crashes */}
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-center text-red-500 text-xl mt-12">{error}</p>
        ) : display.length > 0 ? (
          <div className="flex justify-center">
            <PropertyGrid properties={display} />
          </div>
        ) : (
          <p className="text-center text-gray-500 text-xl mt-12">
            No properties found for “{search}”. Try adjusting your search or filters.
          </p>
        )}
      </section>
    </main>
  );
}