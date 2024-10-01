import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const filterOptions = {
  authors: [
    "J.K. Rowling",
    "George R.R. Martin",
    "Stephen King",
    "Jane Austen",
    "Mark Twain",
  ],
  genres: ["Fantasy", "Science Fiction", "Mystery", "Romance", "Classic"],
  publishDates: [
    "Before 1950",
    "1950-1999",
    "2000-2010",
    "2011-2020",
    "2021 and later",
  ],
};

export default function FilterTab() {
  const [selectedFilters, setSelectedFilters] = useState({
    authors: [],
    genres: [],
    publishDates: [],
  });
  const [expandedSections, setExpandedSections] = useState({
    authors: true,
    genres: true,
    publishDates: true,
  });

  const handleFilterChange = (category, value) => {
    setSelectedFilters((prevFilters) => {
      const updatedCategory = prevFilters[category].includes(value)
        ? prevFilters[category].filter((item) => item !== value)
        : [...prevFilters[category], value];
      return { ...prevFilters, [category]: updatedCategory };
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderFilterSection = (title, category) => (
    <div className="mb-4">
      <button
        onClick={() => toggleSection(category)}
        className="flex items-center justify-between w-full text-left font-semibold mb-2"
      >
        <span>{title}</span>
        {expandedSections[category] ? (
          <ChevronUp size={20} />
        ) : (
          <ChevronDown size={20} />
        )}
      </button>
      {expandedSections[category] && (
        <div className="space-y-2">
          {filterOptions[category].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFilters[category].includes(option)}
                onChange={() => handleFilterChange(category, option)}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto max-h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Filter Books</h2>
      {renderFilterSection("Authors", "authors")}
      {renderFilterSection("Genres", "genres")}
      {renderFilterSection("Publish Dates", "publishDates")}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Selected Filters:</h3>
        <ul className="list-disc list-inside">
          {Object.entries(selectedFilters).map(([category, filters]) =>
            filters.map((filter) => (
              <li key={`${category}-${filter}`} className="text-sm">
                {filter} <span className="text-gray-500">({category})</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
