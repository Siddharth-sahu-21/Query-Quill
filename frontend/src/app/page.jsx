import Link from 'next/link';
import React from 'react'

const Home = () => {
  return (
    <div>
      <nav className="bg-gradient-to-r from-gray-900 to-gray-700  text-white p-4 shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <Link href="/" className="text-4xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-yellow-600 text-transparent bg-clip-text">Query Quill</Link>
      
      <div className="hidden md:flex space-x-6">
        <Link href="/playground" className="hover:text-blue-400">Playground</Link>
        <Link href="/docs" className="hover:text-blue-400">Docs</Link>
        <Link href="/examples" className="hover:text-blue-400">Examples</Link>
        <Link href="/about" className="hover:text-blue-400">About</Link>
        <Link href="/login" className="bg-gradient-to-r from-red-600 to-purple-600 px-4 py-2 rounded-md hover:from-purple-600 hover:to-red-600 transition-all duration-500 ">Login</Link>
      </div>
    </div>
  </nav>
  </div>
  )
}

export default Home;