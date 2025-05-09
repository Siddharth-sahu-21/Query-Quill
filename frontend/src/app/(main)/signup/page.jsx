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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-8">
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
  );
};

export default SignUp;