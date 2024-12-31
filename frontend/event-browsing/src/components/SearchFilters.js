import React from 'react';

const SearchFilters = () => {
  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4 h-12 bg-gradient-to-r from-orange-600 to-blue-900 bg-clip-text text-transparent p-4">
  Search for Events
</h2>

        <div className="flex justify-center space-x-4">
          <input
            type="text"
            placeholder="Search by name"
            className="p-2 border border-gray-300 rounded"
          />
          <select className="p-2 border border-gray-300 rounded">
            <option value="">All Categories</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="cultural">Cultural</option>
            <option value="corporate">Corporate</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
