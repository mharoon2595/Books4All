import { useState } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home/Home";
import { RouterProvider } from "react-router-dom";
import BooksList from "./components/BooksList";
import UserLogin from "./components/Auth/Login";
import Checkout from "./components/Checkout";

function App() {
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
