import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  ShoppingCart,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import SearchBar from "./SearchBar";
import Logo from "../../assets/Books4All.png";
import {
  register,
  setUsername,
  toggleSignIn,
} from "../../utils/signedInSlice.js";
import { useNavigate } from "react-router-dom";

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
  const signIn = useSelector((state) => state.status.register);
  const loggedIn = useSelector((state) => state.status.signedIn);
  const username = useSelector((state) => state.status.username);
  const cart = useSelector((state) => state.checkout.cart);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto hover:cursor-pointer"
                src={Logo}
                alt="Logo"
                onClick={() => navigate("/")}
              />
            </div>
          </div>
          <div className="hidden md:block flex-grow max-w-xl mx-4">
            <SearchBar />
          </div>
          {!loggedIn ? (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
                  onClick={() => {
                    dispatch(register(true));
                    navigate("/login");
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  <span>Login</span>
                </button>
                <button
                  className="ml-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
                  onClick={() => {
                    dispatch(register(false));
                    navigate("/login");
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span>Register</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex ml-4 items-center md:ml-6">
              <button
                className="relative bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
                onClick={() => {
                  navigate("/checkout");
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span>Cart</span>
                {cart > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 text-xs text-white font-semibold flex justify-center items-center rounded-full">
                    {cart}
                  </div>
                )}
              </button>
              <div className="relative ml-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <User className="h-4 w-4 mr-2" />
                  <span>Hello {username}!</span>
                  {showDropdown ? (
                    <ChevronUp className="h-4 w-4 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-2" />
                  )}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        localStorage.clear();
                        dispatch(toggleSignIn(false));
                        dispatch(setUsername(""));
                        setShowDropdown(false);
                        navigate("/");
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
          <SearchBar />
          {!loggedIn ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center w-full justify-center"
                  onClick={() => {
                    dispatch(register(true));
                    navigate("/login");
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  <span>Login</span>
                </button>
              </div>
              <div className="mt-3 px-5">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center w-full justify-center"
                  onClick={() => {
                    dispatch(register(false));
                    navigate("/login");
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span>Register</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center w-full justify-center"
                  onClick={() => {
                    navigate("/checkout");
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  <span>Cart ({cart})</span>
                </button>
              </div>
              <div className="mt-3 px-5">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center w-full justify-center"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <User className="h-4 w-4 mr-2" />
                  <span>Hello {username}!</span>
                </button>
                {showDropdown && (
                  <div className="mt-3 space-y-1">
                    <button
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                    >
                      Profile
                    </button>
                    <a
                      href="#"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      onClick={() => {
                        localStorage.clear();
                        dispatch(toggleSignIn(false));
                        dispatch(setUsername(""));
                      }}
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
