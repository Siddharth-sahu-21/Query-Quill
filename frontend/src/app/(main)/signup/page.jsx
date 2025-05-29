'use client';
import Link from 'next/link';
import React from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IconLoader3 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

// Validation Schema
const SignupSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmpassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const SignUp = () => {
  const router = useRouter();

  const signupForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmpassword: '',
    },
    validationSchema: SignupSchema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      axios
        .post('http://localhost:5000/user/add', values)
        .then(() => {
          toast.success('User registered successfully');
          resetForm();
          router.push('/login');
        })
        .catch((err) => {
          console.error(err);
          toast.error('User registration failed');
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
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="group relative w-full max-w-md">
          {/* Hover gradient border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-pink-600/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          {/* Form Container */}
          <div className="relative w-full bg-gray-900 rounded-lg border border-gray-800/50 p-6 transition-all duration-500 group-hover:border-transparent">
            <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-red-500 via-purple-500 to-yellow-500 text-transparent bg-clip-text mb-8">
              Create Account
            </h2>

            <form onSubmit={signupForm.handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  onChange={signupForm.handleChange}
                  value={signupForm.values.name}
                  className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter your name"
                  required
                />
                {signupForm.touched.name && signupForm.errors.name && (
                  <p className="text-xs text-red-500 mt-1">{signupForm.errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  onChange={signupForm.handleChange}
                  value={signupForm.values.email}
                  className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
                {signupForm.touched.email && signupForm.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{signupForm.errors.email}</p>
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
                  onChange={signupForm.handleChange}
                  value={signupForm.values.password}
                  className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
                {signupForm.touched.password && signupForm.errors.password && (
                  <p className="text-xs text-red-500 mt-1">{signupForm.errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-400">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmpassword"
                  onChange={signupForm.handleChange}
                  value={signupForm.values.confirmpassword}
                  className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Confirm your password"
                  required
                />
                {signupForm.touched.confirmpassword && signupForm.errors.confirmpassword && (
                  <p className="text-xs text-red-500 mt-1">{signupForm.errors.confirmpassword}</p>
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={signupForm.isSubmitting}
                className="w-full py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white font-semibold rounded-md hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center"
              >
                {signupForm.isSubmitting ? (
                  <IconLoader3 className="animate-spin w-5 h-5" />
                ) : (
                  'Sign Up'
                )}
              </button>

              {/* Redirect */}
              <p className="text-sm text-center text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-400 underline">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;