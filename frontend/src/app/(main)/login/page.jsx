'use client'
import Link from 'next/link';
import React from 'react'

const Login = () => {
  return (
    <div className='text-black'>
      <div className='h-100 width-100 border border-black'>
      <form action="">
        <label htmlFor="gmail" className='block'>Gmail</label>
        <input type="gmail" id='gmail'className='block'  />
        <label htmlFor="password" className='block' >Password</label>
        <input type="password" className='block'  id='password' />
         <input type="radius" className='block' /><Link href='#'>terms and conditions</Link>
        <button className='border border-black block' type='submit'>Login</button>
      </form>
    </div>
    </div>
  )
}

export default Login;