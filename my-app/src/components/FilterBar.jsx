// src/components/FilterBar.jsx
import { useState } from 'react';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';

const pills = [
  { label: 'Price',    value: 'price'    },
  { label: 'Location', value: 'location' },
  { label: 'Newest',   value: 'newest'   },
  { label: 'Popular',  value: 'popular'  },
];

export default function FilterBar({ sort, setSort }) {
  // track current directions so we can flip arrows
  const [dir, setDir] = useState({ price: 'asc', location: 'asc' });

  const handleClick = (pill) => {
    if (pill.value === 'price' || pill.value === 'location') {
      // flip asc / desc on every click
      const newDir = dir[pill.value] === 'asc' ? 'desc' : 'asc';
      setDir({ ...dir, [pill.value]: newDir });
      setSort(`${pill.value}-${newDir}`);       // → price-asc / price-desc …
    } else {
      setSort(pill.value);                      // → newest / popular
    }
  };

  const isActive = (pill) =>
    pill.value === 'price'    ? sort.startsWith('price') :
    pill.value === 'location' ? sort.startsWith('location') :
    pill.value === sort;

  return (
    <div className="flex flex-wrap gap-3 p-3">
      {pills.map((pill) => (
        <button
          key={pill.value}
          onClick={() => handleClick(pill)}
          className={`h-8 rounded-full px-4 text-sm font-medium flex items-center gap-1
            ${isActive(pill) ? 'bg-skin-accent text-white' : 'bg-skin-surface'}`}
        >
          {pill.label}
          {pill.value === 'price' && (
            dir.price === 'asc' ? <BsChevronUp /> : <BsChevronDown />
          )}
          {pill.value === 'location' && (
            dir.location === 'asc' ? <BsChevronUp /> : <BsChevronDown />
          )}
        </button>
      ))}
    </div>
  );
}
