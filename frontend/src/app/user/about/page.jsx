'use client';
import React from 'react';
import Innavbar from '@/components/Innavbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Effects with Vector Designs */}
      <div className="absolute inset-0">
        {/* Enhanced Vector Lines */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path className="animate-draw-1" d="M0,30 Q25,5 50,30 T100,30" stroke="url(#gradient)" strokeWidth="0.1" fill="none"/>
            <path className="animate-draw-2" d="M0,50 Q25,25 50,50 T100,50" stroke="url(#gradient)" strokeWidth="0.1" fill="none"/>
            <path className="animate-draw-3" d="M0,70 Q25,45 50,70 T100,70" stroke="url(#gradient)" strokeWidth="0.1" fill="none"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7C3AED"/>
                <stop offset="100%" stopColor="#DB2777"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:6rem_6rem] blur-[0.5px]"></div>

        {/* Gradient Circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-float-delay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Innavbar />
        <main className="container mx-auto px-4 pt-24 pb-16 space-y-16">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Page Title */}
            <h1 className="text-6xl font-bold text-center">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                About Query Quill
              </span>
            </h1>

            {/* Introduction */}
            <section className="relative group p-8 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative space-y-6">
                <p className="text-xl text-gray-300 leading-relaxed">
                  Welcome to <span className="text-white font-semibold">Query Quill</span>, where we're revolutionizing the way developers work with GraphQL. Our platform provides intuitive tools for creating, managing, and optimizing GraphQL schemas and queries.
                </p>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Built by developers for developers, Query Quill streamlines the process of building robust GraphQL APIs, making it accessible to teams of all sizes.
                </p>
              </div>
            </section>

            {/* Vision & Mission */}
            <section className="grid md:grid-cols-2 gap-8">
              {/* Vision Card */}
              <div className="group p-8 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-violet-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                <div className="w-12 h-12 mb-4 rounded-lg bg-violet-500/10 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
                <p className="text-gray-300">
                  To create a world where GraphQL development is intuitive, efficient, and accessible to every developer.
                </p>
              </div>

              {/* Mission Card */}
              <div className="group p-8 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-violet-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                <div className="w-12 h-12 mb-4 rounded-lg bg-violet-500/10 flex items-center justify-center text-2xl">
                  🚀
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-gray-300">
                  To empower developers with tools that make GraphQL schema design and query building a seamless experience.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-pink-600/10 rounded-2xl"></div>
              <div className="relative px-8 py-16 text-center rounded-2xl border border-gray-800">
                <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
                <p className="text-gray-400 text-lg mb-8">
                  Have questions or feedback? We'd love to hear from you!
                </p>
                <a
                  href="/user/contact"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
                >
                  Contact Us →
                </a>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default About;