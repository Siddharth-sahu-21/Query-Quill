'use client'
import React from 'react';
import Link from 'next/link';
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

        <div className="flex flex-col space-y-2">
          <Link href="/playground" className="hover:text-blue-400">Playground</Link>
          <Link href="/docs" className="hover:text-blue-400">Docs</Link>
          <Link href="/examples" className="hover:text-blue-400">Examples</Link>
          <Link href="/about" className="hover:text-blue-400">About</Link>
        </div>

        <div className="flex space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <FaGithub size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <FaTwitter size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
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
