import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAvailability } from "../utils/firebase/fetchDB";
import { useNavigate } from "react-router-dom";
import { increaseCart } from "../utils/checkoutSlice";
import swal from "sweetalert";
import { fetchBooks } from "../utils/firebase/userActions";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const BookSearch = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filters, setFilters] = useState({
    authors: new Set(),
    subjects: new Set(),
    years: new Set(),
  });
  const [selectedFilters, setSelectedFilters] = useState({
    authors: new Set(),
    subjects: new Set(),
    years: new Set(),
  });
  const [expandedSections, setExpandedSections] = useState({
    authors: true,
    subjects: true,
    years: true,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [needsFetch, setNeedsFetch] = useState(true);
  const name = useSelector((state) => state.book.book);
  const url = useSelector((state) => state.book.url);
  const loggedIn = useSelector((state) => state.status.signedIn);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.checkout.cart);
  const booksList = useSelector((state) => state.checkout.books);
  const user = useSelector((state) => state.status.username);
  const dispatch = useDispatch();

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        debounce((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        }, 300),
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const checkoutFn = async (book) => {
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    try {
      const ans = await fetchBooks(user);
      if (
        !booksList.includes(book.title) &&
        !ans.includes(book.title) &&
        ans.length + cart < 5
      ) {
        dispatch(increaseCart(book.title));
        swal("Alright!", "Your book has been added to cart!", "success");
      } else {
        if (booksList.includes(book.title) || ans.includes(book.title)) {
          swal("Oops!", "You already have a copy of this book!", "error");
        } else if (ans.length + cart === 5) {
          swal(
            "Oops!",
            "Only a maximum of 5 books can be borrowed at a time!",
            "error"
          );
        }
      }
    } catch (err) {
      console.log(err);
      swal("Oops!", "Something went wrong, please try again later", "error");
    }
  };

  useEffect(() => {
    if (name) {
      setBooks([]);
      setPage(1);
      setHasMore(true);
    }
  }, [name]);

  useEffect(() => {
    fetchAllBooks();
  }, [name, page]);

  useEffect(() => {
    if (!needsFetch) return;
    const updateBooks = async () => {
      if (books && books.some((book) => !book.copiesAvailable)) {
        const bookTitles = books.map((book) => book.title);
        const availabilityMap = await setAvailability(bookTitles);

        const updatedBooks = books.map((book) => ({
          ...book,
          copiesAvailable: availabilityMap[book.title] || 0,
        }));
        setBooks(updatedBooks);
        setNeedsFetch(false);
      }
    };

    updateBooks();
  }, [books]);

  useEffect(() => {
    applyFilters();
  }, [selectedFilters, books]);

  const fetchAllBooks = async () => {
    if (!hasMore) return;
    setLoading(true);
    let tempBooks = [];
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${url}&page=${page}&limit=30`
      );
      const data = await response.json();
      if (data.docs.length === 0) {
        setHasMore(false);
      } else {
        tempBooks = [...books, ...data.docs];
        setNeedsFetch(true);
        updateFilters(data.docs);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setBooks(tempBooks);
      setLoading(false);
    }
  };

  const updateFilters = (newBooks) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      newBooks.forEach((book) => {
        book.author_name?.forEach((author) =>
          updatedFilters.authors.add(author)
        );
        book.subject?.forEach((subject) =>
          updatedFilters.subjects.add(subject)
        );
        if (book.first_publish_year)
          updatedFilters.years.add(book.first_publish_year);
      });
      return updatedFilters;
    });
  };

  const applyFilters = () => {
    const filtered = books.filter(
      (book) =>
        (selectedFilters.authors.size === 0 ||
          book.author_name?.some((author) =>
            selectedFilters.authors.has(author)
          )) &&
        (selectedFilters.subjects.size === 0 ||
          book.subject?.some((subject) =>
            selectedFilters.subjects.has(subject)
          )) &&
        (selectedFilters.years.size === 0 ||
          (book.first_publish_year &&
            selectedFilters.years.has(book.first_publish_year)))
    );
    setFilteredBooks(filtered);
  };

  const handleFilterChange = (category, value) => {
    setSelectedFilters((prev) => {
      const newSet = new Set(prev[category]);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return { ...prev, [category]: newSet };
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
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </button>
      {expandedSections[category] && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {Array.from(filters[category]).map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFilters[category].has(option)}
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

  const ShimmerEffect = () => (
    <div className="animate-pulse bg-gray-200 rounded-md h-[300px] w-full"></div>
  );

  const BookCard = memo(
    ({ book, checkoutFn, lastBookElementRef, index, filteredBooksLength }) => (
      <div
        key={book.cover_i}
        ref={index === filteredBooksLength - 1 ? lastBookElementRef : null}
        className="bg-white p-4 rounded shadow md:h-[300px] flex flex-col justify-between"
      >
        <h3 className="font-bold text-lg mb-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {book.author_name ? book.author_name.join(", ") : "Unknown author"}
        </p>
        {book.first_publish_year && (
          <p className="text-sm text-gray-500 mb-2">
            First published: {book.first_publish_year}
          </p>
        )}
        {book.subject && (
          <p className="text-xs text-gray-400">
            Genres: {book.subject.slice(0, 3).join(", ")}
            {book.subject.length > 3 && "..."}
          </p>
        )}
        {book.copiesAvailable && book.copiesAvailable ? (
          <>
            <p className="bg-teal-400 p-3 rounded-lg mt-3 text-center">
              Copies: {book.copiesAvailable}
            </p>
            <button
              className="bg-green-500 rounded-lg p-3 text-center"
              onClick={() => checkoutFn(book)}
            >
              Borrow
            </button>
          </>
        ) : (
          <>
            <p className="bg-teal-400 p-3 rounded-lg mt-3 text-center">
              No copies
            </p>
            <button
              disabled
              className="bg-slate-500 rounded-lg p-3 text-center w-full"
            >
              Borrow
            </button>
          </>
        )}
      </div>
    )
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            {renderFilterSection("Authors", "authors")}
            {renderFilterSection("Genres", "subjects")}
            {renderFilterSection("Publish Years", "years")}
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          <h1 className="text-lg">
            Results for: <span className="font-bold">{name}</span>
          </h1>
          <h2 className="text-lg">
            Number of copies:{" "}
            <span className="font-bold">
              {filteredBooks
                .map((book) => book.copiesAvailable)
                .reduce((acc, num) => acc + num, 0)}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book, index) => (
              <BookCard
                key={book.cover_i}
                book={book}
                checkoutFn={checkoutFn}
                lastBookElementRef={
                  index === filteredBooks.length - 1 ? lastBookElementRef : null
                }
                index={index}
                filteredBooksLength={filteredBooks.length}
              />
            ))}
            {loading && (
              <>
                <ShimmerEffect />
                <ShimmerEffect />
                <ShimmerEffect />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookSearch;
