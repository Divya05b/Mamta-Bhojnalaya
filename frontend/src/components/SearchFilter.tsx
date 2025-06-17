import React, { useState } from 'react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (category: string) => void;
  categories: string[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onFilter, categories }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilter(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div className="w-full md:w-48">
        <select
          onChange={handleFilter}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilter; 