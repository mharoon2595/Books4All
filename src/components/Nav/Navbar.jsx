import React, { useState } from "react";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import SearchBar from "./SearchBar";
import Logo from "../../assets/Books4All.png";

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
  >
    {children}
  </a>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-8 w-auto" src={Logo} alt="Logo" />
            </div>
            {/* <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/services">Services</NavLink>
                <NavLink href="/contact">Contact</NavLink>
              </div>
            </div> */}
          </div>
          <SearchBar />
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                <span>Login</span>
              </button>
              <button className="ml-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                <span>Register</span>
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/services">Services</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center w-full justify-center">
                <LogIn className="h-4 w-4 mr-2" />
                <span>Login</span>
              </button>
            </div>
            <div className="mt-3 px-5">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center w-full justify-center">
                <UserPlus className="h-4 w-4 mr-2" />
                <span>Register</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
