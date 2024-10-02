import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBooks } from "../utils/firebase/userActions";
import { removeBook } from "../utils/firebase/userActions";
import { increaseCount } from "../utils/firebase/fetchDB";

const Profile = () => {
  const username = useSelector((state) => state.status.username);
  const userId = useSelector((state) => state.idSlice.userId);
  const bookId = useSelector((state) => state.idSlice.list);
  const [books, setBooks] = useState();

  function returnBook(title) {
    increaseCount(bookId[title][1]);
    removeBook(userId[username], title);
    setBooks((prevBooks) => prevBooks.filter((item) => item !== title));
    removeBook(title);
  }

  useEffect(() => {
    (async () => {
      const res = await fetchBooks(username);
      setBooks(res);
    })();
  }, []);

  const years = [
    2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
  ];
  let readerYear = years[Math.floor(Math.random() * years.length)];

  let keys = [1, 2, 3, 4, 5];

  return (
    <div className="h-[90vh] flex justify-center items-center">
      <div className="max-h-[70%] overflow-y-auto w-[70%] border-2 border-slate-400 p-5 rounded-lg">
        <div className="text-2xl text-center">Hello {username}!</div>
        <p className="text-xl font-light text-center">
          Reader since {readerYear}
        </p>
        <div className="text-left p-2 text-lg">Books borrowed:</div>
        {books &&
          books.map((book, index) => (
            <div
              key={keys[index]}
              className="border-2 p-3 my-3 rounded-md border-black flex justify-between "
            >
              <p>{book}</p>
              <button
                className="bg-yellow-400 rounded-lg p-2 hover:scale-110"
                onClick={() => {
                  returnBook(book);
                }}
              >
                Return
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profile;
