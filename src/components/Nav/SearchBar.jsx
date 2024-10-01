import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setBook, setUrl } from "../../utils/bookSlice";
import { useNavigate } from "react-router-dom";

const categories = ["Title", "Author", "Genre"];

export default function SearchBar() {
  const [category, setCategory] = useState("Title");
  const data = useSelector((state) => state.book.book);
  const [query, setQuery] = useState("");
  const [urlQuery, setUrlQuery] = useState();
  const [booksMatch, setBooksMatch] = useState();
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchBarRef = useRef(null);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const debouncedSearch = useRef(
    debounce((q) => searchResult(q), 1000)
  ).current;

  async function searchResult(q) {
    let query = "";
    for (let i of q) {
      if (i === " ") {
        query += "+";
      } else if (i === ".") {
        query += "%20";
      } else if (i === "'") {
        query += "%27";
      } else if (i) {
        query += i;
      }
    }

    let res, data;
    if (query) {
      if (category === "Title") {
        console.log(query);
        res = await fetch(
          `https://openlibrary.org/search.json?q=${query}&limit=10`
        );
      } else if (category === "Author") {
        console.log(query);
        res = await fetch(
          `https://openlibrary.org/search.json?author=${query}&limit=10`
        );
      } else if (category === "Genre") {
        console.log(query);
        res = await fetch(
          `https://openlibrary.org/search.json?subject=${query}&limit=10`
        );
      }
      data = await res.json();

      setBooksMatch(data);
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
      let filteredSuggestions;
      if (category === "Genre" || category === "Author") {
        filteredSuggestions = booksMatch.docs.map(
          (suggestion) => suggestion.title
        );
      } else {
        filteredSuggestions = booksMatch.docs.map((suggestion) => {
          if (suggestion.title.toLowerCase().includes(query.toLowerCase())) {
            return suggestion.title;
          }
        });
      }

      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [category, booksMatch]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setShowCategoryDropdown(false);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    let q = "";
    for (let i of suggestion) {
      if (i === " ") {
        q += "+";
      } else if (i === ".") {
        q += "%20";
      } else if (i === "'") {
        q += "%27";
      } else if (i) {
        q += i;
      }
    }
    setQuery("");
    setShowSuggestions(false);
    dispatch(setBook(suggestion));
    dispatch(setUrl(q));
    navigate("/list");
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
