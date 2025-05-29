'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/doc', label: 'Docs' },
    { href: '/example', label: 'Examples' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link
          href="/"
          className="relative group"
        >
          <div className="flex items-center space-x-2">
            {/* Logo Shape */}
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-purple-600 flex items-center justify-center transform rotate-45 group-hover:rotate-[225deg] transition-all duration-500 hover:shadow-lg hover:shadow-violet-500/25">
                <span className="text-2xl font-bold text-white transform -rotate-45 group-hover:rotate-[135deg] transition-all duration-500">
                  Q
                </span>
              </div>
              {/* Enhanced Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 via-fuchsia-600/30 to-purple-600/30 rounded-xl blur-md scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </div>

            {/* Text */}
            <div className="relative">
              <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-violet-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-400 group-hover:via-fuchsia-500 group-hover:to-violet-400">
                Query Quill
              </span>
              {/* Enhanced Text glow effect */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-purple-600/20 rounded-lg blur-md scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-lg text-gray-300 hover:text-white transition-colors duration-200 group px-3 py-2"
            >
              <span className="relative z-10">{link.label}</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 scale-0 group-hover:scale-100 rounded-lg transition-transform duration-200"></div>
            </Link>
          ))}
          <Link
            href="/login"
            className="text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 rounded-md font-medium hover:from-fuchsia-600 hover:to-violet-600 transition-all duration-300"
          >
            Get Started ➝
          </Link>
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

      {/* Mobile Nav - Updated styling for consistency */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-gray-900 border-t border-gray-700 mt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative block text-center text-lg text-gray-300 hover:text-white transition-colors duration-200 group px-3 py-2"
              onClick={() => setIsOpen(false)}
            >
              <span className="relative z-10">{link.label}</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 scale-0 group-hover:scale-100 rounded-lg transition-transform duration-200"></div>
            </Link>
          ))}
          <Link
            href="/login"
            className="block text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 rounded-md font-medium hover:from-fuchsia-600 hover:to-violet-600 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
