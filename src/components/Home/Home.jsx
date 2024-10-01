import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { id: "classic", name: "Classics", subject: "classics" },
  { id: "fantasy", name: "Fantasy", subject: "fantasy" },
  { id: "thrillers", name: "Thrillers", subject: "thrillers" },
  { id: "nonfiction", name: "Non-Fiction", subject: "nonfiction" },
];

const BookCarousel = ({ books, category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);

  const updateSlidesToShow = () => {
    if (window.innerWidth >= 1024) {
      setSlidesToShow(5);
    } else if (window.innerWidth >= 768) {
      setSlidesToShow(4);
    } else {
      setSlidesToShow(2);
    }
  };

  useEffect(() => {
    updateSlidesToShow(); // Initial calculation
    window.addEventListener("resize", updateSlidesToShow); // Adjust on resize

    return () => {
      window.removeEventListener("resize", updateSlidesToShow); // Clean up on unmount
    };
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      // Prevent moving beyond the last visible set of slides
      if (prevIndex >= books.length - slidesToShow) {
        return 0; // Go back to the first slide
      }
      return prevIndex + 1;
    });
  }, [books.length, slidesToShow]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return books.length - slidesToShow; // Jump to the last set of slides
      }
      return prevIndex - 1;
    });
  }, [books.length, slidesToShow]);

  return (
    <div className="relative mb-8">
      <h2 className="text-2xl font-bold mb-4">{category}</h2>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
          }}
        >
          {books.map((book) => (
            <div
              key={book.key}
              className="w-1/2 md:w-1/4 lg:w-1/5 flex-shrink-0 px-2"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                    {book.authors?.map((author) => author.name).join(", ")}
                  </p>
                  <button className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    {book.availability || "Check Availability"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default function BookLibrary() {
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const categoryPromises = categories.map(async (category) => {
          const response = await fetch(
            `https://openlibrary.org/subjects/${category.subject}.json?limit=10`
          );
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          return {
            category: category.id,
            books: data.works.map((book) => ({
              ...book,
              availability: [
                "Not in Library",
                "Checked Out",
                "Join Waitlist",
                "Borrow",
                "Read",
              ][Math.floor(Math.random() * 5)],
            })),
          };
        });

        const results = await Promise.all(categoryPromises);
        const booksByCategory = results.reduce((acc, { category, books }) => {
          acc[category] = books;
          return acc;
        }, {});

        setBooks(booksByCategory);
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch books:", e);
        setError("Failed to load books. Please try again later.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="text-center py-10">Loading books...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100">
      {categories.map((category) => (
        <BookCarousel
          key={category.id}
          books={books[category.id] || []}
          category={category.name}
        />
      ))}
    </div>
  );
}
