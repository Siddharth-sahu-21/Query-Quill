'use client';
import Link from 'next/link';
import React from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IconCheck, IconLoader3 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation'; // Import useRouter

const SignupSchema = yup.object().shape({
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
  const router = useRouter(); // Initialize router

  const signupForm = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmpassword: '',
    },
    onSubmit: (values, { resetForm, setSubmitting }) => {
      console.log(values); 

      axios.post('http://localhost:5000/user/add', values)
        .then((result) => {
          toast.success('User registered successfully');
          resetForm();
          router.push('/login');
        }).catch((err) => {
          console.log(err);
          toast.error('User registration failed');
          setSubmitting(false);
        });
    },
    validationSchema: SignupSchema,
  })

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 p-4 text-black">
      <div className="border border-gray-300 bg-white px-6 py-8 rounded-lg shadow-md w-full max-w-sm sm:w-1/3">
        <h2 className="flex justify-center text-4xl font-bold bg-gradient-to-r from-red-500 via-blue-600 to-red-500 text-transparent bg-clip-text mb-4">
          Sign-Up
        </h2>

        <form onSubmit={signupForm.handleSubmit}>
        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
            <input
              type="email"
              id="email"
              onChange={signupForm.handleChange}
              value={signupForm.values.email}
              className="block w-full border border-gray-400 rounded-md p-2 mb-4"
              required
            />
            {signupForm.touched.email && signupForm.errors.email && (
              <p className="text-xs text-red-600 mt-2" id="name-error">
                {signupForm.errors.email}
              </p>
            )}
          </div>
          <div>
          <label htmlFor="password" className="block font-medium">
            Password
          </label>
            <input
              type="password"
              id="password"
              onChange={signupForm.handleChange}
              value={signupForm.values.password}
              className="block w-full border border-gray-400 rounded-md p-2 mb-4"
              required
            />
            {signupForm.touched.password && signupForm.errors.password && (
              <p className="text-xs text-red-600 mt-2" id="name-password">
                {signupForm.errors.password}
              </p>
            )}
          </div>
          <div>
          <label htmlFor="confirmpassword" className="block font-medium">
            Confirm Password
          </label>
            <input
              type="password"
              id="confirmpassword"
              onChange={signupForm.handleChange}
              value={signupForm.values.confirmpassword}
              className="block w-full border border-gray-400 rounded-md p-2 mb-4"
              required
            />
            {signupForm.touched.confirmpassword &&
              signupForm.errors.confirmpassword && (
                <p className="text-red-600 text-xs mt-2" id="name-error">
                  {signupForm.errors.confirmpassword}
                </p>
              )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" id="terms" className="w-4 h-4" required />
            <label htmlFor="terms" className="text-sm">
              I agree to the{' '}
              <Link href="/" className="text-blue-500 underline">
                Terms & Conditions
              </Link>
              .
            </label>
          </div>
          <div>
            <button
              type="submit"
              disabled={signupForm.isSubmitting}
              className="block w-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 text-white font-semibold py-2 rounded-md hover:to-blue-900 hover:via-blue-600 hover:from-blue-900 transition-all duration-500"
            >
              {signupForm.isSubmitting ? (
                <IconLoader3 className="animate-spin " />
              ) : (
                'Sign-up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
