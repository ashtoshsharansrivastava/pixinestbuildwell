import React from 'react';
import { FiSearch } from 'react-icons/fi'; // lightweight search icon

export default function SearchBar({
  /* ------- controlled props ----------------------------------- */
  value,             // search text
  onChange,          // fn(text)
  sort,              // current sort value (eg. "popular")
  onSort,            // fn(value)
  onSearch,          // fn(text)
  /* ------- UI    props ---------------------------------------- */
  sortOptions = [
    { label: 'Popular',             value: 'popular'     },
    { label: 'Price: Low → High',   value: 'price-asc'   },
    { label: 'Price: High → Low',   value: 'price-desc'  },
    { label: 'Newest',              value: 'newest'      },
    { label: 'Oldest',              value: 'oldest'      },
    { label: 'Location: A → Z',     value: 'location-asc'}, // Added location sort
    { label: 'Location: Z → A',     value: 'location-desc'}, // Added location sort
  ],
  className        = '',
  inputClassName   = '',
  selectClassName  = '',
  buttonClassName  = '',
}) {
  /* fire onSearch when user presses <Enter> in the input */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch?.(value);
  };

  return (
    <div className={`flex items-center gap-3 p-2 bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* text field */}
      <input
        type="text"
        placeholder="Search for properties, localities, cities…"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`flex-1 px-4 py-2 text-lg text-gray-800 placeholder-gray-400 rounded-lg bg-transparent focus:outline-none ${inputClassName}`}
      />

      {/* sort dropdown */}
      <select
        value={sort}
        onChange={(e) => onSort?.(e.target.value)}
        className={`px-4 py-2 text-lg text-gray-800 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClassName}`}
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* search button */}
      <button
        onClick={() => onSearch?.(value)}
        className={`px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${buttonClassName}`}
        aria-label="Search"
      >
        <FiSearch className="w-6 h-6" /> {/* Larger icon */}
      </button>
    </div>
  );
}