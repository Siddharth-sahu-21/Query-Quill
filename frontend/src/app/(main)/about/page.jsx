'use client';
import React from 'react';
import Navbar from '@/components/Navbar'; // Importing the Navbar component
import Footer from '@/components/footer';

const About= () => {
  return (
    <div>
      <Navbar/>
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12 px-4">
      <div className="w-full max-w-5xl bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-10 space-y-12">
        {/* Page Title */}
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-red-500 via-purple-500 to-yellow-500 text-transparent bg-clip-text">
          About Us
        </h1>

        {/* Introduction */}
        <section className="text-center space-y-4">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Welcome to <span className="font-semibold text-white">Query Quill</span>, your one-stop solution for generating and managing GraphQL queries with ease.
            We simplify the process of building queries for developers of all levels.
          </p>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            At Query Quill, our mission is to empower developers with tools that boost productivity, streamline workflows, and make query building intuitive and fun.
          </p>
        </section>

        {/* Vision Section */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-blue-400">Our Vision</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            We envision a world where developers can build amazing apps without wrestling with the intricacies of query syntax. Our goal is to make the GraphQL experience
            smooth, efficient, and joyful.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-center text-blue-400">Why Choose Us?</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-gray-300 text-lg leading-relaxed list-disc list-inside">
            <li>Elegant and easy-to-use interface.</li>
            <li>Live query preview and real-time validation.</li>
            <li>Fully customizable fields and arguments.</li>
            <li>Secure and reliable for all your GraphQL needs.</li>
          </ul>
        </section>

        {/* Contact Section */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-blue-400">Contact Us</h2>
          <p className="text-lg md:text-xl text-gray-300">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <p>
            <a
              href="mailto:support@queryquill.com"
              className="text-blue-400 underline hover:text-blue-500 transition"
            >
              support@queryquill.com
            </a>
          </p>
        </section>
      </div>
    </main>
    <Footer/>
    </div>
  );
};

export default About;
