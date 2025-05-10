import React from "react";

const Filters = ({ onFilterChange }) => {
  return (
    <div className="filters space-y-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search events"
        onChange={(e) => onFilterChange("keyword", e.target.value)}
        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Event Type Filter */}
      <select
        onChange={(e) => onFilterChange("type", e.target.value)}
        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">All Types</option>
        <option value="music">Music</option>
        <option value="sports">Sports</option>
        <option value="cultural">Cultural</option>
      </select>

      {/* Date Filter */}
      <input
        type="date"
        onChange={(e) => onFilterChange("date", e.target.value)}
        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};

export default Filters;
