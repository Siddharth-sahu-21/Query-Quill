import Link from 'next/link';
import React from 'react'

const Home = () => {
  return (
    <div>
      <nav className="bg-gray-900 text-white p-4 shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-blue-400">Query Quill</Link>
      
      <div className="hidden md:flex space-x-6">
        <Link href="/playground" className="hover:text-blue-400">Playground</Link>
        <Link href="/docs" className="hover:text-blue-400">Docs</Link>
        <Link href="/examples" className="hover:text-blue-400">Examples</Link>
        <Link href="/about" className="hover:text-blue-400">About</Link>
        <Link href="/login" className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600">Login</Link>
      </div>
    </div>
  </nav></div>
  )
}

export default Home;