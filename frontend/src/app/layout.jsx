// src/app/layout.jsx
import './globals.css'; // Import global styles (if you have Tailwind CSS or others)

import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Query Quill',
  description: 'Advanced GraphQL Query Generator using the MERN stack',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        
        <Toaster/>
        <main className="min-h-screen">{children}</main>
      
      </body>
    </html>
  );
}
