'use client';
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Page() {
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
        
        {/* Enhanced Vector Circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-float-delay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Rest of your content */}
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16 space-y-32">
          {/* Hero Section */}
          <section className="flex flex-col lg:flex-row items-center gap-16 min-h-[80vh]">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                    Build GraphQL Schemas
                  </span>
                  <br />
                  <span className="text-white">In Minutes.</span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed max-w-2xl animate-float">
                  Transform your API development with Query Quill's AI-powered GraphQL schema generator. 
                  Create, validate, and optimize your queries with ease.
                </p>
              </div>
              
              {/* Additional Features List */}
              <div className="grid grid-cols-2 gap-4 py-6">
                {quickFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-300">
                    <span className="text-violet-500">{feature.icon}</span>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Link
                  href="/login"
                  className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25 animate-glow"
                >
                  <span className="relative z-10">Get Started Free →</span>
                  <div className="absolute inset-0 -translate-y-full group-hover:translate-y-0 bg-gradient-to-b from-white/20 to-transparent transition-transform duration-300"></div>
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-gray-300 border border-gray-800 rounded-lg hover:bg-gray-900/50 transition-all duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Updated Code Preview */}
            <div className="flex-1 animate-float">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 animate-glow"></div>
                <div className="relative bg-[#1A1A1A] rounded-lg p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <pre className="text-sm font-mono">
                    <code className="text-gray-300">
                      <span className="text-violet-400">type</span>{" "}
                      <span className="text-emerald-400">User</span> {"{"}
                      <br />
                      {"  "}<span className="text-sky-400">id</span>: ID!
                      <br />
                      {"  "}<span className="text-sky-400">name</span>: String!
                      <br />
                      {"  "}<span className="text-sky-400">email</span>: String!
                      <br />
                      {"  "}<span className="text-sky-400">posts</span>: [Post!]!
                      <br />
                      {"}"}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section with enhanced content */}
          <section id="features" className="py-20">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold text-white">Why Choose Query Quill?</h2>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                Built by developers, for developers. Transform your GraphQL development workflow.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} 
                     className="group p-8 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-violet-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                >
                  <div className="w-12 h-12 mb-4 rounded-lg bg-violet-500/10 flex items-center justify-center text-2xl animate-float">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-pink-600/10 rounded-2xl"></div>
            <div className="relative px-8 py-16 text-center rounded-2xl border border-gray-800">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Build Your Schema?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of developers who are already using Query Quill to build better APIs.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
              >
                Start Building Now →
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

// Enhanced features array
const features = [
  {
    icon: "📝",
    title: "Visual Schema Builder",
    description: "Create GraphQL schemas through an intuitive interface. Design types, fields, and relationships visually."
  },
  {
    icon: "⚡",
    title: "Quick Query Generation",
    description: "Automatically generate optimized queries and mutations based on your schema structure."
  },
  {
    icon: "💾",
    title: "Import & Export",
    description: "Import existing schemas or export your work in multiple formats. Share and reuse your GraphQL designs."
  },
  {
    icon: "✅",
    title: "Real-time Validation",
    description: "Instant feedback on schema validity with live preview and error detection."
  },
  {
    icon: "🔄",
    title: "Version Control",
    description: "Track changes, save multiple versions, and manage your schema evolution over time."
  },
  {
    icon: "🛠️",
    title: "Developer Tools",
    description: "Built-in resolver templates, documentation generator, and testing playground."
  }
];

const quickFeatures = [
  { icon: "📋", text: "Visual Schema Designer" },
  { icon: "🔍", text: "Type Safety & Validation" },
  { icon: "💾", text: "Import/Export Options" },
  { icon: "🔄", text: "Version Management" }
];
