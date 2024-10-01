import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Nav/Navbar";

const Layout = () => {
  return (
    <>
      <div className="mx-auto max-w-[1366px]">
        <Navbar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
