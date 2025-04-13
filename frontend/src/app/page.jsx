import Link from 'next/link';
import React from 'react';

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-yellow-500 text-transparent bg-clip-text mb-4">
        Welcome to Query Quill
      </h1>
      <p className="text-lg text-gray-300 mb-6 text-center">
        Advanced GraphQL Query Generator built with the MERN stack & Next.js
      </p>

      <div className="space-x-4">
        <Link
          href="/playground"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          Go to Playground
        </Link>
        <Link
          href="/docs"
          className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          View Docs
        </Link>
      </div>
    </main>
  );
}
