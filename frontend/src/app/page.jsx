'use client';
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar'; // Importing the Navbar component
import Footer from '@/components/Footer'; // Importing the Footer component

export default function Page() {
  return (
    <div>
      <Navbar />
     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 py-20 gap-16">
  {/* Hero Section */}
  <section className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-7xl">
    {/* Text */}
    <div className="flex-1 text-center lg:text-left">
      <h1 className="text-5xl font-extrabold mb-6 leading-tight">
        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
          Build GraphQL Schemas & Queries
        </span>
        <br />
        Instantly.
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Query Quill helps developers generate clean, production-ready GraphQL schemas and queries using an intuitive form-based interface powered by AI.
      </p>
      <Link
        href="/login"
 className="text-center bg-gradient-to-r from-red-600 to-purple-600 px-5 py-2 rounded-md font-medium hover:from-purple-600 hover:to-red-600 transition-all duration-300"
      >
        Get Started ➝
      </Link>
    </div>

    {/* Image */}
    <div className="flex-1">
      <img
  src="https://graphql.org/img/logo.svg"
  alt="GraphQL Logo"
  className="w-32 mx-auto rounded-xl shadow-lg"
/>

      <div className="bg-[#1e1e1e] mt-6 p-4 rounded-lg shadow-lg text-left text-sm font-mono text-gray-200">
        <p><span className="text-purple-400">type</span> <span className="text-green-400">User</span> {'{'}<br />
          &nbsp;&nbsp;<span className="text-blue-400">id</span>: ID!<br />
          &nbsp;&nbsp;<span className="text-blue-400">name</span>: String<br />
          &nbsp;&nbsp;<span className="text-blue-400">email</span>: String<br />
        {'}'}</p>
      </div>
    </div>
  </section>

  {/* Features Section */}
  <section className="w-full max-w-6xl text-center space-y-12 py-20 border-t border-gray-700">
    <h2 className="text-4xl font-bold">Why Use Query Quill?</h2>
    <div className="grid md:grid-cols-3 gap-10 text-left">
      <div>
        <h3 className="text-xl font-semibold mb-2 text-pink-400">📋 Form-Based Schema Builder</h3>
        <p className="text-gray-300">Easily define GraphQL types, fields, and arguments using intuitive forms—no manual coding needed.</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-purple-400">⚙️ Auto-Generated Queries</h3>
        <p className="text-gray-300">Create ready-to-run GraphQL queries and mutations from your schema automatically.</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-yellow-400">💾 Save & Download Code</h3>
        <p className="text-gray-300">Save your work and export clean, production-ready code files in one click.</p>
      </div>
    </div>
  </section>

  {/* How It Works */}
  <section className="w-full bg-gray-800 py-20 px-6 text-center">
    <h2 className="text-4xl font-bold mb-12">How It Works</h2>
    <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto text-left">
      <div>
        <h3 className="text-lg font-medium text-blue-400 mb-2">1. Fill the Form</h3>
        <p className="text-gray-300">Use the simple interface to add types, fields, and relationships step by step.</p>
      </div>
      <div>
        <h3 className="text-lg font-medium text-blue-400 mb-2">2. Preview Your Code</h3>
        <p className="text-gray-300">Instantly see your schema and auto-generated queries rendered in clean GraphQL syntax.</p>
      </div>
      <div>
        <h3 className="text-lg font-medium text-blue-400 mb-2">3. Download & Use</h3>
        <p className="text-gray-300">Save your project and download a ready-to-integrate `.graphql` or `.js` code file.</p>
      </div>
    </div>
  </section>

  {/* CTA */}
  <section className="w-full text-center py-20">
    <h2 className="text-3xl font-semibold mb-6">Ready to Build Your Schema?</h2>
    <Link
      href="/login"
      className="bg-purple-600 hover:bg-purple-500 px-6 py-3 text-lg rounded font-medium transition"
    >
      Try Query Quill Now
    </Link>
  </section>
</main>


      <Footer/>
    </div>
  );
}
