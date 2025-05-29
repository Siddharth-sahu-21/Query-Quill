'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Innavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const router = useRouter();

  const navLinks = [
    { href: '/user/playground', label: 'Playground' },
    { href: '/user/dashboard', label: 'Projects' },
    { href: '/user/docs', label: 'Doc' },
    { href: '/user/examples', label: 'Example' },
    { href: '/user/about', label: 'About' },
    { href: '/user/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
    router.push('/'); // Redirect to home page
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-5 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-red-500 via-purple-500 to-yellow-500 text-transparent bg-clip-text leading-none">
          Query Quill
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg hover:text-blue-400 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className="block text-center bg-gradient-to-r from-red-600 to-purple-600 px-5 py-2 rounded-md font-medium hover:from-purple-600 hover:to-red-600 transition-all duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-gray-900 border-t border-gray-700 mt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-center text-lg hover:text-blue-400 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className="block w-full text-center bg-gradient-to-r from-red-600 to-purple-600 px-5 py-2 rounded-md font-medium hover:from-purple-600 hover:to-red-600 transition-all duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Innavbar;
