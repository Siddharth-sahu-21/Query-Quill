'use client'

import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {

  const router = useRouter(); // Initialize router
  const loginForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values, { resetForm, setSubmitting }) => {
      console.log(values);
      axios.post('http://localhost:5000/user/authenticate', values)
        .then((result) => {
          console.log(result);
          toast.success('login successfully');
          resetForm();
          localStorage.setItem('token', result?.data?.token);

          router.push('/user/dashboard'); // Redirect to dashboard after successful login
        }).catch((err) => {
          console.log(err);
          toast.error('login failed, please try again');
        });

    }

  });
  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 p-4 text-black'>
      <div className='border border-gray-300 bg-white px-6 py-8 rounded-lg shadow-md w-full max-w-sm sm:w-1/3'>
        <h2 className='flex justify-center text-4xl font-bold bg-gradient-to-r from-red-500 via-blue-600 to-red-500 text-transparent bg-clip-text  mb-4'>Login</h2>

        <form onSubmit={loginForm.handleSubmit}>
          <div>
            <label htmlFor="email" className='block font-medium'>Email</label>
            <input
              type="email"
              id="email"
              onChange={loginForm.handleChange}
              value={loginForm.values.email}
              className='block w-full border border-gray-400 rounded-md p-2 mb-4'
              required
            />
            {(loginForm.touched.email && loginForm.errors.email) &&
            (
              <p className='text-red-500 text-xs mt-2'>
                {loginForm.errors.email}
              </p>
            )}

          </div>
          <div>
            <label htmlFor="password" className='block font-medium'>Password</label>
            <input
              type="password"
              id="password"
              onChange={loginForm.handleChange}
              values={loginForm.values.password}
              className='block w-full border border-gray-400 rounded-md p-2 mb-4'
              required
            />
            {(loginForm.touched.password && loginForm.errors.password) && 
          (
            <p className='text-red-500 text-xs mt-2'>
              {loginForm.errors.password}
            </p>
          )}
          </div>
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
          <hr />
          <div className='text-center mb-4 font-medium'>create a new account</div>
          <button
            type='button'
            className='block w-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 text-white font-semibold py-2 rounded-md hover:to-blue-900 hover:via-blue-600 hover:from-blue-900 transition-all duration-500 '>
            <Link href='/signup'>Sign-up</Link>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
