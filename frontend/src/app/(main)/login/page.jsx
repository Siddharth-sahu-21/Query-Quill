'use client';

import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const router = useRouter();

  const loginForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      axios
        .post('http://localhost:5000/user/authenticate', values)
        .then((result) => {
          toast.success('Login successful');
          resetForm();
          localStorage.setItem('token', result?.data?.token);
          router.push('/user/dashboard');
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || 'Login failed, please try again');
          setSubmitting(false);
        });
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-8">
          Welcome Back
        </h2>

        <form onSubmit={loginForm.handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={loginForm.handleChange}
              value={loginForm.values.email}
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your email"
            />
            {loginForm.touched.email && loginForm.errors.email && (
              <p className="text-xs text-red-500 mt-1">{loginForm.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={loginForm.handleChange}
              value={loginForm.values.password}
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your password"
            />
            {loginForm.touched.password && loginForm.errors.password && (
              <p className="text-xs text-red-500 mt-1">{loginForm.errors.password}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <input type="checkbox" id="terms" className="w-4 h-4 text-blue-500" required />
            <label htmlFor="terms">
              I agree to the{' '}
              <Link href="/" className="underline text-blue-400 hover:text-blue-500">
                Terms & Conditions
              </Link>
              .
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loginForm.isSubmitting}
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-md shadow hover:from-purple-600 hover:to-indigo-600 transition duration-300"
          >
            {loginForm.isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          {/* Divider */}
          <div className="border-t border-gray-700 my-6" />

          {/* Sign Up */}
          <p className="text-center text-sm text-gray-400">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      
    </div>
  );
};

export default Login;