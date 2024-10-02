import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addData, fetchData } from "../../utils/firebase/fetchDB";
import { increaseCart } from "../../utils/checkoutSlice";
import { useSelector, useDispatch } from "react-redux";
import { pushId } from "../../utils/idSlice";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "../../utils/firebase/userActions";

const categories = [
  { id: "classic", name: "Classic", subject: "classics" },
  { id: "fantasy", name: "Fantasy", subject: "fantasy" },
  { id: "thrillers", name: "Thriller", subject: "thrillers" },
  { id: "nonfiction", name: "Non-Fiction", subject: "nonfiction" },
];

const ShimmerEffect = () => (
  <div className="animate-pulse flex space-x-4">
    <div className="flex-1 space-y-6 py-1">
      <div className="h-60 bg-slate-200 rounded"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-slate-200 rounded col-span-2"></div>
          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
        </div>
        <div className="h-2 bg-slate-200 rounded"></div>
      </div>
    </div>
  </div>
);

const BookCarousel = ({ books, category, setBookCount, setFlag }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const loggedIn = useSelector((state) => state.status.signedIn);
  const user = useSelector((state) => state.status.username);
  const cart = useSelector((state) => state.checkout.cart);
  const booksList = useSelector((state) => state.checkout.books);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateSlidesToShow = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setSlidesToShow(5);
    } else if (window.innerWidth >= 768) {
      setSlidesToShow(4);
    } else {
      setSlidesToShow(2);
    }
  }, []);

  const checkoutFn = async (book) => {
    if (!loggedIn) {
      navigate("/login");
    }
    try {
      const ans = await fetchBooks(user);
      if (
        !booksList.includes(book.title) &&
        !ans.includes(book.title) &&
        ans.length + cart < 5
      ) {
        console.log(book.title);
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
    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);

    (async () => {
      let obj = await fetchData();
      setFlag(true);
      setBookCount(obj);
      dispatch(pushId(obj));
    })();

    return () => {
      window.removeEventListener("resize", updateSlidesToShow);
    };
  }, [updateSlidesToShow, setFlag, setBookCount, dispatch]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= books.length - slidesToShow) {
        return 0;
      }
      return prevIndex + 1;
    });
  }, [books.length, slidesToShow]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return books.length - slidesToShow;
      }
      return prevIndex - 1;
    });
  }, [books.length, slidesToShow]);

  return (
    <div className="relative mb-8">
      <h2 className="text-2xl font-bold mb-4">
        Popular {category.toLowerCase()} books
      </h2>
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
              className="w-1/2 md:w-1/4 lg:w-1/5 max-h-[500px] flex-shrink-0 px-2"
            >
              <div className="bg-white rounded-lg shadow-md h-full overflow-hidden">
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-1/2 object-cover"
                />
                <div className="flex flex-col justify-between p-4 h-1/2">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                    {book.authors?.map((author) => author.name).join(", ")}
                  </p>
                  <section>
                    <button className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                      Copies: {book.availability || "Check Availability"}
                    </button>
                    <button
                      className={`w-full py-2 px-4 ${
                        book.availability > 0 ? "bg-green-400" : "bg-gray-500"
                      } text-white rounded hover:bg-green-500 transition-colors mt-2`}
                      disabled={!book.availability}
                      onClick={() => checkoutFn(book)}
                    >
                      {book.availability > 0 ? "Borrow" : "No copies"}
                    </button>
                  </section>
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
  const [bookCount, setBookCount] = useState();
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const categoryPromises = categories.map(async (category) => {
          let genre = category.id;
          const response = await fetch(
            `https://openlibrary.org/subjects/${category.subject}.json?limit=10`
          );
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          return {
            category: category.id,
            books: data.works.map((book) => {
              let count =
                bookCount && bookCount[book.title]
                  ? bookCount[book.title][0]
                  : 0;
              let rand = Math.floor(Math.random() * 50);
              if (!count && flag) {
                addData(book.title, book.authors[0].name, genre, rand);
              }
              return {
                ...book,
                availability: count ? count : "Fetching",
              };
            }),
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
  }, [flag, bookCount]);

  if (loading)
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100">
        {categories.map((category) => (
          <div key={category.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Popular {category.name.toLowerCase()} books
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, index) => (
                <ShimmerEffect key={index} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100">
      {categories.map((category) => (
        <BookCarousel
          key={category.id}
          books={books[category.id] || []}
          category={category.name}
          setBookCount={setBookCount}
          setFlag={setFlag}
        />
      ))}
    </div>
  );
}
