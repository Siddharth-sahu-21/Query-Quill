'use client'
import Link from 'next/link';
import React from 'react'

const Login = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='border border-black px-8 py-6 w-1/5 '>
        <h2 className='text-2xl text-blue-400 text-center'>login</h2>
        
        <label htmlFor="email" className='block'>Email</label>
        <input type="email" className='block w-full border border-black rounded-md'/>
        <label htmlFor="email" className='block'>Password</label>
        <input type="password" className='block w-full border border-black rounded-md'/>
        

      </div>
      
    </div>
  )
}

export default Login;