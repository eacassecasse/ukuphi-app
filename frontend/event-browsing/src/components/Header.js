import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Logo Section */}
      <div className="logo">
        <Link to="/">
          <img src="/logo.png" alt="Platform Logo" className="h-12" />
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="main-nav flex items-center space-x-6">
        <ul className="flex space-x-6">
          {/* Links to pages */}
          <li>
            <Link to="/" className="hover:text-gray-400">
              Home
            </Link>
          </li>
          <li>
            <Link to="/events" className="hover:text-gray-400">
              Events
            </Link>
          </li>
          <li>
            <Link to="/create-event" className="hover:text-gray-400">
              Create Event
            </Link>
          </li>
          {/* Replace anchor links with Link components */}
          <li>
            <Link to="/about" className="hover:text-gray-400">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:text-gray-400">
              Blog
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-400">
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Actions Section (Login/Signup) */}
      <div className="user-actions flex space-x-4">
        {/* Replace anchor links with Link components */}
        <Link
          to="/login"
          className="py-2 px-4 border border-white rounded hover:bg-white hover:text-gray-800"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="py-2 px-4 border border-white rounded hover:bg-white hover:text-gray-800"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;
