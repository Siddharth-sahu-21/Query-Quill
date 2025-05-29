'use client';
import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-8 mt-12 shadow-inner">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0">
        
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-yellow-500 text-transparent bg-clip-text">
            Query Quill
          </h2>
          <p className="text-sm text-gray-300 mt-2">
            Advanced GraphQL Query Generator — Built with ❤️ using MERN & Next.js
          </p>
        </div>

        {/* Contact Information Section */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-semibold text-gray-200">Contact Us</h3>
          <p className="text-sm text-gray-300">Email: <a href="mailto:query5566@gmail.com" className="hover:text-blue-400">query5566@gmail.com</a></p>
          <p className="text-sm text-gray-300">Phone: <a href="tel:+1234567890" className="hover:text-blue-400">+1 (234) 567-890</a></p>
          <p className="text-sm text-gray-300">Address: Lucknow, Uttar Predesh, India.</p>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-4">
          <a href="https://github.com/Siddharth-sahu-21" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <FaGithub size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <FaTwitter size={20} />
          </a>
          <a href="https://www.linkedin.com/in/siddharth-sahu-b21739360/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 mt-6">
        © {new Date().getFullYear()} Query Quill. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
