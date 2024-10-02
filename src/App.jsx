import { useEffect, useState } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home/Home";
import { RouterProvider } from "react-router-dom";
import BooksList from "./components/BooksList";
import UserLogin from "./components/Auth/Login";
import Checkout from "./components/Checkout";
import Profile from "./components/Profile";
import { useDispatch } from "react-redux";
import { setUsername } from "./utils/signedInSlice";
import { toggleSignIn } from "./utils/signedInSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      dispatch(toggleSignIn(true));
      dispatch(setUsername(localStorage.getItem("user")));
    }
  }, []);
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/list",
          element: <BooksList />,
        },
        {
          path: "/login",
          element: <UserLogin />,
        },
        {
          path: "/checkout",
          element: <Checkout />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={route} />
    </>
  );
}

export default App;
