'use client';
import React from 'react';
import Innavbar from '@/components/Innavbar';
import Footer from '@/components/Footer';

const Docs = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <Innavbar />

      <main className="flex-grow container mx-auto px-6 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-yellow-500">
            Getting Started with Query Quill
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Create an account, generate GraphQL schemas and queries using a simple form interface, and save them securely to your profile.
          </p>
        </header>

        {/* Account & Project Overview */}
        <section className="bg-gray-800 bg-opacity-50 p-8 rounded-xl shadow-md mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">1. Create Your Account</h2>
          <p className="text-gray-400">
            To get started, simply register an account or log in. Your projects and saved queries will be linked to your account using secure JWT-based authentication.
          </p>
        </section>

        {/* Query & Schema Builder */}
        <section className="bg-gray-800 bg-opacity-50 p-8 rounded-xl shadow-md mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">2. Use the Schema Builder</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Navigate to the playground after login.</li>
            <li>Fill out the schema form to define types, fields, and resolvers.</li>
            <li>Instant preview and validation as you type.</li>
          </ul>
        </section>

        {/* Save & Manage */}
        <section className="bg-gray-800 bg-opacity-50 p-8 rounded-xl shadow-md mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">3. Save & Download Projects</h2>
          <p className="text-gray-400 mb-2">
            Once you're done crafting your schema or query, you can:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Save it to your dashboard for future editing.</li>
            <li>Download it as a .graphql or .js file for integration.</li>
            <li>Manage multiple projects from your user profile.</li>
          </ul>
        </section>

        {/* Support */}
        <section className="bg-gray-800 bg-opacity-50 p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">Need Help?</h2>
          <p className="text-gray-300">
            Visit the <strong>Contact</strong> page or email us at <span className="text-blue-400">support@queryquill.dev</span> for support, feedback, or questions.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Docs;
