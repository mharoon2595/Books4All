import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";

const categories = ["Title", "Author", "Year", "Genre"];

const mockSuggestions = {
  Title: ["The Great Gatsby", "To Kill a Mockingbird", "Pride and Prejudice"],
  Author: ["F. Scott Fitzgerald", "Harper Lee", "Jane Austen"],
  Year: ["1925", "1960", "1813"],
  Genre: ["Novel", "Fiction", "Classic"],
};

export default function SearchBar() {
  const [category, setCategory] = useState("Title");
  const [query, setQuery] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchBarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const filteredSuggestions = mockSuggestions[category].filter(
        (suggestion) => suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query, category]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setShowCategoryDropdown(false);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-2xl mx-5 p-4" ref={searchBarRef}>
      <div className="relative">
        <div className="flex">
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center justify-between w-32 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {category}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute z-10 w-32 mt-1 bg-white rounded-md shadow-lg">
                <ul className="py-1">
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            className="flex-1 px-4 py-2 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={`Search by ${category.toLowerCase()}...`}
          />
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Search className="w-5 h-5" />
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
