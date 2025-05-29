'use client';
import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-12 shadow-lg">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0">
        
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent transition-all duration-300 hover:from-purple-400 hover:via-fuchsia-500 hover:to-violet-400">
            Query Quill
          </h2>
          <p className="text-sm text-gray-300 mt-2">
            Advanced GraphQL Query Generator — Built with ❤️ using MERN & Next.js
          </p>
        </div>

        {/* Contact Information Section */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
            Contact Us
          </h3>
          <p className="text-sm text-gray-300">
            Email: <a href="mailto:query5566@gmail.com" className="hover:text-fuchsia-400 transition-colors">query5566@gmail.com</a>
          </p>
          <p className="text-sm text-gray-300">
            Phone: <a href="tel:+1234567890" className="hover:text-fuchsia-400 transition-colors">+1 (234) 567-890</a>
          </p>
          <p className="text-sm text-gray-300">Address: Lucknow, Uttar Pradesh, India.</p>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center space-y-2">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
            Follow Us
          </h3>
          <div className="flex space-x-4">
            <a 
              href="https://github.com/Siddharth-sahu-21" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-fuchsia-600/20 transition-all duration-300"
            >
              <FaGithub size={24} className="text-gray-300 hover:text-white transition-colors" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-fuchsia-600/20 transition-all duration-300"
            >
              <FaTwitter size={24} className="text-gray-300 hover:text-white transition-colors" />
            </a>
            <a 
              href="https://www.linkedin.com/in/siddharth-sahu-b21739360" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-fuchsia-600/20 transition-all duration-300"
            >
              <FaLinkedin size={24} className="text-gray-300 hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 mt-8">
        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
          © {new Date().getFullYear()} Query Quill.
        </span>
        <span className="ml-1 text-gray-500">All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
