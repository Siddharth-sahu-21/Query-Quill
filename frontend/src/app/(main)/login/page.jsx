'use client'
import Link from 'next/link';
import React from 'react';

const Login = () => {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 p-4'>
      <div className='border border-gray-300 bg-white px-6 py-8 rounded-lg shadow-md w-full max-w-sm sm:w-1/3'>
        <h2 className='flex justify-center text-4xl font-bold bg-gradient-to-r from-red-500 via-blue-600 to-red-500 text-transparent bg-clip-text  mb-4'>Login</h2>
        
        <form>
          <label htmlFor="email" className='block font-medium'>Email</label>
          <input 
            type="email" 
            id="email" 
            className='block w-full border border-gray-400 rounded-md p-2 mb-4' 
            required 
          />

          <label htmlFor="password" className='block font-medium'>Password</label>
          <input 
            type="password" 
            id="password" 
            className='block w-full border border-gray-400 rounded-md p-2 mb-4' 
            required 
          />

          <div className='flex items-center gap-2 mb-4'>
            <input type="checkbox" id="terms" className='w-4 h-4' required />
            <label htmlFor="terms" className='text-sm'>
              I agree to the <Link href='/' className='text-blue-500 underline'>Terms & Conditions</Link>.
            </label>
          </div>

          <button 
            type='submit' 
            className='block w-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 text-white font-semibold py-2 rounded-md hover:from-blue-900 hover:via-blue-600 hover:to-blue-900 transition-all duration-500 mb-4'>
            Login
          </button>
          <hr/>
          <div className='text-center mb-4 font-medium'>create a new account</div>
          <button 
          type='submit' 
          className='block w-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 text-white font-semibold py-2 rounded-md hover:to-blue-900 hover:via-blue-600 hover:from-blue-900 transition-all duration-500 '>
            <Link href='/signup'>Sign-up</Link>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
