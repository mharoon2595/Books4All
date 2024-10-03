import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setBook, setUrl } from "../../utils/bookSlice";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const categories = ["Title", "Author", "Genre"];

export default function SearchBar() {
  const [category, setCategory] = useState("Title");
  const data = useSelector((state) => state.book.book);
  const [query, setQuery] = useState("");
  const [booksMatch, setBooksMatch] = useState();
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchBarRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const debouncedSearch = useRef(debounce((q) => searchResult(q), 300)).current;

  async function searchResult(q) {
    if (!q) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const query = q
      .replace(/\s+/g, "+")
      .replace(/\./g, "%20")
      .replace(/'/g, "%27");
    let res;

    try {
      if (category === "Title") {
        res = await fetch(
          `https://openlibrary.org/search.json?q=${query}&limit=10`
        );
      } else if (category === "Author") {
        res = await fetch(
          `https://openlibrary.org/search.json?author=${query}&limit=10`
        );
      } else if (category === "Genre") {
        res = await fetch(
          `https://openlibrary.org/search.json?subject=${query}&limit=10`
        );
      }

      const data = await res.json();
      setBooksMatch(data);
    } catch (error) {
      await swal("An error occured", "Please try searching again.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  function debounce(fn, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }

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
    if (query.length > 0 && booksMatch) {
      const filteredSuggestions = booksMatch.docs.map(
        (suggestion) => suggestion.title
      );

      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query, booksMatch]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setShowCategoryDropdown(false);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    const q = suggestion
      .replace(/\s+/g, "+")
      .replace(/\./g, "%20")
      .replace(/'/g, "%27");
    setQuery("");
    setShowSuggestions(false);
    dispatch(setBook(suggestion));
    dispatch(setUrl(q));
    navigate("/list");
  };

  const handleSearch = () => {
    if (query) {
      const formattedQuery = query
        .replace(/\s+/g, "+")
        .replace(/\./g, "%20")
        .replace(/'/g, "%27");
      dispatch(setBook(query));
      dispatch(setUrl(formattedQuery));
      navigate("/list");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full" ref={searchBarRef}>
      <div className="relative">
        <div className="flex">
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center justify-between w-24 sm:w-32 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {category}
              <ChevronDown className="w-4 h-4 ml-1 sm:ml-2" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute z-10 w-24 sm:w-32 mt-1 bg-white rounded-md shadow-lg">
                <ul className="py-1">
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
            onKeyPress={handleKeyPress}
            className="flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={`Search by ${category.toLowerCase()}...`}
          />
          <button
            onClick={handleSearch}
            className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
            <ul className="py-1 max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
