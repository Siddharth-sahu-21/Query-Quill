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
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Vector Lines */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              className="animate-draw-1"
              d="M0,30 C25,10 40,50 50,30 S75,20 100,35"
              stroke="url(#gradient)"
              strokeWidth="0.3"
              fill="none"
            />
            <path
              className="animate-draw-2"
              d="M0,50 C20,30 40,70 60,50 S80,30 100,50"
              stroke="url(#gradient)"
              strokeWidth="0.3"
              fill="none"
            />
            <path
              className="animate-draw-3"
              d="M0,70 C30,80 45,40 70,65 S85,70 100,65"
              stroke="url(#gradient)"
              strokeWidth="0.3"
              fill="none"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="50%" stopColor="#D946EF" />
                <stop offset="100%" stopColor="#DB2777" />
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

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="group relative w-full max-w-sm"> {/* Changed max-w-md to max-w-sm and removed blur effects */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-pink-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
          <div className="relative w-full bg-gray-900 rounded-xl border border-gray-800/50 p-6 transition-all duration-500 group-hover:border-transparent">
            <h2 className="text-4xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                Welcome Back
              </span>
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
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                  placeholder="Enter your email"
                />
                {loginForm.touched.email && loginForm.errors.email && (
                  <p className="text-xs text-red-400 mt-1">{loginForm.errors.email}</p>
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
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                  placeholder="Enter your password"
                />
                {loginForm.touched.password && loginForm.errors.password && (
                  <p className="text-xs text-red-400 mt-1">{loginForm.errors.password}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 bg-gray-800 border-gray-700 text-violet-500 focus:ring-violet-500/20"
                  required
                />
                <label htmlFor="terms">
                  I agree to the{' '}
                  <Link href="/" className="text-violet-400 hover:text-violet-300 transition-colors">
                    Terms & Conditions
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loginForm.isSubmitting}
                className="w-full py-2.5 bg-violet-600 text-white rounded-lg font-medium 
    transition-all duration-200 
    hover:bg-violet-700 hover:scale-[0.99]
    active:scale-[0.97]
    disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-violet-600 disabled:cursor-not-allowed"
              >
                {loginForm.isSubmitting ? 'Logging in...' : 'Login'}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link href="/signup" className="text-violet-400 hover:text-violet-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;