import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
      <div className="logo">
      <Link to="/">
  <span className="h-12 bg-gradient-to-r from-orange-500 to-blue-400 bg-clip-text text-transparent font-extrabold text-3xl">
    UKUPHI
  </span>
</Link>
      </div>
      <nav className="main-nav flex items-center space-x-6">
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-orange-400">
              Home
            </Link>
          </li>
          <li>
            <Link to="/events" className="hover:text-orange-400">
              Events
            </Link>
          </li>
          <li>
            <Link to="/create-event" className="hover:text-orange-400">
              Create Event
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-orange-400">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:text-orange-400">
              Blog
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-orange-400">
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      <div className="user-actions flex space-x-4">
        <Link
          to="/login"
          className="py-2 px-4 border border-white rounded hover:bg-orange-400 hover:text-gray-800"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="py-2 px-4 border border-white rounded hover:bg-orange-400 hover:text-gray-800"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;

