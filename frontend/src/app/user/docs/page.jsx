'use client';
import React from 'react';
import Innavbar from '@/components/innavbar';
import Footer from '@/components/Footer';
import { Book, Terminal, Save, HelpCircle } from 'lucide-react';

const Doc = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Vector Lines */}
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

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        
        {/* Gradient Circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-float-delay"></div>
      </div>

      <div className="relative z-10">
        <Innavbar />
        
        <main className="container mx-auto px-4 pt-24 pb-16">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Getting Started
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Create an account, generate GraphQL schemas and queries using a simple form interface, and save them securely to your profile.
            </p>
          </div>

          {/* Documentation Sections */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Account Section */}
            <div className="group relative p-8 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-violet-500/50 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <Book className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">1. Create Your Account</h2>
                  <p className="text-gray-400">
                    To get started, simply register an account or log in. Your projects and saved queries will be linked to your account using secure JWT-based authentication.
                  </p>
                </div>
              </div>
            </div>

            {/* Schema Builder Section */}
            <div className="group relative p-8 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-violet-500/50 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">2. Use the Schema Builder</h2>
                  <ul className="list-disc list-inside text-gray-400 space-y-2">
                    <li>Navigate to the playground after login.</li>
                    <li>Fill out the schema form to define types, fields, and resolvers.</li>
                    <li>Instant preview and validation as you type.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Save & Manage Section */}
            <div className="group relative p-8 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-violet-500/50 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <Save className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">3. Save & Download Projects</h2>
                  <p className="text-gray-400 mb-2">
                    Once you're done crafting your schema or query, you can:
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2">
                    <li>Save it to your dashboard for future editing.</li>
                    <li>Download it as a .graphql or .js file for integration.</li>
                    <li>Manage multiple projects from your user profile.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="group relative p-8 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-violet-500/50 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
                  <p className="text-gray-400">
                    Visit the <a href="/contact" className="text-violet-400 hover:text-violet-300 transition-colors">Contact</a> page or email us at{' '}
                    <a href="mailto:support@queryquill.dev" className="text-violet-400 hover:text-violet-300 transition-colors">
                      support@queryquill.dev
                    </a>
                    {' '}for support, feedback, or questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Doc;
