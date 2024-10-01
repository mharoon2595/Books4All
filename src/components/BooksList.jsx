import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterTab from "./FilterTab";

const BooksList = () => {
  const [data, setData] = useState();
  const name = useSelector((state) => state.book.book);
  const url = useSelector((state) => state.book.url);

  useEffect(() => {
    async function fetchBooks() {
      let response = await fetch(
        `https://openlibrary.org/search.json?q=${url}&limit=10`
      );
      let res = await response.json();
      setData(res.docs);
    }
    fetchBooks();
  }, [name]);
  return (
    <>
      <div className="w-full h-[90vh]">
        <div className="flex h-full p-3">
          <section className="w-1/5 max-h-[90%] overflow-y-auto border-2 border-black rounded-lg mx-auto">
            <FilterTab />
          </section>
          <section className="w-[75%] max-h-[90%] overflow-y-auto border-2 border-black rounded-lg mx-auto">
            <p className="p-2 text-xl">
              Results for: <span className="font-bold">{name}</span>
            </p>
            {data &&
              data.map((book) => (
                <div key={book.key} className="flex items-center mb-4">
                  {book.covers && book.covers.length > 0 ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover_id[0]}-M.jpg`}
                      alt={book.title}
                      className="w-20 h-30 object-cover mr-4"
                    />
                  ) : (
                    <div className="w-20 h-30 bg-gray-300 mr-4"></div> // Placeholder for missing cover
                  )}
                  <div>
                    <h3 className="text-lg font-bold">{book.title}</h3>
                    <p className="text-gray-700">
                      Author(s):{" "}
                      {book.author_name
                        ? book.author_name.join(", ")
                        : "Unknown"}
                    </p>
                    <p className="text-gray-600">
                      Genres: {book.subject ? book.subject.join(", ") : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
          </section>
        </div>
      </div>
    </>
  );
};

export default BooksList;
