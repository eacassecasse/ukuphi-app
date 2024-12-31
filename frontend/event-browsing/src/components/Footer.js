import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-800  text-white p-6 mt-6">
      <div className="container mx-auto text-center">
        {/* Footer Title */}
        <p className="mb-4 text-xl font-semibold">
          &copy; 2025 Ukphi. Connecting Communities Through Events. All rights reserved.
        </p>

        {/* Social Media Links */}
        <div className="mb-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 text-white hover:bg-blue-500 p-3 rounded-full transition-all duration-300"
          >
            <i className="fab fa-facebook"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 text-white hover:bg-blue-400 p-3 rounded-full transition-all duration-300"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 text-white hover:bg-pink-500 p-3 rounded-full transition-all duration-300"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 text-white hover:bg-blue-700 p-3 rounded-full transition-all duration-300"
          >
            <i className="fab fa-linkedin"></i>
          </a>
        </div>

        {/* Blog Link */}
        <div className="mb-4">
          <a
            href="/blog"
            className="text-white hover:text-gray-300"
          >
            Visit our Blog
          </a>
        </div>

        {/* Contact Info */}
        <div className="text-white mb-4">
          <p>Email: contact@ukphi.com</p>
          <p>Phone: +123 456 789</p>
        </div>

        {/* Legal Links */}
        <div className="text-white">
          <a
            href="/privacy-policy"
            className="mx-2 hover:text-gray-300"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            className="mx-2 hover:text-gray-300"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
